// Path: background/js/referer.js
// License: GPLv3<http://www.gnu.org/licenses/>
// Author: shizuku613<https://github.com/shizuku613>
// Copyright (C) KONO Shizuku 2014

/// <reference path="../../../typings/chrome/chrome.d.ts" />
/// <reference path="../../../typings/underscore/underscore.d.ts" />

module nosub.background.referer {
    'use strict';

    chrome.webRequest.onBeforeSendHeaders.addListener(
        details => {
            //console.log(details.url);
            
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
                'http://vip.cvideocache2.fc2.com/*'
            ]
        },
        [
            'requestHeaders',
            'blocking'
        ]);
}
