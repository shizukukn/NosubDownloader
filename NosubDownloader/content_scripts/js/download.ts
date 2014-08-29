// Path: content_scripts/js/download.js
// License: MIT License
// Copyright (C) KONO Shizuku 2014

/// <reference path="../../../typings/chrome/chrome.d.ts" />
/// <reference path="../../../typings/underscore/underscore.d.ts" />
/// <reference path="../../../typings/zepto/zepto.d.ts" />
/// <reference path="../../typings/md5/md5.d.ts" />

declare var DEBUG: boolean;

module nosub.contentScripts.download {
    'use strict';

    var FC2_MAGICK = '_gGddgPfeaf_gzyr';
    var INQUIRY_FORM = 'https://docs.google.com/forms/d/1WMYu-JU91Bv11l9Z5oRB-wETDpDUcgfUOMbO1KOiNrk/viewform';

    interface Video {
        url?: string;
    }

    var videos: Video[] = [];

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
        var pageScript = $('#mkplayer-content + script');
        //console.log(script[0]);
        //console.log(script.text());

        var scriptText = pageScript.text();
        scriptText = scriptText.replace(/addVideo\(/g, 'addVideoDownloader(');
        scriptText = scriptText.replace(/renderVideo\(/g, 'renderVideoDownloader(');

        var newScript = $('<script />');

        newScript.text(
            scriptText
            );
        
        //console.log(newScript);

        $('body').append(newScript);
    }

    function setDownloadLink(e: Event): boolean {
        var element = $(e.target);
        var select = $('#mkplayer-sectsel select');
        var selectedIndex = 0; // Default source

        if (select.size() > 0) {
            selectedIndex = parseInt(select.val(), 10);
        }

        //console.log(videos);
        if (videos[selectedIndex]) {
            var video = videos[selectedIndex];

            if (video['url']) {
                element.attr('href', video['url']);
                element.css('cursor', 'pointer');
                return undefined;
            }
        }

        // empty source
        element.removeAttr('href');
        element.css('cursor', 'default');

        return undefined;
    }

    function createDownloadButton() {
        var button = $(
            '<span>' +
            '<a href="#" target="_blank" class="download"></a> ' +
            '<small class="description"></small> ' +
            '<small class="form"><a href="#" target="_blank"></a></small>' +
            '</span>');

        button.find('a.download')
            .text(chrome.i18n.getMessage('downloadButtonText'))
            .css({
                margin: '0 0 0 5px',
                padding: '2px 5px'
            })
            .on('mouseover', setDownloadLink);

        button.find('small.description')
            .text('<- ' + chrome.i18n.getMessage('downloadDescription'));

        button.find('small.form a')
            .prop('href', INQUIRY_FORM)
            .text(chrome.i18n.getMessage('inquiryFormLinkText'));

        $('#mkplayer-sectsel').append(button);
    };

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
                nosub.contentScripts.mukiopress.getVideoDownloadUrl(params['type'], params['vid'], updateVideoUrl);
                break;

            case 'sina':
                sina.getVideoDownloadUrls(params['vid'], (urls) => {
                    console.log(urls);
                });

                break;

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

    parseVideoScript();
    createDownloadButton();
}
