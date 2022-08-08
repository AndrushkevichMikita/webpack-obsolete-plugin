/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { CompareResult, compareVersion } from "./comparator";

interface Browser {
  name: string;
  version: string;
  primaryVersion: string;
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

export default class Detective {
  /** Convert userAgent to a group of matched `Browser` instances */
  parse(userAgent: string): Array<Browser> {
    const browsers: Array<Browser> = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const br of browserMap) {
      let matches;
      if (br.excludes && br.excludes.some((x) => x.exec(userAgent))) {
        return [];
      }

      if (br.includes) {
        matches = br.includes.map((x) => x.exec(userAgent));
        if (matches.every((x) => x != null)) {
          console.warn("includes", matches);
          const f = matches[0];

          if (f?.length)
            browsers.push({ name: br.name, version: f[1].replace(/_/g, "."), primaryVersion: f[2].replace(/_/g, ".") });
          break;
        }
      }
    }
    return browsers;
  }

  /** Detect if the userAgent satisfies requirement of target browsers */
  detect(userAgent: string, targetBrowsers: Array<string>): boolean {
    const currentBrowsers = this.parse(userAgent);

    if (!currentBrowsers.length) return false;

    // Normalize target browsers to a group of `Browser` instances.
    const rBrowser = /(\w+) (([\d.]+)(?:-[\d.]+)?)/;
    const rawTargetBrowsers = targetBrowsers.map((browser) => {
      // Normalize target browsers to a group of `Browser` instances.
      const matches = rBrowser.exec(
        {
          "op_mini all": "op_mini 0",
          "safari TP": "safari 99",
        }[browser] || browser
      );

      // todo is null possible ?
      return { name: matches![1], version: matches![2], primaryVersion: matches![3] };
    });

    const lowestVersionMap: Array<{ key: string; value: Browser }> = [];

    rawTargetBrowsers.forEach((browser) => {
      const exist = lowestVersionMap.find((x) => x.key === browser.name);
      if (!exist) {
        lowestVersionMap.push({ key: browser.name, value: browser });
        return;
      }

      if (compareVersion(browser.primaryVersion, exist.value.primaryVersion) === CompareResult.LT) {
        Object.assign(exist.value, browser);
      }
    });

    const browsersNames = currentBrowsers.map((c) => c.name);
    const normalizedTargetBrowsersOfTheSameName = lowestVersionMap.filter((targetBrowser) =>
      browsersNames.includes(targetBrowser.value.name)
    );

    if (!normalizedTargetBrowsersOfTheSameName.length) {
      return false;
    }

    return normalizedTargetBrowsersOfTheSameName.some((t) =>
      currentBrowsers.some(
        (c) => c.name === t.value.name && compareVersion(c.primaryVersion, t.value.primaryVersion) !== CompareResult.EQ
      )
    );
  }
}
