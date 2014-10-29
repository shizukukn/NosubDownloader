// Path: background/js/headers.js
// License: GPLv3<http://www.gnu.org/licenses/>
// Author: shizuku613<https://github.com/shizuku613>
// Copyright (C) KONO Shizuku 2014

/// <reference path="../../../typings/chrome/chrome.d.ts" />
/// <reference path="../../../typings/underscore/underscore.d.ts" />

module nosub.background {
    'use strict';

    var IP_ADDR = new_random_ip();
    
    /**
     * 偽装する IP アドレスをランダムで生成する関数
     */
    function new_random_ip(): string {
        var ip_addr = '220.181.111.';
        ip_addr += Math.floor(Math.random() * 254) + 1; // 1-254
        return ip_addr;
    }

    chrome.webRequest.onBeforeSendHeaders.addListener(
        details => {
            var referer = _.find(details.requestHeaders, header => header.name == 'Referer');

            // xiami の場合、IP アドレス偽装
            if (referer && referer.value.indexOf('nosub.tv') > -1) {
                if (details.url.indexOf('xiami') > -1) {
                    // 関係するヘッダが存在する場合削除
                    details.requestHeaders = _.reject(details.requestHeaders, header => {
                        return _.contains(['Client-IP', 'X-Forwarded-For'], header.name);
                    });

                    // ヘッダを追加
                    details.requestHeaders.push({ name: 'Client-IP', value: IP_ADDR });
                    details.requestHeaders.push({ name: 'X-Forwarded-For', value: IP_ADDR });
                }
            }

            // Nosub からのアクセスはリファラを削除
            return {
                requestHeaders: _.filter(details.requestHeaders, header => {
                    if (header.name == 'Referer' &&
                        header.value.indexOf('nosub.tv') > -1) {
                        return false;
                    }

                    return true;
                })
            };
        },
        {
            urls: [
                'http://videotfs.tc.qq.com/*',
                'http://vip.cvideocache2.fc2.com/*',
                'http://www.xiami.com/*'
            ]
        },
        [
            'requestHeaders',
            'blocking'
        ]);
}
