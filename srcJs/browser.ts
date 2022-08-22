export default class Browser {
  primaryVersion: string;

  version: string;

  name: string;

  /**
   * @param {string} name
   * @param {string} version
   * @param {string} primaryVersion
   */
  constructor(name: string, version: string, primaryVersion: string) {
    this.name = name;
    this.version = version;
    this.primaryVersion = primaryVersion;
  }
}
