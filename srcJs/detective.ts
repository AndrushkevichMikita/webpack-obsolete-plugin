import UAParser from './ua-parser';
import Browser from './browser';
import { compareVersion } from './lib/comparator';
import {
  values,
} from './lib/mini-built-ins';

class Detective {
  /**
   * Detect if the userAgent satisfies requirement of target browsers.
   *
   * @param {string} userAgent
   * @param {string[]} targetBrowsers
   * @param {boolean} promptOnNonTargetBrowser
   * @param {boolean} promptOnUnknownBrowser
   * @returns {boolean}
   */
  detect(
    userAgent:string,
    targetBrowsers: Array<string>,
    promptOnNonTargetBrowser:boolean,
    promptOnUnknownBrowser:boolean
  ) {
    const currentBrowsers = new UAParser().parse(userAgent);

    if (!currentBrowsers.length) {
      return !promptOnUnknownBrowser;
    }

    const normalizedTargetBrowsers = this.normalizeTargetBrowsers(
      targetBrowsers
    );

    const normalizedTargetBrowsersOfTheSameName =    
      normalizedTargetBrowsers.filter(targetBrowser => currentBrowsers.map(currentBrowser => currentBrowser.name).includes(targetBrowser.name) )
     

    // const normalizedTargetBrowsersOfTheSameName =    filter(
    //   normalizedTargetBrowsers,
    //   targetBrowser =>
    //     includes(
    //       map(currentBrowsers, currentBrowser => currentBrowser.name, this),
    //       targetBrowser.name
    //     ), this
    // );

    if (!normalizedTargetBrowsersOfTheSameName.length) {
      return !promptOnNonTargetBrowser;
    }

    return normalizedTargetBrowsersOfTheSameName.some(targetBrowser=> currentBrowsers.some(currentBrowser=>  currentBrowser.name === targetBrowser.name &&
      compareVersion(
        currentBrowser.primaryVersion,
        targetBrowser.primaryVersion
      ) !== compareVersion.LT) )

    // return some(normalizedTargetBrowsersOfTheSameName, targetBrowser =>
    //   some(
    //     currentBrowsers,
    //     currentBrowser =>
    //       currentBrowser.name === targetBrowser.name &&
    //       compareVersion(
    //         currentBrowser.primaryVersion,
    //         targetBrowser.primaryVersion
    //       ) !== compareVersion.LT, this
    //   ), this
    // );
  }
  /**
   * Normalize target browsers to a group of `Browser` instances.
   *
   * @param {string[]} targetBrowsers
   * @returns {Browser[]}
   */
  normalizeTargetBrowsers(targetBrowsers :Array<string>) {
    const rBrowser = /(\w+) (([\d.]+)(?:-[\d.]+)?)/;
    const rawTargetBrowsers : Array<Browser> = targetBrowsers.map( b => {
      const matches = rBrowser.exec(this.mapAlias(b as string));

      return new Browser(matches![1], matches![2], matches![3]);
    },this);

    return this.getLowestVersionBrowsers(rawTargetBrowsers);
  }
  /**
   * Normalize target browsers to a group of `Browser` instances.
   *
   * @param {string} targetBrowser
   * @returns {string}
   */
  mapAlias(targetBrowser:string) {
    return (
      {
        'op_mini all': 'op_mini 0',
        'safari TP': 'safari 99',
      }[targetBrowser] || targetBrowser
    );
  }
  /**
   * Get the lowest versrin browsers from the list.
   *
   * @param {Browser[]} browsers
   * @returns {Browser[]}
   */
  getLowestVersionBrowsers(browsers:Array<Browser>) :Array<Browser>{
    const lowestVersionMap :{[key: string]: Browser} = {};

    browsers.forEach(browser=> {
      if (!lowestVersionMap[browser.name]) {
        lowestVersionMap[browser.name] = browser;
        return;
      }
      if (
        compareVersion(
          browser.primaryVersion,
          lowestVersionMap[browser.name].primaryVersion
        ) === compareVersion.LT
      ) {
        lowestVersionMap[browser.name] = browser;
      }
    })

    return values(lowestVersionMap);
  }
}

export default Detective;
