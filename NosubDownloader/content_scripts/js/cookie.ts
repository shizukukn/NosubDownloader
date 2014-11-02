// Path: content_scripts/js/cookie.ts
// License: GPLv3<http://www.gnu.org/licenses/>
// Author: shizuku613<https://github.com/shizuku613>
// Copyright (C) KONO Shizuku 2014

/// <reference path="../../../typings/chrome/chrome.d.ts" />

module nosub.contentScripts {

    export function setCookie(
        url: string,
        cookies: string,
        callback: () => void
        ): void {

        var message: SetCookieMessage = {
            type: 'cookie',
            url: url,
            cookies: cookies
        };

        chrome.runtime.sendMessage(message, () => {
            callback();
        });
    }
}