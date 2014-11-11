declare module nosub {
    interface Message {
        type: string;
    }

    interface SettingMessage extends Message {
        name: string;
        value?: string;
    }

    /**
     * Cookie を書き込むメッセージ
     */
    interface SetCookieMessage extends Message {
        /**
         * Cookie を書き込む URL
         */
        url: string;

        /**
         * Cookie の内容
         * 項目や各種設定の Cookie 文字列で、複数の内容を同時に指定可能
         * 例: 'name=value; path=/; secure=true'
         */
        cookies: string;
    }
    
    /**
     * 動画ページを開いた際の通知メッセージ
     */
    interface OpenedVideoPageMessage extends Message {
    }

    /**
     * 動画ページを開いた際の通知メッセージ
    */
    interface ClosedVideoPageMessage extends Message {
    }

    /**
     * 動画リンクが動画ページに追加された際のメッセージ
     */
    interface AddVideoUrlsMessage extends Message {
        urls: string[];
        fileName?: string;
    }

    /**
     * Cookie 書き込み後のコールバック関数
     */
    interface SetCookieMessageCallback {
        (message: SetCookieMessage): void;
    }
}