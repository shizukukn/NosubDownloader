// Path: background/js/cookie.ts
// License: GPLv3<http://www.gnu.org/licenses/>
// Author: shizuku613<https://github.com/shizuku613>
// Copyright (C) KONO Shizuku 2014

/// <reference path="../../../typings/async/async.d.ts" />
/// <reference path="../../../typings/underscore/underscore.d.ts" />
/// <reference path="../../typings/cookie.d.ts" />

module nosub.background {
    'use strict';

    var COOKIE_META_NAMES = ['domain', 'host-only', 'path', 'secure', 'http-only', 'session', 'max-age'];

    chrome.runtime.onMessage.addListener((message: CookieMessage, sender, sendResponse: (val: any) => void) => {
        if (message.type == 'cookie') {

            var cookies = cookie.parse(message.cookies);
            var details: chrome.cookies.SetDetails = { url: message.url };

            if (cookies['path']) {
                details.path = cookies['path'];
            }

            if (cookies['max-age']) {
                var maxAge = parseInt(cookies['max-age'], 10);
                details.expirationDate = _.now() + maxAge;
            }

            async.eachSeries(
                _.pairs(cookies),
                (ck, cb) => {
                    var name = ck[0];
                    var value = ck[1];

                    if (_.contains(COOKIE_META_NAMES, name)) {
                        cb(null, {});
                    }

                    else {
                        // 念のため、一度削除してから設定する
                        // (何故か二重設定されるバグが開発時に発生したため)
                        chrome.cookies.remove(
                            {
                                url: message.url,
                                name: name
                            }, () => {
                                details.name = name;
                                details.value = value;

                                console.log(details);
                                chrome.cookies.set(details, () => {
                                    cb(null, {});
                                });
                            });
                    }
                },
                err => {
                    if (err) {
                        console.error(err);
                    }

                    sendResponse(message);
                });

            // sendResponse を非同期に呼ぶ際に必要
            // true を返さないと、非同期に sendResponse を呼ぶことができない
            return true;
        }
    });
}