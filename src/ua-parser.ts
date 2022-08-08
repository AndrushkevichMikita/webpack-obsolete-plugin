/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import Browser from "./browser";

const browserMap = [
  /**
   * IE for desktop.
   */
  {
    name: "ie",
    includes: [/Trident\/[.\w]+.+?rv:((\d+)[.\w]*)/i, /MSIE ((\d+\.\d+)[.\w]*)/i],
    excludes: [/Mobile/i],
  },
  /**
   * Edge for desktop.
   */
  {
    name: "edge",
    includes: [/Edge\/((\d+)[.\w]*)/i],
    excludes: [/Mobile/i],
  },
  /**
   * Chrome for desktop.
   */
  {
    name: "chrome",
    includes: [/Chrome\/((\d+)[.\w]*)/i],
    excludes: [/Mobile/i],
  },
  /**
   * Safari for desktop.
   */
  {
    name: "safari",
    includes: [/Version\/((\d+\.\d+)[.\w]*).+Safari/i],
    excludes: [/Mobile/i],
  },
  /**
   * Firefox for desktop.
   */
  {
    name: "firefox",
    includes: [/Firefox\/((\d+\.\d+)[.\w]*)/i],
    excludes: [/Mobile/i],
  },
  /**
   * Opera for desktop.
   */
  {
    name: "opera",
    includes: [/OPR\/((\d+)[.\w]*)/i, /Presto\/[.\w]+.+Version\/((\d+\.\d)[.\w]*)/i, /Opera\/((\d+\.\d)[.\w]*)/i],
    excludes: [/Mobile|Mobi|Tablet/i],
  },
  /**
   * Android webview.
   */
  {
    name: "android",
    includes: [/wv.+?Chrome\/((\d+)[.\w]*)/i],
  },
  /**
   * iOS.
   */
  {
    name: "ios_saf",
    includes: [/(iPad|iPhone).+OS ((\d+_\d+)\w*)/i],
  },
  /**
   * Chrome for mobile.
   */
  {
    name: "and_chr",
    includes: [/Chrome\/((\d+)[.\w]*).+Mobile/i],
    excludes: [/wv/i],
  },
];

export default class UAParser {
  /**
   * Convert userAgent to a group of matched `Browser` instances.
   */
  parse(userAgent: string): Array<Browser> {
    const browsers: Array<Browser> = [];
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

          if (f?.length) browsers.push(new Browser(br.name, f[1].replace(/_/g, "."), f[2].replace(/_/g, ".")));
          break;
        }
      }
    }
    return browsers;
  }
}
