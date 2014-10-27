// Path: options_page/js/options_page.ts
// License: GPLv3<http://www.gnu.org/licenses/>
// Author: shizuku613<https://github.com/shizuku613>
// Copyright (C) Shizuku Kono 2014

/// <reference path="../../../typings/chrome/chrome.d.ts" />
/// <reference path="../../../typings/underscore/underscore.d.ts" />
/// <reference path="../../../typings/knockout/knockout.d.ts" />
/// <reference path="../../../typings/knockout.es5/knockout.es5.d.ts" />
/// <reference path="../../typings/knockout-secure-binding.d.ts" />

module nosub.optionsPages {
    'use strict';

    function trace(obj: any): void {
        if (typeof DEBUG !== 'undefined') {
            console.log(obj);
        }
    }

    class OptionsViewModel {
        private static AUTO_BUG_REPORT_KEY = 'autoBugReport';

        public titleText: string;
        public saveButtonText: string;
        public cancelButtonText: string;
        public autoBugReportDescription: string;
        public enableText: string;

        public autoBugReport: boolean;

        constructor() {
            ko.track(this);

            this.loadMessage();
            this.load();
        }

        public saveAndClose(): void {
            trace('::saveAndClose');
            this.save();
            this.close();
        }

        public cancelAndClose(): void {
            trace('::cancelAndClose');
            this.close();
        }

        private load(): void {
            trace('::load');
            this.autoBugReport = !!JSON.parse(localStorage.getItem(OptionsViewModel.AUTO_BUG_REPORT_KEY) || 'true');
        }

        private loadMessage(): void {
            trace('::loadMessage');
            this.titleText = chrome.i18n.getMessage('settingsTitle');
            this.saveButtonText = chrome.i18n.getMessage('saveButtonText');
            this.cancelButtonText = chrome.i18n.getMessage('cancelButtonText');
            this.autoBugReportDescription = chrome.i18n.getMessage('autoBugReportDescription');
            this.enableText = chrome.i18n.getMessage('enableText');

            document.title = this.titleText;
        }

        private save(): void {
            trace('::save');
            localStorage.setItem(OptionsViewModel.AUTO_BUG_REPORT_KEY, JSON.stringify(this.autoBugReport));
        }

        private close(): void {
            trace('::close');
            window.close();
        }
    }

    ko.bindingProvider.instance = new ko.secureBindingsProvider();
    ko.applyBindings(new OptionsViewModel());
}