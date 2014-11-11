/// <reference path="../../typings/http-string-parser.d.ts" />

declare class MediaType {
    constructor(s: string);
    type: string;
}

module nosub.background {
    'use strict';
    var undefined = void 0;

    function trace(...messages: any[]):void {
        if (typeof DEBUG !== 'undefined') {
            _.each(messages, x => { console.log(x) });
        }
    }

    class VideoPageTab {
        constructor(public tabId: number) { }
        fileName: string = 'video.mp4';
        videoUrls: string[] = [];
        requestIds: string[] = [];
    }

    var DEFAULT_VIDEO_EXTENSION = '.mp4';

    /**
     * 動画に対するアクセスであるかどうかを返す
     */
    function isVideoResponse(details: chrome.webRequest.OnHeadersReceivedDetails): boolean {
        var statusLine = HttpStringParser.parseStatusLine(details.statusLine);

        // 正常終了でない場合
        if (statusLine.statusCode != '200' // OK
            && statusLine.statusCode != '206' // Partial Content
            ) {
            return false;
        }

        // Location ヘッダが存在する場合
        if (_.some(details.responseHeaders, header => header.name == 'Location')) {
            return false;
        }

        return true;
    }

    /**
     * ヘッダの書き換え処理を行う
     * 書き換えが発生した場合、真を返す
     */
    function updateResponseHeaders(
        responseHeaders: chrome.webRequest.HttpHeader[],
        fileName: string): boolean {

        // Content-Type ヘッダが正常か調べる
        var contentType = _.find(responseHeaders, h => h.name == 'Content-Type');

        if (contentType) {
            var mimeType = new MediaType(contentType.value).type;
            var topLevelType = mimeType.split('/')[0];

            // 動画系の場合は書き換える必要なし
            if (topLevelType == 'video') {
                return false;
            }
        }

        var contentDisposition = 'attachment; filename="' + fileName + DEFAULT_VIDEO_EXTENSION + '"';

        // Content-Disposition ヘッダを書き換える
        for (var i = 0; i < responseHeaders.length; ++i) {
            var header = responseHeaders[i];

            if (header.name == 'Content-Disposition') {
                header.value = contentDisposition;
                return true;
            }
        }

        responseHeaders.push({
            name: 'Content-Disposition',
            value: contentDisposition
        });

        return true;
    }

    // 連続アクセスではない為、オブジェクトの数値アクセスの方が高速
    var videoPageTabs: { [key: number]: VideoPageTab } = {};

    // ヘッダの書き換え処理
    chrome.webRequest.onHeadersReceived.addListener(
        details => {
            var videoPageTabIds = _.keys(videoPageTabs);

            // 監視対象のタブで無い場合
            if (!_.contains(videoPageTabIds, details.tabId.toString())) {
                return null;
            }

            // 監視対象の URL or リクエスト ID であるか調べる
            // { [key: string]: ... } だと、Underscore.js の d.ts でエラーが出るため、キャスト
            var contains = _.some(<{ [key: string]: VideoPageTab }>videoPageTabs, tab => {
                return tab && tab.videoUrls && tab.requestIds && // 例外阻止
                    (_.contains(tab.videoUrls, details.url) || // URL
                    _.contains(tab.requestIds, details.requestId)); // リクエスト ID
            });

            // 監視対象でない場合、終了
            if (!contains) {
                return null;
            }
            
            var videoPageTab = videoPageTabs[details.tabId];

            // リクエスト ID での監視対象に追加
            if (!_.contains(videoPageTab.requestIds, details.requestId)) {
                videoPageTab.requestIds.push(details.requestId);
            }

            // レスポンスが動画で無い場合、終了
            if (!isVideoResponse(details)) {
                return null;
            }

            // ヘッダの書き換え処理を行う
            var updated = updateResponseHeaders(details.responseHeaders, videoPageTab.fileName);
            if (updated) {
                trace('Change filename', details.responseHeaders);

                return {
                    responseHeaders: details.responseHeaders
                }
            }

            return null;

        },
        {
            urls: [
                // manifest 側で絞るので、こちらではすべて受け取る
                '<all_urls>'
            ]
        },
        [
            'responseHeaders',
            'blocking'
        ]);

    // ファイル名変更関係のメッセージを受け取る
    chrome.runtime.onMessage.addListener(
        (message: Message, sender: chrome.runtime.MessageSender, sendResponse: Function) => {
            var tabId = sender.tab.id;

            switch (message.type) {
                // 動画ページが開かれた場合、そのタブを監視対象にする
                case OPENED_VIDEO_PAGE_MESSAGE_TYPE:
                    trace(message, 'tadId = ' + tabId);
                    videoPageTabs[tabId] = new VideoPageTab(tabId);

                    break;

                // タブが削除された場合、タブの情報を削除する
                // (メモリリーク阻止 & フィルタ処理高速化)
                case CLOSED_VIDEO_PAGE_MESSAGE_TYPE:
                    trace(message, 'tadId = ' + tabId);
                    videoPageTabs[tabId] = undefined; // delete
                    break;

                // 動画リンクが追加された時の処理
                case ADD_VIDEO_URLS_MESSAGE_TYPE:
                    var addVideoUrlsMessage = <AddVideoUrlsMessage>message;
                    //trace(message, 'tabId = ' + tabId + ', urls = ' + addVideoUrlsMessage.urls);

                    // 動画ページ情報が存在する場合、正常にリンク追加
                    if (videoPageTabs[tabId]) {
                        // リンクを追加
                        var temp = videoPageTabs[tabId].videoUrls;
                        temp.push.apply(temp, addVideoUrlsMessage.urls);

                        // ファイル名
                        if (addVideoUrlsMessage.fileName) {
                            videoPageTabs[tabId].fileName = addVideoUrlsMessage.fileName;
                        }
                    }

                    // 動画ページ情報が存在しない場合、タブが既に削除されているかバグ
                    else {
                        videoPageTabs[tabId] = undefined;
                        console.warn('Tab (id = ' + tabId + ') is not found');
                    }

                    break;
            } 
        });
}