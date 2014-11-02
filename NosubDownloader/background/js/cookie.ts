// Path       : background/js/cookie.ts
// Description: クロスドメインで Cookie を書き込む処理
// License    : GPLv3<http://www.gnu.org/licenses/>
// Author     : shizuku613<https://github.com/shizuku613>
// Copyright (C) Shizuku Kono 2014

/// <reference path="../../../typings/async/async.d.ts" />
/// <reference path="../../../typings/underscore/underscore.d.ts" />
/// <reference path="../../typings/cookie.d.ts" />

module nosub.background {
    'use strict';

    var COOKIE_META_NAMES = ['domain', 'host-only', 'path', 'secure', 'http-only', 'session', 'max-age'];

    // Cookie メッセージを受け取って、Cookie を書き込む処理
    // 書き込み終了後、レスポンスを返す
    chrome.runtime.onMessage.addListener((message: SetCookieMessage, sender, sendResponse: SetCookieMessageCallback) => {
        // Cookie メッセージ以外は処理しない
        if (message.type !== 'cookie') {
            return;
        }

        // Cookie 文字列を解析する
        var cookies = cookie.parse(message.cookies);

        // Cookie を書き込む際に用いるデータ
        var details: chrome.cookies.SetDetails = { url: message.url };

        if (cookies['path']) {
            details.path = cookies['path'];
        }

        if (cookies['max-age']) {
            var maxAge = parseInt(cookies['max-age'], 10);
            details.expirationDate = _.now() + maxAge;
        }

        // 値を項目ごとに書き込む
        // (details を全項目で共有するため、並列処理は行わない)
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

                sendResponse(message); // 書き込み終了後にレスポンスを返す
            });

        // sendResponse を非同期に呼ぶ際に必要
        // true を返さないと、非同期に sendResponse を呼ぶことができない
        return true;

    });
}