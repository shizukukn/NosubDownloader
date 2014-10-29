// Path: content_scripts/js/xiami.ts
// License: GPLv3<http://www.gnu.org/licenses/>
// Author: shizuku613<https://github.com/shizuku613>
// Copyright (C) KONO Shizuku 2014

/// <reference path="../../../typings/underscore/underscore.d.ts" />
/// <reference path="../../../typings/zepto/zepto.d.ts" />

module nosub.contentScripts.xiami {
    'use strict';

    var XIAMI_URL_ID = 'http://www.xiami.com/song/playlist/id/';
    var XIAMI_URL_SONG = '/object_name/default/object_id/0/cat/json';

    // Porting from: xiami-downloader
    // Copyright (c) 2013 Timothy Qiu and other contributors
    // https://github.com/timothyqiu/xiami-downloader/blob/develop/xiami.py
    function decodeLocation(location: string): string {
        var videoUrl = location.slice(1);
        var urllen = videoUrl.length;
        var rows = parseInt(location.charAt(0), 10);

        var cols_base = urllen / rows;
        var rows_ex = urllen % rows;

        var matrix = [];
        var length;

        for (var r = 0; r < rows; ++r) {
            if (r < rows_ex) {
                length = cols_base + 1;
            }

            else {
                length = cols_base;
            }


            matrix.push(videoUrl.slice(0, length));
            videoUrl = videoUrl.slice(length);
        }

        videoUrl = '';

        for (var i = 0; i < urllen; ++i) {
            videoUrl += matrix[i % rows].charAt(i / rows);
        }

        videoUrl = decodeURIComponent(videoUrl);
        videoUrl = videoUrl.replace(/\^/g, '0');

        return videoUrl;
    }

    export function getVideoDownloadUrl(vid: string, cb: (urls: string[]) => void) {
        var jsonUrl = XIAMI_URL_ID + vid + XIAMI_URL_SONG;
        var videoUrls = [];

        $.get(jsonUrl, data => {
            // 失敗
            if (!data || !data['status'] || !data['data']) {
                return;
            }

            if (data['data']['trackList']) {
                var trackList = <{ location?: string }[]>data['data']['trackList'];

                _.each(trackList, track => {
                    if (track.location) {
                        var location = track.location;
                        var videoUrl = decodeLocation(location);

                        videoUrls.push(videoUrl);
                    }
                });

                cb(videoUrls);
            }
        });
    }
}