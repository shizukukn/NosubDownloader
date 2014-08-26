// Path: background/js/referer.js
// License: MIT License
// Copyright (C) KONO Shizuku 2014

/// <reference path="../../../typings/chrome/chrome.d.ts" />
/// <reference path="../../../typings/underscore/underscore.d.ts" />

module nosub.background.referer {
    'use strict';

    chrome.webRequest.onBeforeSendHeaders.addListener(
        details => {
            return {
                requestHeaders: _.filter(<any[]>details.requestHeaders, header => {
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
                'http://videotfs.tc.qq.com/*'
            ]
        },
        [
            'requestHeaders',
            'blocking'
        ]);
}
