/// <reference path="../../../typings/chrome/chrome.d.ts" />
/// <reference path="../../../typings/underscore/underscore.d.ts" />
/// <reference path="../../../typings/zepto/zepto.d.ts" />
/// <reference path="../../../typings/md5/md5.d.ts" />
/// <reference path="../../../typings/pgwmodal/pgwmodal.d.ts" />

module nosub.contentScripts.bugReport {
    var API_ENDPOINT = 'https://script.google.com/macros/s/AKfycby0XuQfkm-akYUw3fpyqXfAFbJAVJJnjkEurfAZyRNHEmcT4IQ/exec';

    interface BugReport {
        url?: string;
        videoType?: string;
        extId?: string;
        extVersion?: string;
        userAgent?: string;
        debug?: boolean;
    }

    function sendBugreport(bugReport: BugReport) {
        var manifest = <{ version: string }>chrome.runtime.getManifest();

        bugReport.url = location.href;
        bugReport.extId = chrome.runtime.id;
        bugReport.extVersion = manifest.version;
        bugReport.userAgent = navigator.userAgent;
        bugReport.debug = typeof DEBUG !== 'undefined';

        // バグレポートを送信
        $('<script />')
            .prop('src', API_ENDPOINT + '?' + $.param(bugReport))
            .prop('async', true)
            .appendTo('body');
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
}