// Path: background/js/settings.js
// License: GPLv3<http://www.gnu.org/licenses/>
// Author: shizuku613<https://github.com/shizuku613>
// Copyright (C) Shizuku Kono 2014

/// <reference path="../../../typings/chrome/chrome.d.ts" />
/// <reference path="../../../typings/underscore/underscore.d.ts" />
/// <reference path="../../global.d.ts" />

import _ = require('underscore');

chrome.runtime.onMessage.addListener(
    (message: nosub.Message, sender: any, sendResponse: (val: any) => void) => {
        if (message.type == 'setting') {
            var settingMessage = <nosub.SettingMessage>message;
            settingMessage.value = localStorage.getItem(settingMessage.name);
            sendResponse(settingMessage);
        }
    });
