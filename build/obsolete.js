'use strict';
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
Object.defineProperty(exports, '__esModule', { value: true });
var Compare;
(function (Compare) {
  Compare[(Compare['GT'] = 1)] = 'GT';
  Compare[(Compare['EQ'] = 0)] = 'EQ';
  Compare[(Compare['LT'] = -1)] = 'LT';
})(Compare || (Compare = {}));
var browserMap = [
  {
    name: 'ie',
    includes: [
      /Trident\/[.\w]+.+?rv:((\d+)[.\w]*)/i,
      /MSIE ((\d+\.\d+)[.\w]*)/i
    ],
    excludes: [/Mobile/i]
  },
  {
    name: 'edge',
    includes: [/Edge\/((\d+)[.\w]*)/i],
    excludes: [/Mobile/i]
  },
  {
    name: 'chrome',
    includes: [/Chrome\/((\d+)[.\w]*)/i],
    excludes: [/Mobile/i]
  },
  {
    name: 'safari',
    includes: [/Version\/((\d+\.\d+)[.\w]*).+Safari/i],
    excludes: [/Mobile/i]
  },
  {
    name: 'firefox',
    includes: [/Firefox\/((\d+\.\d+)[.\w]*)/i],
    excludes: [/Mobile/i]
  },
  {
    name: 'opera',
    includes: [
      /OPR\/((\d+)[.\w]*)/i,
      /Presto\/[.\w]+.+Version\/((\d+\.\d)[.\w]*)/i,
      /Opera\/((\d+\.\d)[.\w]*)/i
    ],
    excludes: [/Mobile|Mobi|Tablet/i]
  },
  {
    name: 'android',
    includes: [/wv.+?Chrome\/((\d+)[.\w]*)/i]
  },
  {
    name: 'ios_saf',
    includes: [/(iPad|iPhone).+OS ((\d+_\d+)\w*)/i]
  },
  {
    name: 'and_chr',
    includes: [/Chrome\/((\d+)[.\w]*).+Mobile/i],
    excludes: [/wv/i]
  }
];
var Obsolete = (function () {
  function Obsolete(options) {
    this.options = __assign(__assign({}, Obsolete.defaultOptions), options);
  }
  Obsolete.prototype.compareVersion = function (version, comparedVersion) {
    var rVersion = /\d+/g;
    var rComparedVersion = /\d+/g;
    var rValidator = /^(\d+)(\.\d+)*$/;
    [version, comparedVersion].forEach(function (v) {
      if (!rValidator.test(version)) {
        throw new Error(
          'Parameter `version` `'.concat(version, "` isn't a semantic version.")
        );
      }
    });
    while (true) {
      var matches = rVersion.exec(version);
      var comparedMatches = rComparedVersion.exec(comparedVersion);
      if (matches && !comparedMatches) {
        return Number(matches[0]) === 0 ? Compare.EQ : Compare.GT;
      }
      if (!matches && comparedMatches) {
        return Number(comparedMatches[0]) === 0 ? Compare.EQ : Compare.LT;
      }
      if (matches && comparedMatches) {
        if (Number(matches[0]) > Number(comparedMatches[0])) {
          return Compare.GT;
        }
        if (Number(matches[0]) < Number(comparedMatches[0])) {
          return Compare.LT;
        }
      }
      if (!matches && !comparedMatches) {
        return Compare.EQ;
      }
    }
  };
  Obsolete.prototype.detect = function (userAgent, targetBrowsers) {
    var _this = this;
    var currentBrowsers = [];
    browserMap.forEach(function (item) {
      var matches;
      if (
        item.excludes &&
        item.excludes.some(function (rBrowser) {
          return rBrowser.exec(userAgent);
        })
      ) {
        return;
      }
      for (var i in item.includes) {
        matches = item.includes[i].exec(userAgent);
        if (matches) {
          currentBrowsers.push({
            name: item.name,
            version: matches[1].replace(/_/g, '.'),
            primaryVersion: matches[2].replace(/_/g, '.')
          });
          break;
        }
      }
    });
    if (!currentBrowsers.length) {
      return false;
    }
    var rBrowser = /(\w+) (([\d.]+)(?:-[\d.]+)?)/;
    var rawTargetBrowsers = targetBrowsers.map(function (b) {
      var matches = rBrowser.exec(
        {
          'op_mini all': 'op_mini 0',
          'safari TP': 'safari 99'
        }[b] || b
      );
      return {
        name: matches[1],
        version: matches[2],
        primaryVersion: matches[3]
      };
    }, this);
    var lowestVersionMap = {};
    rawTargetBrowsers.forEach(function (browser) {
      if (!lowestVersionMap[browser.name]) {
        lowestVersionMap[browser.name] = browser;
        return;
      }
      if (
        _this.compareVersion(
          browser.primaryVersion,
          lowestVersionMap[browser.name].primaryVersion
        ) === Compare.LT
      ) {
        lowestVersionMap[browser.name] = browser;
      }
    });
    var normalizedTargetBrowsersOfTheSameName = Object.values(
      lowestVersionMap
    ).filter(function (targetBrowser) {
      return currentBrowsers
        .map(function (currentBrowser) {
          return currentBrowser.name;
        })
        .includes(targetBrowser.name);
    });
    if (!normalizedTargetBrowsersOfTheSameName.length) {
      return true;
    }
    return normalizedTargetBrowsersOfTheSameName.some(function (targetBrowser) {
      return currentBrowsers.some(function (currentBrowser) {
        return (
          currentBrowser.name === targetBrowser.name &&
          _this.compareVersion(
            currentBrowser.primaryVersion,
            targetBrowser.primaryVersion
          ) !== Compare.LT
        );
      });
    });
  };
  Obsolete.prototype.test = function (browsers) {
    if (!browsers.length) {
      throw new Error('Parameter `browsers` is empty.');
    }
    var passed = this.detect(navigator.userAgent, browsers);
    if (!passed) {
      var container_1 = document.createElement('div');
      container_1.onclick = function click() {
        container_1.remove();
      };
      container_1.style.color = '#fff';
      container_1.style.background = 'red';
      container_1.style.position = 'fixed';
      container_1.style.width = '100vw';
      container_1.style.padding = '4px';
      if (this.options.template) container_1.innerHTML = this.options.template;
      else
        container_1.textContent =
          'Your browser is not supported, supported browsers here';
      document.body.appendChild(container_1);
      return false;
    }
    return true;
  };
  Obsolete.defaultOptions = {
    template: '<div>Your browser is not supported.</div>'
  };
  return Obsolete;
})();
exports.default = Obsolete;
