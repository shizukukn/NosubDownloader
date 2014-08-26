// Path: background/js/referer.js
// License: MIT License
// Copyright (C) KONO Shizuku 2014
var nosub;
(function (nosub) {
    (function (background) {
        /// <reference path="../../../typings/chrome/chrome.d.ts" />
        /// <reference path="../../../typings/underscore/underscore.d.ts" />
        (function (referer) {
            'use strict';

            chrome.webRequest.onBeforeSendHeaders.addListener(function (details) {
                return {
                    requestHeaders: _.filter(details.requestHeaders, function (header) {
                        if (header.name == 'Referer' && header.value.indexOf('nosub.tv') > -1) {
                            return false;
                        }

                        return true;
                    })
                };
            }, {
                urls: [
                    'http://videotfs.tc.qq.com/*'
                ]
            }, [
                'requestHeaders',
                'blocking'
            ]);
        })(background.referer || (background.referer = {}));
        var referer = background.referer;
    })(nosub.background || (nosub.background = {}));
    var background = nosub.background;
})(nosub || (nosub = {}));
