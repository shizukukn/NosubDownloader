// Path: content_scripts/js/download.js
// Author: KONO Shizuku

!function (_global, undefined) {
  'use strict';
  var FC2_MAGICK = '_gGddgPfeaf_gzyr';
  
  var videos = [];
  
  _global.addVideoDownloader = function (w, h, flashvars, ptitle, descripption, player) {
    //console.log(flashvars);
    
    var params = parseParams(flashvars);
    //console.log(params['file']);
    var index  = videos.length;
    videos.push({ });
    
    switch (params['type']){
    case 'video':
      videos[index] = { url: params['file'] };
      break;
    
    case 'fc2':
      getFc2VideoDownloadUrl(params['vid'], function (url) {
        videos[index] = { url: url };
      });
      break;
    
    case 'empty':
      break;
    
    default:
      console.error('Unknown video type `' + params['type'] + '`');
    }
  };
  
  _global.renderVideoDownloader = function () { };
  
  var parseParams = function (str) {
    var params = { };
    
    var pairs = str.split('&');
    
    _.each(pairs, function (pair) {
      var index = pair.indexOf('=');
      
      if (index > -1) {
        var key = pair.slice(0, index);
        var value = pair.slice(index + 1);
        
        if (key && value) {
          params[key] = value;
        }
      }
    });
    
    return params;
  };
  
  var getFc2VideoDownloadUrl = function (vid, cb) {
    var getInfoUrl = 'http://video.fc2.com/ginfo.php?mimi=' +
      CybozuLabs.MD5.calc(vid + FC2_MAGICK) +
      '&v=' + vid + '&upid=' + vid + '&otag=1';
    //console.log(getInfoUrl);
    
    $.get(getInfoUrl, function (data) {
      //console.log(data);
      var params = parseParams(data);
      var videoUrl = params['filepath'] + '?mid=' + params['mid'];
      //console.log(videoUrl);
      
      if (videoUrl) {
        cb(videoUrl);
      }
    });
  };
  
  var parseVideoScript = function () {
    var pageScript = $('#mkplayer-content + script');
    //console.log(script[0]);
    //console.log(script.text());
    
    var scriptText = pageScript.text();
    scriptText = scriptText.replace(/addVideo\(/g, 'addVideoDownloader(');
    scriptText = scriptText.replace(/renderVideo\(/g, 'renderVideoDownloader(');
    
    var newScript = $('<script />');
    newScript.text(scriptText);
    //console.log(newScript);
    
    $('body').append(newScript);
  };
  
  var setDownloadLink = function (e) {
    var element = $(e.target);
    var select  = $('#mkplayer-sectsel select');
    var selectedIndex = 0; // Default source
    
    if (select.length > 0) {
      selectedIndex = select.val();
    }
    
    //console.log(videos);
    if (videos[selectedIndex]){
      var video = videos[selectedIndex];
      
      if (video['url']) {
        element.attr('href', video['url']);
        element.css('cursor', 'pointer');
        return;
      }
    }
    
    // empty source
    element.removeAttr('href');
    element.css('cursor', 'default');
  };
  
  var createDownloadButton = function () {
    var button = $('<span><a href="#" target="_blank"></a> <small></small></span>');
    
    button.find('a')
      .text(chrome.i18n.getMessage('downloadButtonText'))
      .css({
        margin: '0 0 0 5px',
        padding: '2px 5px'
      })
      .on('mouseover', setDownloadLink);
    
    button.find('small')
      .text(chrome.i18n.getMessage('downloadDescription'));
    
    $('#mkplayer-sectsel').append(button);
  };
  
  parseVideoScript();
  createDownloadButton();
}(this);