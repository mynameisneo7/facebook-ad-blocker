// ==UserScript==
// @name         Facebook ad blocker
// @namespace    https://wiki.gslin.org/wiki/FacebookAdBlocker
// @version      0.20200703.2
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
            div.querySelectorAll('b[style="display: none;"]').forEach(b => {
                let span = b.closest('span');
                if (span.innerText.startsWith('Sponsored')) {
                    console.info('Remove a Facebook ad element.');
                    div.remove();
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
