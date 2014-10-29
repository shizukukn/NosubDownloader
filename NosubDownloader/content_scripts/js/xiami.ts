// Path: content_scripts/js/xiami.ts
// License: GPLv3<http://www.gnu.org/licenses/>
// Author: shizuku613<https://github.com/shizuku613>
// Copyright (C) KONO Shizuku 2014

/// <reference path="../../../typings/underscore/underscore.d.ts" />
/// <reference path="../../../typings/zepto/zepto.d.ts" />

module nosub.contentScripts.xiami {
    'use strict';

    interface XiamiDownloadTask {
        vid: string;
        callback: (urls: string[]) => void;
    }

    var XIAMI_URL_ID = 'http://www.xiami.com/song/playlist/id/';
    var XIAMI_URL_SONG = '/object_name/default/object_id/0/cat/json';

    /**
     * エラー時に追加する Cookie をパースするための正規表現
     */
    var ERROR_COOKIE_PATTERN = /document\.cookie\s*=\s*\"([^\"]*)\"/;

    /**
     * エラー発生のため、追加タスクを処理中であることを示す
     * true である間は、タスクが遅延実行される
     */
    var inProgress = false;

    /**
     * 遅延実行するタスクの一覧
     */
    var tasks: XiamiDownloadTask[] = [];

    /**
     * 遅延タスクを実行する
     */
    function doTasks(): void {
        if (!inProgress) {
            _.each(tasks, task => {
                _.defer(() => {
                    getVideoDownloadUrl(task.vid, task.callback, true);
                });
            });

            tasks.length = 0; // clear
        }
    }

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

    export function getVideoDownloadUrl(vid: string, cb: (urls: string[]) => void, retry: boolean = false) {

        function pushTask(): void {
            if (!retry) {
                tasks.push({ vid: vid, callback: cb });
            }
        }

        if (inProgress) {
            pushTask();
            return;
        }

        var jsonUrl = XIAMI_URL_ID + vid + XIAMI_URL_SONG;
        var videoUrls = [];

        $.ajax({
            url: jsonUrl,
            success: function (data) {
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
            },

            // エラー時は、他のタスクを一時停止させ、Cookie を上書きする
            error: function (xhr, errorType, error) {
                if (xhr.status == 403) {
                    if (xhr.responseText) {
                        var matches = xhr.responseText.match(ERROR_COOKIE_PATTERN);

                        if (matches) {
                            inProgress = true;
                            pushTask();

                            // Cookie を保存
                            var cookies = matches[1];
                            setCookie(jsonUrl, cookies, () => {
                                inProgress = false;
                                doTasks();
                            });
                        }
                    }
                }
            }

        });
    }
}