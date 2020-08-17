// ==UserScript==
// @name         Facebook Ad Blocker
// @version      0.20200816.0
// @description  Removes ads from Facebook
// @author       Jon South <https://github.com/mynameisneo7>
// @namespace    https://github.com/mynameisneo7/facebook-ad-blocker
// @supportURL   https://github.com/mynameisneo7/facebook-ad-blocker/issues
// @updateURL    https://github.com/mynameisneo7/facebook-ad-blocker/raw/master/facebook-ad-blocker.meta.js
// @downloadURL  https://github.com/mynameisneo7/facebook-ad-blocker/raw/master/facebook-ad-blocker.user.js
// @match        https://www.facebook.com/*
// @grant        none
// @license      MIT
// ==/UserScript==

(function() {
  'use strict';

  let observer = new MutationObserver(() => {
    // Check feed posts
    document.querySelectorAll('div[data-pagelet^="FeedUnit_"], div[role="article"]').forEach(div => {
      div.querySelectorAll('div[aria-label="Sponsored"]').forEach(span => {
        console.info('Remove a Facebook ad element by aria-label="Sponsored".');
        div.remove();
        return;
      });

      div.querySelectorAll('span').forEach(span => {
        if (span.innerText.startsWith('Sponsored')) {
          console.info('Remove a Facebook ad element by starting with "Sponsored".');
          div.remove();
          return;
        }
      });

      div.querySelectorAll('b[style="display: none;"]').forEach(b => {
        let span = b.closest('span');
        if (span.innerText.startsWith('Sponsored')) {
          console.info('Remove a Facebook ad element by detecting obfuscation elements.');
          div.remove();
          return;
        }
      });

      div.querySelectorAll('span').forEach(span => {
        if (span.innerText.startsWith('Suggested for You')) {
          console.info('Remove a Facebook ad element starting with "Suggested for You".');
          div.remove();
          return;
        }
      });
    });

    // Remove Stories and Rooms block above feed
    document.querySelectorAll('div[data-pagelet^="Stories"], div[data-pagelet^="VideoChatHomeUnit"]').forEach(d => {
      d.remove();
      console.info('Remove Stories/Rooms block.');
      return;
    });

    // Check for Sponsored sidebar
    document.querySelectorAll('div[data-pagelet="RightRail"] > div').forEach(div => {
      div.querySelectorAll('span').forEach(span => {
        if (span.innerText.startsWith('Sponsored')) {
          console.info('Remove a Facebook Sponsored ad sidebar block.');
          div.remove();
          return;
        }
      })
    });
  });

  observer.observe(document.documentElement, {
    attributes: false,
    childList: true,
    subtree: true,
  });

})();
