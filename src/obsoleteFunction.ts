// import browserslist from "../node_modules/browserslist/index";

// interface ObsoleteOptions {
//     template?: string; // The prompt html template. It accepts any document fragment.
// }

// interface Browser {
//     name: string;
//     version: string;
//     primaryVersion: string;
//   }
  
//   const browserMap = [
//     {
//       name: "ie",
//       includes: [/Trident\/[.\w]+.+?rv:((\d+)[.\w]*)/i, /MSIE ((\d+\.\d+)[.\w]*)/i],
//       excludes: [/Mobile/i],
//     },
//     {
//       name: "edge",
//       includes: [/Edge\/((\d+)[.\w]*)/i],
//       excludes: [/Mobile/i],
//     },
//     {
//       name: "chrome",
//       includes: [/Chrome\/((\d+)[.\w]*)/i],
//       excludes: [/Mobile/i],
//     },
//     {
//       name: "safari",
//       includes: [/Version\/((\d+\.\d+)[.\w]*).+Safari/i],
//       excludes: [/Mobile/i],
//     },
//     {
//       name: "firefox",
//       includes: [/Firefox\/((\d+\.\d+)[.\w]*)/i],
//       excludes: [/Mobile/i],
//     },
//     {
//       name: "opera",
//       includes: [/OPR\/((\d+)[.\w]*)/i, /Presto\/[.\w]+.+Version\/((\d+\.\d)[.\w]*)/i, /Opera\/((\d+\.\d)[.\w]*)/i],
//       excludes: [/Mobile|Mobi|Tablet/i],
//     },
//     {
//       name: "android",
//       includes: [/wv.+?Chrome\/((\d+)[.\w]*)/i],
//     },
//     {
//       name: "ios_saf",
//       includes: [/(iPad|iPhone).+OS ((\d+_\d+)\w*)/i],
//     },
//     {
//       name: "and_chr", // Chrome for mobile
//       includes: [/Chrome\/((\d+)[.\w]*).+Mobile/i],
//       excludes: [/wv/i],
//     },
//   ];
  
//   /**
//  Return `CompareResult.GT` if greater than, return `CompareResult.EQ`
//  if equal to, return `CompareResult.LT` if less than.
//  */
//  const enum CompareResult {
//     GT = 1,
//     EQ = 0,
//     LT = -1,
//   }
//   /**
//    * Compare two semantic versions.
//    */
//    function compareVersion(version: string, comparedVersion: string) {
//     const rVersion = /\d+/g;
//     const rComparedVersion = /\d+/g;
  
//     // Validate if a string is semantic version.
//     [version, comparedVersion].forEach((v) => {
//       if (!/^(\d+)(\.\d+)*$/.test(v)) {
//         throw new Error(`Parameter \`version\` \`${v}\` isn't a semantic version.`);
//       }
//     });
  
//     // eslint-disable-next-line no-constant-condition
//     while (true) {
//       const matches = rVersion.exec(version);
//       const comparedMatches = rComparedVersion.exec(comparedVersion);
  
//       if (matches && !comparedMatches) {
//         return Number(matches[0]) === 0 ? CompareResult.EQ : CompareResult.GT;
//       }
//       if (!matches && comparedMatches) {
//         return Number(comparedMatches[0]) === 0 ? CompareResult.EQ : CompareResult.LT;
//       }
//       if (matches && comparedMatches) {
//         if (Number(matches[0]) > Number(comparedMatches[0])) {
//           return CompareResult.GT;
//         }
//         if (Number(matches[0]) < Number(comparedMatches[0])) {
//           return CompareResult.LT;
//         }
//       }
//       if (!matches && !comparedMatches) {
//         return CompareResult.EQ;
//       }
//     }
//   }

  

// function oboleteFunc(options?: ObsoleteOptions){
    
//     const defOptions =  {
//         ...{
//             template:
//               "<button id=\"obsoleteClose\" style='border:none;cursor:pointer;border-radius:unset;width:100%;text-align:center;color:white;background-color:red'>Your browser is not supported</button>",
//            },
//         ...options,
//       }

//       let passed = false;
//       const browsersFromlist = browserslist();

//       if (!browsersFromlist.length) {
//         throw new Error("Parameter `browsers` is empty.");
//       }

//     const browsers: Array<Browser> = [];
//     // eslint-disable-next-line no-restricted-syntax
//     for (const br of browserMap) {
//       let matches;
//       if (br.excludes && br.excludes.some((x) => x.exec(navigator.userAgent))) {
//         return [];
//       }

//       if (br.includes) {
//         matches = br.includes.map((x) => x.exec(navigator.userAgent));
//         if (matches.every((x) => x != null)) {
//           const f = matches[0];

//           if (f?.length)
//             browsers.push({ name: br.name, version: f[1].replace(/_/g, "."), primaryVersion: f[2].replace(/_/g, ".") });
//           break;
//         }
//       }
//     }

//     if (!browsers.length) passed =  false;

//     // Normalize target browsers to a group of `Browser` instances.
//     const rBrowser = /(\w+) (([\d.]+)(?:-[\d.]+)?)/;
//     const rawTargetBrowsers = browsersFromlist.map((browser) => {
//       // Normalize target browsers to a group of `Browser` instances.
//       const matches = rBrowser.exec(
//         {
//           "op_mini all": "op_mini 0",
//           "safari TP": "safari 99",
//         }[browser] || browser
//       );

//       // todo is null possible ?
//       return { name: matches![1], version: matches![2], primaryVersion: matches![3] };
//     });

//     const lowestVersionMap: Array<{ key: string; value: Browser }> = [];

//     rawTargetBrowsers.forEach((browser) => {
//       const exist = lowestVersionMap.find((x) => x.key === browser.name);
//       if (!exist) {
//         lowestVersionMap.push({ key: browser.name, value: browser });
//         return;
//       }

//       if (compareVersion(browser.primaryVersion, exist.value.primaryVersion) === CompareResult.LT) {
//         Object.assign(exist.value, browser);
//       }
//     });

//     const browsersNames = browsers.map((c) => c.name);
//     const normalizedTargetBrowsersOfTheSameName = lowestVersionMap.filter((targetBrowser) =>
//       browsersNames.includes(targetBrowser.value.name)
//     );

//     if (!normalizedTargetBrowsersOfTheSameName.length) {
//       passed =  false;
//     }

//     passed =  normalizedTargetBrowsersOfTheSameName.some((t) =>
//     browsers.some(
//         (c) => c.name === t.value.name && compareVersion(c.primaryVersion, t.value.primaryVersion) !== CompareResult.EQ
//       )
//     );

//       if (!passed) {
//             const el = document.createElement("div");
//             el.onclick = function click() {
//               el.remove();
//             };
//             el.style.color = "#fff";
//             el.style.background = "red";
//             el.style.position = "fixed";
//             el.style.width = "100vw";
//             el.style.padding = "4px";
//             el.textContent = "Your browser is not supported, supported browsers here";
//             document.body.appendChild(el);
          
//         return false;
//       }
//       return true;
// }

// oboleteFunc();