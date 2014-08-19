// Path: content_scripts/js/mukiopress.js
// Author: KONO Shizuku

!function(_global, undefined){
  'use strict';
  var MUKIOPRESS_URL = 'https://www.nosub.tv/wp-content/plugins/mukiopress/lianyue/?/';
  
  var getRequestUrl = function (type, vid) {
    return MUKIOPRESS_URL + type + '/' + vid;
  };
  
  var getVideoDownloadUrl = function (type, vid, cb){
    var url = getRequestUrl(type, vid);
    
    $.get(url, function (data) {
      cb(data);
    });
  };
  
  _global.Mukiopress = {
    "getVideoDownloadUrl": getVideoDownloadUrl
  };
}(this);