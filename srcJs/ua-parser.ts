import Browser from './browser';


interface BrMap{
  [key:string]: {
    incl?:RegExp[],
    excl?:RegExp[]
  } | RegExp[];
}

const browserMap = [
  {
    name: "ie",
    includes: [/Trident\/[.\w]+.+?rv:((\d+)[.\w]*)/i, /MSIE ((\d+\.\d+)[.\w]*)/i],
    excludes: [/Mobile/i],
  },
  {
    name: "edge",
    includes: [/Edge\/((\d+)[.\w]*)/i],
    excludes: [/Mobile/i],
  },
  {
    name: "chrome",
    includes: [/Chrome\/((\d+)[.\w]*)/i],
    excludes: [/Mobile/i],
  },
  {
    name: "safari",
    includes: [/Version\/((\d+\.\d+)[.\w]*).+Safari/i],
    excludes: [/Mobile/i],
  },
  {
    name: "firefox",
    includes: [/Firefox\/((\d+\.\d+)[.\w]*)/i],
    excludes: [/Mobile/i],
  },
  {
    name: "opera",
    includes: [/OPR\/((\d+)[.\w]*)/i, /Presto\/[.\w]+.+Version\/((\d+\.\d)[.\w]*)/i, /Opera\/((\d+\.\d)[.\w]*)/i],
    excludes: [/Mobile|Mobi|Tablet/i],
  },
  {
    name: "android",
    includes: [/wv.+?Chrome\/((\d+)[.\w]*)/i],
  },
  {
    name: "ios_saf",
    includes: [/(iPad|iPhone).+OS ((\d+_\d+)\w*)/i],
  },
  {
    name: "and_chr", // Chrome for mobile
    includes: [/Chrome\/((\d+)[.\w]*).+Mobile/i],
    excludes: [/wv/i],
  },
];

class UAParser {

  rBrowserMap:BrMap;

  constructor() {
    this.rBrowserMap = {
      /**
       * IE for desktop.
       */
      ie: {
        incl: [
          /Trident\/[.\w]+.+?rv:((\d+)[.\w]*)/i,
          /MSIE ((\d+\.\d+)[.\w]*)/i,
        ],
        excl: [/Mobile/i],
      },
      /**
       * Edge for desktop.
       */
      edge: {
        incl: [/Edge\/((\d+)[.\w]*)/i],
        excl: [/Mobile/i],
      },
      /**
       * Chrome for desktop.
       */
      chrome: {
        incl: [/Chrome\/((\d+)[.\w]*)/i],
        excl: [/Mobile/i],
      },
      /**
       * Safari for desktop.
       */
      safari: {
        incl: [/Version\/((\d+\.\d+)[.\w]*).+Safari/i],
        excl: [/Mobile/i],
      },
      /**
       * Firefox for desktop.
       */
      firefox: {
        incl: [/Firefox\/((\d+\.\d+)[.\w]*)/i],
        excl: [/Mobile/i],
      },
      /**
       * Opera for desktop.
       *
       */
      opera: {
        incl: [
          /OPR\/((\d+)[.\w]*)/i,
          /Presto\/[.\w]+.+Version\/((\d+\.\d)[.\w]*)/i,
          /Opera\/((\d+\.\d)[.\w]*)/i,
        ],
        excl: [/Mobile|Mobi|Tablet/i],
      },
      /**
       * Android webview.
       */
      android: [/wv.+?Chrome\/((\d+)[.\w]*)/i],
      /**
       * iOS.
       */
      ios_saf: [/(iPad|iPhone).+OS ((\d+_\d+)\w*)/i],
      /**
       * Chrome for mobile.
       */
      and_chr: {
        incl: [/Chrome\/((\d+)[.\w]*).+Mobile/i],
        excl: [/wv/i],
      },
    };
  }
  /**
   * Convert userAgent to a group of matched `Browser` instances.
   *
   * @param {string} userAgent
   * @returns {Browser[]}
   */
  parse(userAgent: string) {
    const browsers : Array<Browser> = [];

    browserMap.forEach(item=>{
      let matches;
      if (
        item.excludes &&
        item.excludes.some(rBrowser => rBrowser.exec(userAgent))
      ) {
        return;
      }

      // item.includes.forEach(element => {
      //   matches = element.exec(userAgent);
      //   if (matches) {
      //     browsers.push(
      //       new Browser(
      //         item.name,
      //         matches[1].replace(/_/g, '.'),
      //         matches[2].replace(/_/g, '.')
      //       )
      //     );
      //     break;
      //   }
      // });
  
      for (const i in item.includes) {
        matches = item.includes[i].exec(userAgent);
        if (matches) {
          browsers.push(
            new Browser(
              item.name,
              matches[1].replace(/_/g, '.'),
              matches[2].replace(/_/g, '.')
            )
          );
          break;
        }
      }

    });

    // forEach(entries(this.rBrowserMap), ([name, rBrowsers]) => {
    //   let matches;

    //   if (
    //     rBrowsers.excludes &&
    //     some(rBrowsers.excludes, rBrowser => rBrowser.exec(userAgent), this)
    //   ) {
    //     return;
    //   }
    //   if (Object.prototype.toString.call(rBrowsers) !== '[object Array]') {
    //     rBrowsers = rBrowsers.includes;
    //   }
    //   for (const i in rBrowsers) {
    //     matches = rBrowsers[i].exec(userAgent);
    //     if (matches) {
    //       browsers.push(
    //         new Browser(
    //           name,
    //           matches[1].replace(/_/g, '.'),
    //           matches[2].replace(/_/g, '.')
    //         )
    //       );
    //       break;
    //     }
    //   }
    // }, this);
    return browsers;
  }
}

export default UAParser;
