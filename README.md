Nosub Downloader
==================
[![Build Status](https://travis-ci.org/shizuku613/NosubDownloader.svg?branch=master)](https://travis-ci.org/shizuku613/NosubDownloader)

You can download nosub's videos if you install the extension to Google Chrome!

## Development environment
* TypeScript
* Node.js
* Grunt
* Bower
* Travis-CI
* Visual Studio 2013

## Used library
* [Zepto.js](http://zeptojs.com)
* [Underscore.js](http://underscorejs.org)
* [md5.js](http://labs.cybozu.co.jp/blog/mitsunari/2007/07/md5js_1.html)

## How to build

### Install build tools
```
npm install bower -g
npm install grunt-cli -g
npm install tsd -g
```

### Install usage library
```
npm install
bower install
tsd reinstall
```

### Compile
```
grunt build
```

### Test (Not implemented)
```
grunt test
```

## Branches
* [master](https://github.com/shizuku613/NosubDownloader/tree/master)<br />
Main branch
* [master_js](https://github.com/shizuku613/NosubDownloader/tree/master_js)<br />
This is the JavaScript old branch, and has being already converted to TypeScript.

## License
* MIT License
* Copyright (c) 2014 KONO Shizuku