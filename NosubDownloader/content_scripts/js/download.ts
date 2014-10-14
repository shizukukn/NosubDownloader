// Path: content_scripts/js/download.js
// License: GPLv3<http://www.gnu.org/licenses/>
// Author: shizuku613<https://github.com/shizuku613>
// Copyright (C) KONO Shizuku 2014

/// <reference path="../../../typings/chrome/chrome.d.ts" />
/// <reference path="../../../typings/underscore/underscore.d.ts" />
/// <reference path="../../../typings/zepto/zepto.d.ts" />
/// <reference path="../../../typings/md5/md5.d.ts" />
/// <reference path="../../../typings/pgwmodal/pgwmodal.d.ts" />

module nosub.contentScripts.download {
    'use strict';

    var FC2_MAGICK = '_gGddgPfeaf_gzyr';
    var SCRIPT_START_INTERVAL = 50; // ms

    var VIDEO_SCRIPT_SELECTOR = '#mkplayer-content + script';
    var VIDEO_SELECT_SELECTOR = '#mkplayer-sectsel select';

    interface Video {
        url?: string;
        urls?: string[];
    }

    var videos: Video[] = [];
    var downloadButton: ZeptoCollection = null;

    function parseParams(str: string) {
        var params: { [key: string]: string } = {};

        var pairs = str.split('&');

        _.each(pairs, function (pair) {
            var index = pair.indexOf('=');

            if (index > 0) {
                var key = pair.slice(0, index);
                var value = pair.slice(index + 1);
                params[key] = value;
            }
        });

        return params;
    }

    function getFc2VideoDownloadUrl(vid: string, cb: (url: string) => void) {
        var getInfoUrl = 'http://video.fc2.com/ginfo.php?mimi=' +
            CybozuLabs.MD5.calc(vid + FC2_MAGICK) +
            '&v=' + vid + '&upid=' + vid + '&otag=1';
        //console.log(getInfoUrl);

        $.get(getInfoUrl, data => {
            var params = parseParams(data);

            if (params['filepath'] && params['mid']) {
                var videoUrl = params['filepath'] + '?mid=' + params['mid'];
                //console.log(videoUrl);

                cb(videoUrl);
            }
        });
    }

