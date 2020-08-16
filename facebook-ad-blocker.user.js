// ==UserScript==
// @name         Facebook Ad Blocker
// @version      0.20200810.1-fork
// @description  Removes ads from Facebook
// @author       Jon South <https://github.com/mynameisneo7>
// @namespace    https://github.com/mynameisneo7/facebook-ad-blocker-userscript
// @updateURL    https://github.com/mynameisneo7/facebook-ad-blocker-userscript/raw/master/facebook-ad-blocker.meta.js
// @downloadURL  https://github.com/mynameisneo7/facebook-ad-blocker-userscript/raw/master/facebook-ad-blocker.user.js
// @match        https://www.facebook.com/*
// @grant        none
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    let observer = new MutationObserver(() => {
        document.querySelectorAll('div[data-pagelet^="FeedUnit_"], div[role="article"]').forEach(div => {
            // aria-label="Sponsored"
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
        });
    });

    observer.observe(document.documentElement, {
        attributes: false,
        childList: true,
        subtree: true,
    });
})();
