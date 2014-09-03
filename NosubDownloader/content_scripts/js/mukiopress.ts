// Path: content_scripts/js/mukiopress.js
// License: MIT License
// Author: shizuku613<https://github.com/shizuku613>
// Copyright (C) KONO Shizuku 2014

/// <reference path="../../../typings/underscore/underscore.d.ts" />
/// <reference path="../../../typings/zepto/zepto.d.ts" />

module nosub.contentScripts.mukiopress {
    'use strict';

    var MUKIOPRESS_URL = 'https://www.nosub.tv/wp-content/plugins/mukiopress/lianyue/?/';

    function getRequestUrl(type: string, vid: string): string {
        return MUKIOPRESS_URL + type + '/' + vid;
    }

    export function getVideoDownloadUrl(
        type: string,
        vid: string,
        cb: (url: string) => void): void {

        var url = getRequestUrl(type, vid);

        $.get(url, data => {
            if (_.isString(data) && data !== 'Error') {
                cb(data);
            }
        });
    }
}
