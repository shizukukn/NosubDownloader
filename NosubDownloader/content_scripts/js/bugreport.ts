// Path: content_scripts/js/bugreport.ts
// License: GPLv3<http://www.gnu.org/licenses/>
// Author: shizuku613<https://github.com/shizuku613>
// Copyright (C) KONO Shizuku 2014

/// <reference path="../../../typings/chrome/chrome.d.ts" />
/// <reference path="../../../typings/underscore/underscore.d.ts" />
/// <reference path="../../../typings/zepto/zepto.d.ts" />
/// <reference path="../../../typings/pgwmodal/pgwmodal.d.ts" />

import _ = require('underscore');

var API_ENDPOINT = 'https://script.google.com/macros/s/AKfycby0XuQfkm-akYUw3fpyqXfAFbJAVJJnjkEurfAZyRNHEmcT4IQ/exec';

interface BugReport {
    url?: string;

    /**
     * 投稿日時
     */
    postedOn?: number;

    /**
     * コメント
     */
    comment?: string;

    videoType?: string;
    extId?: string;
    extVersion?: string;
    locale?: string;
    userAgent?: string;
    debug?: boolean;
}

function sendBugreport(bugReport: BugReport) {
    var manifest = <{ version: string }>chrome.runtime.getManifest();

    bugReport.url = location.href;
    bugReport.extId = chrome.runtime.id;
    bugReport.extVersion = manifest.version;
    bugReport.locale = chrome.i18n.getUILanguage();
    bugReport.userAgent = navigator.userAgent;
    bugReport.debug = typeof DEBUG !== 'undefined';

    // 投稿日時
    var postedOn = getVideoPostedOn();

    if (postedOn) {
        bugReport.postedOn = postedOn.getTime();
    }

    // バグレポートを送信
    $('<script />')
        .prop('src', API_ENDPOINT + '?' + $.param(bugReport))
        .prop('async', true)
        .appendTo('body');
}

/**
    * ビデオの投稿日時を取得する
    */
function getVideoPostedOn(): Date {
    var elem = $('.tminfo .time');

    if(elem.length > 0){
        var date = new Date(elem.text());

        if (!isNaN(date.getTime())) {
            return date;
        }
    }

    return null;
}

/**
    * イベントを追加する
    */
function addEvents(): void {
    $(document).on('submit', '#nosub-downloader-inquiry form', inquerySubmitted);
}

function inquerySubmitted(e: Event): boolean {
    e.stopPropagation();
    e.preventDefault();

    var comment = $(e.target).find('textarea').val();
    sendInquery(comment);

    // 送信成功メッセージを表示
    $.pgwModal({
        title: chrome.i18n.getMessage('inquiryFormSubmittedTitle'),
        content: chrome.i18n.getMessage('inquiryFormSubmittedText')
    });

    return false;
}

/**
    * 不具合報告 (問い合わせ) を送信する
    */
function sendInquery(comment: string): void {
    sendBugreport({ comment: comment });
}

export function sendUnknownVideoTypeError(videoType: string): void {
    sendBugreport({ videoType: videoType });
}

export function showInquiryWindow(): void {
    var manifest = <{ default_locale: string }>chrome.runtime.getManifest();
    var locale = manifest.default_locale; // デフォルトロケールを取得

    // ロケールが日本語なら、日本語版を利用
    if (chrome.i18n.getUILanguage() == 'ja') {
        locale = 'ja';
    }

    // モーダルウィンドウ表示
    $.pgwModal({
        title: chrome.i18n.getMessage('inquiryWindowTitle'),
        url: chrome.extension.getURL('content_scripts/html/inquiry.' + locale + '.html'),
        maxWidth: 800
    });
}

$(addEvents);
