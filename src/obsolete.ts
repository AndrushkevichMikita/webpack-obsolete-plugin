interface Options{
template?:  string,
}

interface Browser{
  primaryVersion: string,
  version: string,
  name: string,
}

enum Compare{
  GT = 1,
  EQ = 0,
  LT = -1
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

class Obsolete {
  static defaultOptions = {
    template:
      '<div>Your browser is not supported.</div>',
    position: 'afterbegin',
    promptOnNonTargetBrowser: false,
    promptOnUnknownBrowser: true,
  };

  /**
   * @param {Object} [options]
   * @param {string} [options.template] The prompt html template. It accepts any document fragment.
   */

  options: Options;
  constructor(options : Options) {
    this.options = {
      ...Obsolete.defaultOptions,
      ...options,
    };
  }

   compareVersion(version :string, comparedVersion :string) {
    const rVersion = /\d+/g;
    const rComparedVersion = /\d+/g;

    const rValidator = /^(\d+)(\.\d+)*$/;
    [version, comparedVersion].forEach(v=>{
      if (!rValidator.test(version)) {
        throw new Error(
          `Parameter \`version\` \`${version}\` isn't a semantic version.`
        );
      }
    });
  
    while (true) {
      const matches = rVersion.exec(version);
      const comparedMatches = rComparedVersion.exec(comparedVersion);
  
      if (matches && !comparedMatches) {
        return Number(matches[0]) === 0 ? Compare.EQ : Compare.GT;
      }
      if (!matches && comparedMatches) {
        return Number(comparedMatches[0]) === 0
          ? Compare.EQ
          : Compare.LT;
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
  }

  detect(
    userAgent:string,
    targetBrowsers: Array<string>,
  ) {
    const currentBrowsers : Array<Browser> = [];
   /**
   * Convert userAgent to a group of matched `Browser` instances.
   *
   * @param {string} userAgent
   * @returns {Browser[]}
   */
    browserMap.forEach(item=>{
      let matches;
      if (
        item.excludes &&
        item.excludes.some(rBrowser => rBrowser.exec(userAgent))
      ) {
        return;
      }
      for (const i in item.includes) {
        matches = item.includes[i].exec(userAgent);
        if (matches) {
          currentBrowsers.push(
             {
              name: item.name,
              version: matches[1].replace(/_/g, '.'),
              primaryVersion: matches[2].replace(/_/g, '.')
             }
          );
          break;
        }
      }
    });

    if (!currentBrowsers.length) {
      return false;
    }

    const rBrowser = /(\w+) (([\d.]+)(?:-[\d.]+)?)/;
    const rawTargetBrowsers : Array<Browser> = targetBrowsers.map( b => {
      const matches = rBrowser.exec((
        {
          'op_mini all': 'op_mini 0',
          'safari TP': 'safari 99',
        }[b] || b
      ));
      return {name:matches![1], version: matches![2], primaryVersion: matches![3]};
    },this);

    const lowestVersionMap :{[key: string]: Browser} = {};
    rawTargetBrowsers.forEach(browser=> {
      if (!lowestVersionMap[browser.name]) {
        lowestVersionMap[browser.name] = browser;
        return;
      }
      if (
        this.compareVersion(
          browser.primaryVersion,
          lowestVersionMap[browser.name].primaryVersion
        ) === Compare.LT
      ) {
        lowestVersionMap[browser.name] = browser;
      }
    })

    const normalizedTargetBrowsers = Object.values(lowestVersionMap);
    const normalizedTargetBrowsersOfTheSameName =    
      normalizedTargetBrowsers.filter(targetBrowser => currentBrowsers.map(currentBrowser => currentBrowser.name).includes(targetBrowser.name) )
     
    if (!normalizedTargetBrowsersOfTheSameName.length) {
      return true;
    }

    return normalizedTargetBrowsersOfTheSameName.some(targetBrowser=> currentBrowsers.some(currentBrowser=>  currentBrowser.name === targetBrowser.name &&
      this.compareVersion(
        currentBrowser.primaryVersion,
        targetBrowser.primaryVersion
      ) !== Compare.LT) )
  }
  /**
   * Test browser compatibility.
   *
   * @param {string[]} browsers Browser names in Can I Use.
   * @returns {boolean}
   */
  test(browsers : Array<string>) {
    if (!browsers.length) {
      throw new Error('Parameter `browsers` is empty.');
    }
    const passed = this.detect(
      navigator.userAgent,
      browsers
    );

    if (!passed) {
      const container = document.createElement("div");
      container.onclick = function click() {
        container.remove();
      };
      container.style.color = "#fff";
      container.style.background = "red";
      container.style.position = "fixed";
      container.style.width = "100vw";
      container.style.padding = "4px";
      if(this.options.template)
      container.innerHTML = this.options.template;
      else
      container.textContent = "Your browser is not supported, supported browsers here";
      
      document.body.appendChild(container);
      return false;
    }
    return true;
  }
}

export default Obsolete;
