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

    export function getSettingBooleanValue(name: string, defaultValue: boolean, cb: (value: boolean) => void): void {
        getSettingValue(name, value => {
            cb(!!JSON.parse(value || (defaultValue ? '1' : '0')));
        });
    }
}