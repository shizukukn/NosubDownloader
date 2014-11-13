// Path: content_scripts/js/sina.js
// License: GPLv3<http://www.gnu.org/licenses/>
// Author: shizuku613<https://github.com/shizuku613>
// Copyright (C) KONO Shizuku 2014

/// <reference path="../../../typings/underscore/underscore.d.ts" />
/// <reference path="../../../typings/zepto/zepto.d.ts" />

import _ = require('underscore');


var SINA_URL = 'http://v.iask.com/v_play.php?';

function getSinaVideoInfoUrl(vid: string): string {
    return SINA_URL + 'vid=' + vid;
}

function parseVideoInfo(xml: XMLDocument): string[]{
    var durls = xml.querySelectorAll('durl url');

    return _.map(durls, node => {
        return node.textContent;
    });
}

export function getVideoDownloadUrls(vid: string, cb: (urls: string[]) => void): void {
    var url = getSinaVideoInfoUrl(vid);

    $.get(url, (data: XMLDocument) => {
        var urls = parseVideoInfo(data);
        //console.log(urls);

        cb(urls);
    });
}
