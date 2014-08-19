// Path: background/js/referer.js
// Author: KONO Shizuku

chrome.webRequest.onBeforeSendHeaders.addListener(
  function (details) {
    return {
      requestHeaders: _.filter(details.requestHeaders, function (header) {
        if (header.name == 'Referer' && header.value.indexOf('nosub.tv') > -1) {
          return false; // remove
        }
        
        return true;
      })
    };
  },
  {
    urls: [
      'http://videotfs.tc.qq.com/*'
    ]
  },
  [
    'requestHeaders',
    'blocking'
  ]
);