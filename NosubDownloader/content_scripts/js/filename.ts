module nosub.background {
    'use strict';
    var undefined = void 0;

    /**
     * ページが表示されたことをバックグラウンドページへ通知する
     */
    function sendOpenedVideoPageMessage(): void {
        var message: OpenedVideoPageMessage = {
            type: OPENED_VIDEO_PAGE_MESSAGE_TYPE
        };

        chrome.runtime.sendMessage(message);
    }
    /**
     * ページが非表示にされたことをバックグラウンドページへ通知する
    */
    function sendClosedVideoPageMessage(): void {
        var message: ClosedVideoPageMessage = {
            type: CLOSED_VIDEO_PAGE_MESSAGE_TYPE
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
            return undefined;
        });
    }

    startScript();
    addEvents();
}