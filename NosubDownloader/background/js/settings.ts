// Path: background/js/settings.js
// License: GPLv3<http://www.gnu.org/licenses/>
// Author: shizuku613<https://github.com/shizuku613>
// Copyright (C) Shizuku Kono 2014

/// <reference path="../../../typings/chrome/chrome.d.ts" />
/// <reference path="../../../typings/underscore/underscore.d.ts" />
/// <reference path="../../global.d.ts" />

module nosub.background.settings {
    'use strict';

    chrome.runtime.onMessage.addListener((message: Message, sender, sendResponse: (val: any) => void) => {
        switch (message.type) {
            case 'setting':
                var settingMessage = <SettingMessage>message;
                settingMessage.value = localStorage.getItem(settingMessage.name);
                sendResponse(settingMessage);
                break;
        }
    });
}