// Path: content_scripts/js/filename.js
// License: GPLv3<http://www.gnu.org/licenses/>
// Author: shizuku613<https://github.com/shizuku613>
// Copyright (C) KONO Shizuku 2014

/// <reference path="../../../typings/chrome/chrome.d.ts" />
/// <reference path="../../../typings/zepto/zepto.d.ts" />

import _ = require('underscore');

/**
* ページが表示されたことをバックグラウンドページへ通知する
*/
function sendOpenedVideoPageMessage(): void {
    var message: nosub.OpenedVideoPageMessage = {
        type: nosub.OPENED_VIDEO_PAGE_MESSAGE_TYPE
    };

    chrome.runtime.sendMessage(message);
}
/**
 * ページが非表示にされたことをバックグラウンドページへ通知する
 */
function sendClosedVideoPageMessage(): void {
    var message: nosub.ClosedVideoPageMessage = {
        type: nosub.CLOSED_VIDEO_PAGE_MESSAGE_TYPE
    };

    chrome.runtime.sendMessage(message);
}

/**
 * ページが表示された時に実行する処理
 */
function startScript(): void {
    sendOpenedVideoPageMessage();
}

/**
 * ページがアンロードされる時のイベントを追加する
 */
function addEvents(): void {
    $(window).on('beforeunload', e => {
        sendClosedVideoPageMessage();
        return true;
    });
}

startScript();
addEvents();
