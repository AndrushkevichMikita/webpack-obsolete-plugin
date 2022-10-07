# webpack-obsolete-plugin

## Introduction

These plugin generates a browser-side standalone script that detects browser compatibility based on [Browserslist](https://github.com/browserslist/browserslist) and prompts website users to upgrade it.

[![npm version](https://img.shields.io/npm/v/webpack-obsolete-plugin.svg?style=flat-square)](https://www.npmjs.com/package/webpack-obsolete-plugin)
[![install size](https://packagephobia.now.sh/badge?p=webpack-obsolete-plugin)](https://packagephobia.now.sh/result?p=webpack-obsolete-plugin)
[![npm downloads](https://img.shields.io/npm/dm/webpack-obsolete-plugin.svg?style=flat-square)](http://npm-stat.com/charts.html?package=webpack-obsolete-plugin)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Motivation

In modern front-end development, we use toolchain to convert next JavaScript version into a backwards compatible version of JavaScript that works in older browser environment. For next syntax features, such as [Object Rest/Spread Properties](https://tc39.github.io/proposal-object-rest-spread/), [Exponentiation Operator](http://rwaldron.github.io/exponentiation-operator/), we can transform all of them through [AST](https://astexplorer.net/) parser. For next built-in features, such as [Promise](https://tc39.github.io/ecma262/#sec-promise-objects), [WeakMap](https://tc39.github.io/ecma262/#sec-weakmap-objects), [String.prototype.padstart](https://tc39.github.io/ecma262/#sec-string.prototype.padstart), we can provide pollyfills that mimic native functionality. However, for some browser only features, such as [Service Worker](https://w3c.github.io/ServiceWorker/), [WebAssembly](https://webassembly.github.io/spec/js-api/), [CSS Grid Layout](https://drafts.csswg.org/css-grid/), no polyfills support these or partially support. In the worst case, our users who use old browsers open a website but catch a sight of blank page. It may be a bad network condition, may be syntax parsing error, may be built-in losing. But they must not realize that the browser they using does not meet the requirements of our website target. Therefore, we need a mechanism to notify that they should upgrade their browser before accessing content. Thus, this plugin borns.

## Getting Started

### Demo

You can see demo [here](https://andrushkevichmikita.github.io/webpack-obsolete-plugin/), with edge 103 as supported browser

### Prerequisite

- Node >=8.3.0
- Webpack 5.x

### Installation

```sh
npm i -D webpack-obsolete-plugin
```

### Basic Usage

Apply the plugin in your Webpack configuration, often used together with [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin). By the way, the putting order of plugins is irrelevant.

```js
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackObsoletePlugin = require('webpack-obsolete-plugin');

module.exports = {
  // ...
  plugins: [
    // ...
    new HtmlWebpackPlugin(),
    new WebpackObsoletePlugin()
  ]
};
```

### Usage without webpack

Apply script to you'r main html file, pass to obsolete function browsers thet you support.

```js
<script src="./node_modules/webpack-obsolete-plugin/obsolete.js"></script> // or you'r own path to obsolete.js
<script>obsolete(['edge 103']);</script>
```

## Configuration

### Options

| Name | Type | Description
| ------------- |:-------------:|:-------------:|
| template      | string    | You can paste any custom html you want, it will replace default. In addition you can place `{{browsers}}` in your html, it will be replaced with browsers from your [Browserslist](https://github.com/browserslist/browserslist). Links without the "href" attribute will be fire new tab and display supported browsers from your [Browserslist](https://github.com/browserslist/browserslist).|
| isStrict      | boolean    |This option ensures that if the browser being used does not exist in [Browserslist](https://github.com/browserslist/browserslist) then alert will be shown.<br />Example: You'r [Browserslist](https://github.com/browserslist/browserslist) contains chrome 95, edge 100 as supported browsers, used browser is Edge 95 <br />If option isStrict: true => alert will be shown.<br />If option isStrict: false => As Edge browser supports Chrome features(wich ensure by userAgent), alert don't be shown|

## Browser Support

The name matches Browserslist queries.

### Desktop

IE | Edge | Chrome | Safari | Firefox | Opera | Electron
:-: | :-: | :-: | :-: | :-: | :-: | :-:
![](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/46.1.0/archive/internet-explorer_9-11/internet-explorer_9-11_64x64.png) | ![](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/46.1.0/edge/edge_64x64.png) | ![](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/46.1.0/chrome/chrome_64x64.png) | ![](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/46.1.0/safari/safari_64x64.png) | ![](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/46.1.0/firefox/firefox_64x64.png) | ![](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/46.1.0/opera/opera_64x64.png) | ![](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/46.1.0/electron/electron_64x64.png)

### Mobile

ChromeAndroid | Android<br>(5+, WebView) | iOS<br>(OS)
:-: | :-: | :-:
![](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/46.1.0/chrome/chrome_64x64.png) | ![](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/46.1.0/android-webview-beta/android-webview-beta_64x64.png) | ![](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/46.1.0/safari-ios/safari-ios_64x64.png)

## FAQ

Q: Does this plugin support Yandex, Maxthon, UC or QQ browser?

A: Yep. This plugin supports those browsers based on the mainstream browser kernel, such as Chromium based browser, Mozilla based browser. In other words, `Chrome >= 30` will be also applied to Yandex browser, `ChromeAndroid >= 30` will be also applied to Android UC browser.
