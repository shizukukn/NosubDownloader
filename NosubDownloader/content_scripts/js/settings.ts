
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