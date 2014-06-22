// Path: content_scripts/js/download.js
// Author: KONO Shizuku

!function () {
  var videos = [];
  
  window.addVideoDownloader = function (w, h, flashvars, ptitle, descripption, player) {
    //console.log(flashvars);
    
    var params = parseParams(flashvars);
    //console.log(params['file']);
    
    if (params['file']) {
      videos.push({ url: params['file'] });
    }
    
    else {
      videos.push({ });
    }
  };
  
  window.renderVideoDownloader = function () { };
  
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
    var selected = $('#mkplayer-sectsel select').val();
    
    if (videos[selected] && videos[selected]['url']) {
      element.attr('href', videos[selected]['url']);
    }
  };
  
  var createDownloadButton = function() {
    var button = $('<span><a href="#" target="_blank">Download</a> <small>右クリックでリンク先を保存</small></span>');
    
    button.find('a').css({
      margin: '0 0 0 5px',
      padding: '2px 5px',
      cursor: 'pointer'
    });
    
    button.on('mousedown', setDownloadLink);
    button.on('contextmenu', setDownloadLink);
    $('#mkplayer-sectsel').append(button);
  };
  
  parseVideoScript();
  createDownloadButton();
}();