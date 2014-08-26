// Path: content_scripts/js/mukiopress.js
// License: MIT License
// Copyright (C) KONO Shizuku 2014
var nosub;
(function (nosub) {
    (function (contentScripts) {
        /// <reference path="../../../typings/underscore/underscore.d.ts" />
        /// <reference path="../../../typings/zepto/zepto.d.ts" />
        (function (mukiopress) {
            'use strict';

            var MUKIOPRESS_URL = 'https://www.nosub.tv/wp-content/plugins/mukiopress/lianyue/?/';

            function getRequestUrl(type, vid) {
                return MUKIOPRESS_URL + type + '/' + vid;
            }

            function getVideoDownloadUrl(type, vid, cb) {
                var url = getRequestUrl(type, vid);

                $.get(url, function (data) {
                    if (_.isString(data) && data !== 'Error') {
                        cb(data);
                    }
                });
            }
            mukiopress.getVideoDownloadUrl = getVideoDownloadUrl;
        })(contentScripts.mukiopress || (contentScripts.mukiopress = {}));
        var mukiopress = contentScripts.mukiopress;
    })(nosub.contentScripts || (nosub.contentScripts = {}));
    var contentScripts = nosub.contentScripts;
})(nosub || (nosub = {}));
