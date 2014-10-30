Nosub ダウンローダー
==================
[![Build Status](https://travis-ci.org/shizuku613/NosubDownloader.svg?branch=master)](https://travis-ci.org/shizuku613/NosubDownloader)

[English](README.md) | [日本語](README.ja.md)<br />
Nosub に動画ダウンロードボタンを追加する Google Chrome 拡張機能です。

## 開発環境
* Node.js & NPM
* Visual Studio 2013
* [TypeScript](http://www.typescriptlang.org)
* [LESS](http://lesscss.org)
* [Grunt](http://gruntjs.com)
* [Bower](http://bower.io)
* [tsd](http://definitelytyped.org/tsd/)
* [Travis CI](https://travis-ci.org)

## 依存ライブラリ
* [Zepto.js](http://zeptojs.com)
* [Underscore.js](http://underscorejs.org)
* [md5.js](http://labs.cybozu.co.jp/blog/mitsunari/2007/07/md5js_1.html)
* [PgwModal](http://pgwjs.com/pgwmodal/)
* [Bootstrap](http://getbootstrap.com)
* [Knockout](http://knockoutjs.com)

## ビルド方法
このプロジェクトのビルドには Node.js および NPM が必要です。

### ビルド関係ツールのインストール
```
npm install bower -g
npm install grunt-cli -g
npm install tsd -g
```

### 依存ライブラリのインストール
```
npm install
bower install
tsd reinstall
```

### コンパイル
```
grunt build
```

### テスト (未実装)
```
grunt test
```

## ブランチ
* [master](https://github.com/shizuku613/NosubDownloader/tree/master)<br />
メインブランチ
* [master_js](https://github.com/shizuku613/NosubDownloader/tree/master_js)<br />
JavaScript で書かれた旧バージョン (v1.3.1.2 以前) のブランチ。既に TypeScript に書きなおされています。

## ライセンス
* GLPv3 License (v1.4.5.0 以降)
* MIT License (v1.4.5.0 以前)
* Copyright (c) 2014 籠 しずく 