    function parseVideoScript() {
        var pageScript = $(VIDEO_SCRIPT_SELECTOR);
        //console.log(script[0]);
        //console.log(script.text());

        var scriptText = pageScript.text();
        scriptText = scriptText.replace(/addVideo\(/g, 'addVideoDownloader(');
        scriptText = scriptText.replace(/renderVideo\(/g, 'renderVideoDownloader(');

        var newScript = $('<script />');
        newScript.text(scriptText);
        
        //console.log(newScript);

        $('head').append(newScript);
    }

    function setDownloadLink(): void {
        var element = downloadButton;
        if (element == null) return;

        var select = $(VIDEO_SELECT_SELECTOR);
        var selectedIndex = 0; // Default source

        // If exist select box
        if (select.length > 0) {
            selectedIndex = parseInt(select.val(), 10);
        }
        
        // Clear download buttons
        element.find('.download').empty();

        if (videos[selectedIndex]) {
            var video = videos[selectedIndex];

            var addButton = (url: string, text: string) => {
                var link = $('<a download />')
                    .text(text)
                    .attr('href', url)
                    .css({
                        cursor: 'pointer',
                        margin: '0 3px 0 0'
                    });

                element.find('.download')
                    .append(link);
            };

            if (video['url']) {
                addButton(video['url'], chrome.i18n.getMessage('downloadButtonText'));
            }

            else if (video['urls']) {
                _.each(video['urls'], (url, index) => {
                    if (index == 0) {
                        addButton(url, chrome.i18n.getMessage('downloadButtonText') + ' [1]');
                    }

                    else {
                        addButton(url, '[' + (index + 1) + ']');
                    }
                });
            }
            
            else {
                element.find('.download')
                    .text(chrome.i18n.getMessage('downloadButtonErrorText'));
            }
        }

        else {
            element.find('.download')
                .text(chrome.i18n.getMessage('downloadButtonErrorText'));
        }
    }

    function changeVideoSelected(e: Event): boolean {
        setDownloadLink();
        return undefined;
    }

    function createDownloadButton() {
        var button = $(
            '<span class="wrap">' +
            '<span class="download"></span> ' +
            '<small class="description"></small> ' +
            '<small class="form"><a href="#"></a></small>' +
            '</span>');

        button
            .css({
                margin: '0 0 0 5px',
                padding: '2px 5px'
            });

        button.find('small.description')
            .text(chrome.i18n.getMessage('downloadDescription'));

        button.find('small.form a')
            .text(chrome.i18n.getMessage('inquiryFormLinkText'))
            .click(showModalWindow);
        
        $('#mkplayer-sectsel').append(button);
        downloadButton = button;
    };

    /**
     * イベントを追加する
     */
    function addEvents(): void {
        var select = $(VIDEO_SELECT_SELECTOR);

        // Default source
        if (select.length > 0) {
            select.change(changeVideoSelected);
        }
    }

    /**
     * スクリプトを開始してよい場合に true を返す
     * Return true if the script may begin
     */
    function isScriptCanStart(): boolean {
        var selectors = [VIDEO_SCRIPT_SELECTOR, VIDEO_SELECT_SELECTOR];

        // すべてのセレクタの要素が存在する場合に true
        return _.every(selectors, s => $(s).length > 0);
    }

    /**
     * モーダルウィンドウを表示する
     */
    function showModalWindow(e: Event): void {
        // イベント伝搬停止
        e.stopPropagation();
        e.preventDefault();

        var manifest = <{ default_locale: string }>chrome.runtime.getManifest();
        var locale = manifest.default_locale; // デフォルトロケールを取得

        // ロケールが日本語なら、日本語版を利用
        if ((<any>chrome.i18n).getUILanguage() == 'ja') {
            locale = 'ja';
        }

        // モーダルウィンドウ表示
        $.pgwModal({
            title: chrome.i18n.getMessage('inquiryWindowTitle'),
            url: chrome.extension.getURL('content_scripts/html/inquiry.' + locale + '.html'),
            maxWidth: 800
        });
    }

    function startScript(): void {
        // 開始できない場合、遅延させる
        if (!isScriptCanStart()) {
            _.delay(startScript, SCRIPT_START_INTERVAL);
            return;
        }

        parseVideoScript();
        createDownloadButton();
        addEvents();
        setDownloadLink();
    }
       
    function addVideoDownloader(
        w: number,
        h: number,
        flashvars: string,
        ptitle: string,
        description: string,
        player: string): void {

        var params = parseParams(flashvars);
        var index = videos.length;
        videos.push({});

        var updateVideoUrl = (url: string) => {
            videos[index] = { url: url };
            setDownloadLink();
        };

        var updateVideoUrls = (urls: string[]) => {
            videos[index] = { urls: urls };
            setDownloadLink();
        };

        switch (params['type']) {
            case 'video':
            case 'sound':
                updateVideoUrl(params['file']);
                break;

            case 'fc2':
                getFc2VideoDownloadUrl(params['vid'], updateVideoUrl);
                break;

            case 'qq':
            case 'veoh':
                mukiopress.getVideoDownloadUrl(
                    params['type'], params['vid'], updateVideoUrl);
                break;

            case 'sina':
                sina.getVideoDownloadUrls(params['vid'], (urls) => {
                    updateVideoUrls(urls);
                });

                break;

            //case 'xiami':
            //    break;

            case 'empty':
                break;

            default:
                console.error('Unknown video type `' + params['type'] + '`');

                if (typeof DEBUG !== 'undefined') {
                    alert('Unknown video type `' + params['type'] + '`');
                }
        }
    }

    function renderVideoDownloader() { }

    var extWindow: any = window;
    extWindow.addVideoDownloader = addVideoDownloader;
    extWindow.renderVideoDownloader = renderVideoDownloader;

    startScript();
}
