// Path: content_scripts/js/settings.js
// License: GPLv3<http://www.gnu.org/licenses/>
// Author: shizuku613<https://github.com/shizuku613>
// Copyright (C) Shizuku Kono 2014

/// <reference path="../../../typings/chrome/chrome.d.ts" />
/// <reference path="../../global.d.ts" />

module nosub.contentScripts.settings {
    function getSettingValue(name: string, cb: (value: string) => void): void {
        var message: SettingMessage = {
            type: 'setting',
            name: name
        };

        chrome.runtime.sendMessage(message, (res: SettingMessage) => {
            cb(res.value);
        });
    }

    /**
     * 真理値の設定値を取得する
     * 
     * @param name         設定の名前
     * @param defaultValue 設定の初期値 (設定値が存在しない場合の値)
     * @param cb           コールバック関数
     */
    export function getSettingBooleanValue(name: string, defaultValue: boolean, cb: (value: boolean) => void): void {
        getSettingValue(name, value => {
            cb(!!JSON.parse(value || (defaultValue ? '1' : '0')));
        });
    }
}