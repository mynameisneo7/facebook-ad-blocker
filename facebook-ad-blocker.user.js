// ==UserScript==
// @name         Facebook ad blocker
// @namespace    https://wiki.gslin.org/wiki/FacebookAdBlocker
// @version      0.20200710.1
// @description  Remove all ad from Facebook
// @author       Gea-Suan Lin <gslin@gslin.org>
// @match        https://www.facebook.com/*
// @grant        none
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    let observer = new MutationObserver(() => {
        document.querySelectorAll('div[data-pagelet^="FeedUnit_"]').forEach(div => {
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
                    console.info('Remove a Facebook ad element by detecting obfuscation element.');
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
