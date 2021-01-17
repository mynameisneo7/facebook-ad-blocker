// ==UserScript==
// @name         Facebook Ad Blocker
// @version      0.20210117.0
// @description  Removes ads from Facebook
// @author       Jon South <https://github.com/mynameisneo7>
// @namespace    https://github.com/mynameisneo7/facebook-ad-blocker
// @supportURL   https://github.com/mynameisneo7/facebook-ad-blocker/issues
// @updateURL    https://github.com/mynameisneo7/facebook-ad-blocker/raw/master/facebook-ad-blocker.meta.js
// @downloadURL  https://github.com/mynameisneo7/facebook-ad-blocker/raw/master/facebook-ad-blocker.user.js
// @match        https://www.facebook.com/*
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @run-at       document-idle
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// ==/UserScript==

(function() {
  'use strict';

  // Main
  function scanPage() {
    var conf_adblocks = GM_config.get('Ads');
    var conf_stories = GM_config.get('StoriesRooms');
    var conf_suggest = GM_config.get('Suggested');
    var conf_people = GM_config.get('People');
    var conf_partner = GM_config.get('Partnerships');
    var conf_testing = GM_config.get('Experimental');

    // Check feed posts
    document.querySelectorAll('div[data-pagelet^="FeedUnit_"], div[role="article"]').forEach(div => {
      // "Sponsored" blocks
      if (conf_adblocks == true) {
        div.querySelectorAll(
          'div[aria-label="Sponsored"],' +
          'span[aria-label="Sponsored"] span[aria-label="Sponsored"],' +
          'a[aria-label="Sponsored"]'
        ).forEach(element => {
          console.info('Remove ad element: aria-label="Sponsored".');
          div.remove();
          return;
        });

        div.querySelectorAll('b[style="display: none;"]').forEach(b => {
          let span = b.closest('span');
          if (span.innerText.startsWith('Sponsored')) {
            console.info('Remove ad element with obfuscation elements.');
            div.remove();
            return;
          }
        });
      }

      // Check spans
      div.querySelectorAll('span').forEach(span => {
        if (conf_adblocks == true) {
          if (span.innerText.startsWith('Sponsored')) {
            console.info('Remove ad element: "Sponsored".');
            div.remove();
            return;
          }
        }

        if (conf_people == true) {
          if (span.innerText.startsWith('People You May Know')) {
            console.info('Remove element: "People You May Know".');
            div.remove();
            return;
          }

          if (span.innerText.startsWith('Suggested') && !span.innerText.startsWith('Suggested for You')) {
            console.info('Remove ad element: "Suggested".');
            div.remove();
            return;
          }
        }

        if (conf_suggest == true) {
          if (span.innerText.startsWith('Suggested for You')) {
            console.info('Remove ad element: "Suggested for You".');
            div.remove();
            return;
          }
        }
      });

      // "Paid Partnership" posts
      if (conf_partner == true) {
        div.querySelectorAll('a').forEach(span => {
          if (span.innerText.startsWith('Paid Partnership')) {
            console.info('Remove ad element: "Paid Partnership".');
            div.remove();
            return;
          }
        });
      }
    });

    // Check for Sponsored sidebar
    if (conf_adblocks == true) {
      if (conf_testing == true) {
        // De-obfuscate (experimental)
        let ad_header = document.querySelector('span[aria-label="Advertiser link"]').closest('h3');
        ad_header.querySelectorAll('span[style="position: absolute; top: 3em;"]').forEach(span => {
          span.remove();
        });
      }

      // Scan for sidebar
      document.querySelectorAll('div[data-pagelet="RightRail"] > div').forEach(div => {
        div.querySelectorAll('span').forEach(span => {
          if (span.innerText.startsWith('Sponsored')) {
            console.info('Remove ad sidebar block.');
            div.remove();
            return;
          }
        })
      });
    }

    // Remove Stories and Rooms block above feed
    if (conf_stories == true) {
      document.querySelectorAll('div[data-pagelet^="Stories"], div[data-pagelet^="VideoChatHomeUnit"]').forEach(d => {
        console.info('Remove Stories/Rooms element.');
        d.remove();
        return;
      });
    }
  }

  // Config outer frame css
  var gmf_css = {
    "inset": 0,
    "border": "1px solid rgb(72, 72, 72)",
    "height": "75%",
    "width": "75%",
    "margin": "10% auto",
    "opacity": 1,
    "overflow": "auto",
    "padding": 0,
    "position": "fixed",
    "z-index": 9999,
    "display": "flex",
    "max-width": "40em",
    "max-height": "24em",
    "filter": "drop-shadow(6px 6px 8px #000)",
    "border-radius": "8px",
  };

  // Config inner css
  var gmc_css = [
    'body { background-color: rgb(28, 30, 33); }',
    '#FbABv1 * { color: rgb(228, 230, 235); font-family: Segoe UI Historic, Segoe UI, Helvetica, Arial, sans-serif; }',
    '#FbABv1 a { color: rgb(176, 179, 184); }',
    '#FbABv1 { background-color: rgb(28, 30, 33); }',
    '#FbABv1 input[type="radio"] { margin-right: 8px; }',
    '#FbABv1 .indent40 { margin-left: 40%; }',
    '#FbABv1 .field_label { font-size: 12px; font-weight: bold; margin-right: 6px; }',
    '#FbABv1 .radio_label { font-size: 12px; }',
    '#FbABv1 .block { display: block; }',
    '#FbABv1 .saveclose_buttons { cursor: pointer; background-color: rgb(28, 30, 33); border-radius: 5px; margin: 16px 10px 10px; padding: 2px 12px; }',
    '#FbABv1 .saveclose_buttons:hover { color: rgb(28, 30, 33); background-color: rgb(228, 230, 235); }',
    '#FbABv1 .reset, #FbABv1 .reset a, #FbABv1_buttons_holder { text-align: right; }',
    '#FbABv1 .config_header { font-size: 20pt; margin: 0 0 0.4em; }',
    '#FbABv1 .config_desc, #FbABv1 .section_desc, #FbABv1 .reset { font-size: 9pt; }',
    '#FbABv1 .center { text-align: center; }',
    '#FbABv1 .section_header_holder { margin-top: 8px; }',
    '#FbABv1 .config_var { margin: 0 1em 4px 1em; }',
    '#FbABv1 .section_header { background: #414141; border: 1px solid #000; color: #FFF; font-size: 13pt; margin: 0; }',
    '#FbABv1 .section_desc { background: #EFEFEF; border: 1px solid #CCC; color: #575757; font-size: 9pt; margin: 0 0 6px; }',
  ].join('\n')

  // Customize config title
  var gm_title = document.createElement('a');
  gm_title.textContent = 'FB Ad Blocker';
  gm_title.href = 'https://github.com/mynameisneo7/facebook-ad-blocker/';
  gm_title.target = '_blank';

  // Setup GM_config options
  GM_config.init(
  {
    'id': 'FbABv1', // The id used for this instance of GM_config
    'title': gm_title,
    'fields': {
      'Ads':  {
        'label': 'Block ad posts and sidebar',
        'type': 'checkbox',
        'default': true
      },
      'Suggested':  {
        'label': 'Block "Suggested For You"',
        'type': 'checkbox',
        'default': true
      },
      'Partnerships':  {
        'label': 'Block "Paid Partnership"',
        'type': 'checkbox',
        'default': true
      },
      'StoriesRooms':  {
        'label': 'Remove Stories/Rooms',
        'type': 'checkbox',
        'default': false
      },
      'People':  {
        'label': 'Block "People You May Know"',
        'type': 'checkbox',
        'default': false
      },
      'Experimental':  {
        'label': 'Experimental features (may break page)',
        'type': 'checkbox',
        'default': false
      },
    },
    'css': gmc_css,
    'events': {
      'open': function(doc,win,form) {
        Object.assign(form.style, gmf_css);
        doc.head.querySelectorAll('style').forEach(style => { style.remove(); });
        var style = doc.createElement('style');
        style.type = 'text/css';
        style.innerHTML = gmc_css;
        doc.head.appendChild(style);
      },
    }
  });

  // Watch for page changes
  let observer = new MutationObserver(scanPage);
  observer.observe(document.documentElement, {
    attributes: false,
    childList: true,
    subtree: true,
  });

  // Set up config button -- Ugly for now
  function initConfig() {
    var bail = false;
    if (document.getElementById('fbab-conf') == null) {
      document.querySelectorAll('div[data-pagelet="LeftRail"]').forEach(div => {
        div.querySelectorAll('span').forEach(span => {
          if (bail != true && span.innerText.startsWith('Your Shortcuts')) {
            // Could not get this to insert any other way...
            span.innerHTML = 'Your Shortcuts <span id="fbab-conf">⚙</span>';

            let conf_button = document.getElementById('fbab-conf');
            conf_button.style = 'color: #385898; cursor: pointer;';
            conf_button.addEventListener("click", function(){
              GM_config.open(); return false;
            });
            console.info('Created config button.');

            // Don't continue
            bail = true;
            return;
          }
        });
      });
    }

    // Retry in case the element isn't found
    if (init_retries-- > 0) {
      setTimeout(initConfig, 1000);
    }
  }

  // Set us up the init
  var init_retries = 5;
  initConfig();
})();
