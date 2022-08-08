/**
 Return `CompareResult.GT` if greater than, return `CompareResult.EQ`
 if equal to, return `CompareResult.LT` if less than.
 */
export const enum CompareResult {
  GT = 1,
  EQ = 0,
  LT = -1,
}
/**
 * Compare two semantic versions.
 */
export function compareVersion(version: string, comparedVersion: string) {
  const rVersion = /\d+/g;
  const rComparedVersion = /\d+/g;

  // Validate if a string is semantic version.
  [version, comparedVersion].forEach((v) => {
    if (!/^(\d+)(\.\d+)*$/.test(v)) {
      throw new Error(`Parameter \`version\` \`${v}\` isn't a semantic version.`);
    }
  });

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const matches = rVersion.exec(version);
    const comparedMatches = rComparedVersion.exec(comparedVersion);

    if (matches && !comparedMatches) {
      return Number(matches[0]) === 0 ? CompareResult.EQ : CompareResult.GT;
    }
    if (!matches && comparedMatches) {
      return Number(comparedMatches[0]) === 0 ? CompareResult.EQ : CompareResult.LT;
    }
    if (matches && comparedMatches) {
      if (Number(matches[0]) > Number(comparedMatches[0])) {
        return CompareResult.GT;
      }
      if (Number(matches[0]) < Number(comparedMatches[0])) {
        return CompareResult.LT;
      }
    }
    if (!matches && !comparedMatches) {
      return CompareResult.EQ;
    }
  }
}
