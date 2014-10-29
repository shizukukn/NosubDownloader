declare module nosub {
    interface Message {
        type: string;
    }

    interface SettingMessage extends Message {
        name: string;
        value?: string;
    }

    interface CookieMessage extends Message {
        url: string;
        cookies: string;
    }
}