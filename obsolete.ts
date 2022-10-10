interface Options {
  template?: string;
  isStrict?: boolean;
}

interface Browser {
  primaryVersion: string;
  version: string;
  name: string;
}

const enum Compare {
  GT = 1,
  EQ = 0,
  LT = -1,
}

const excludes = [/Mobile/i];
const browserMap = [
  {
    name: "ie",
    includes: [/Trident\/[.\w]+.+?rv:((\d+)[.\w]*)/i, /MSIE ((\d+\.\d+)[.\w]*)/i],
    excludes,
  },
  {
    name: "edge",
    includes: [/Edg\/((\d+)[.\w]*)/i, /Edge\/((\d+)[.\w]*)/i, /EdgA\/((\d+)[.\w]*)/i],
  },
  {
    name: "chrome",
    includes: [/Chrome\/((\d+)[.\w]*)/i],
    excludes,
  },
  {
    name: "safari",
    includes: [/Version\/((\d+\.\d+)[.\w]*).+Safari/i],
    excludes,
  },
  {
    name: "firefox",
    includes: [/Firefox\/((\d+\.\d+)[.\w]*)/i],
    excludes,
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

function obsolete(browsers: Array<string>, options?: Options) {
  options = { ...options };

  function compareVersion(version: string, comparedVersion: string) {
    const rVersion = /\d+/g;
    const rComparedVersion = /\d+/g;

    const rValidator = /^(\d+)(\.\d+)*$/;
    [version, comparedVersion].forEach((v) => {
      if (!rValidator.test(v)) {
        throw new Error(`Parameter \`version\` \`${version}\` isn't a semantic version.`);
      }
    });

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const matches = rVersion.exec(version);
      const comparedMatches = rComparedVersion.exec(comparedVersion);

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
  }

  function detect(userAgent: string, expectedBrowsers: Array<string>) {
    const actualBrowsers: Array<Browser> = [];
    // Convert userAgent to a group of matched `Browser` instances
    browserMap.forEach((item) => {
      let matches;
      if (item.excludes && item.excludes.some((rBrowser) => rBrowser.exec(userAgent))) {
        return;
      }
      for (let i = 0; i < item.includes.length; i++) {
        matches = item.includes[i].exec(userAgent);
        if (matches) {
          actualBrowsers.push({
            name: item.name,
            version: matches[1].replace(/_/g, "."),
            primaryVersion: matches[2].replace(/_/g, "."),
          });
          break;
        }
      }
    });

    if (!actualBrowsers.length) {
      return false;
    }

    const rBrowser = /(\w+) (([\d.]+)(?:-[\d.]+)?)/;
    const lowestVersionMap: { [key: string]: Browser } = {};
    expectedBrowsers
      .map((b) => {
        const matches = rBrowser.exec(
          {
            "op_mini all": "op_mini 0",
            "safari TP": "safari 99",
          }[b] || b
        );
        return {
          name: matches![1],
          version: matches![2],
          primaryVersion: matches![3],
        };
      })
      .forEach((browser) => {
        if (!lowestVersionMap[browser.name]) {
          lowestVersionMap[browser.name] = browser;
          return;
        }
        if (compareVersion(browser.primaryVersion, lowestVersionMap[browser.name].primaryVersion) === Compare.LT) {
          lowestVersionMap[browser.name] = browser;
        }
      });

    const normalized = Object.keys(lowestVersionMap)
      .filter((key) => actualBrowsers.some((b) => b.name === lowestVersionMap[key].name))
      .map((key) => lowestVersionMap[key]);

    if (!normalized.length) {
      return false;
    }
    const fc = (t: Browser) =>
      actualBrowsers.some(
        (c) => c.name === t.name && compareVersion(c.primaryVersion, t.primaryVersion) !== Compare.LT
      );

    if (options?.isStrict) return normalized.every((t) => fc(t));
    return normalized.some((t) => fc(t));
  }

  /** Test browser compatibility */
  if (!browsers.length) {
    throw new Error("Parameter `browsers` is empty");
  }

  const passed = detect(navigator.userAgent, browsers);
  if (!passed) {
    const animationTimeMs = 500;
    const s = document.createElement("style");
    document.head.appendChild(s);
    const animRule = `anim-obsolete-close ${animationTimeMs}ms forwards ease-in-out`;
    const animFrame = `anim-obsolete-close {to { transform: translateY(-100%) }}`;
    s.textContent = `[data-obsolete-init] {
color: #fff;
background: red;
position: fixed;
width: 100vw;
padding: 4px;
white-space: pre;
top: 0; left: 0;
text-align: center;
}
[data-obsolete-init] a {
  text-decoration: underline;
  cursor: pointer;
}
[data-obsolete-close] {
-webkit-animation: ${animRule};
-moz-animation: ${animRule};
animation: ${animRule};
}
@-webkit-keyframes ${animFrame}
@-moz-keyframes ${animFrame}
@keyframes ${animFrame}`;
    const w = document.createElement("div");
    w.setAttribute("data-obsolete-init", "");

    let wasMouseMove = false;
    w.addEventListener("mousemove", () => (wasMouseMove = true), {
      passive: true,
    });
    w.addEventListener(
      "click",
      (e) => {
        if (wasMouseMove) {
          wasMouseMove = false;
        }
        if (e.target instanceof HTMLAnchorElement) {
          if (!e.target.hasAttribute("href")) {
            const tab = window.open()!;
            tab.document.write(browsers.join("\n"));
            tab.document.body.style.whiteSpace = "pre";
            tab.document.body.style.display = "flex";
            tab.document.body.style.justifyContent = "center";
            tab.document.close();
          }
        } else {
          w.setAttribute("data-obsolete-close", "");
          setTimeout(() => {
            w.parentElement!.removeChild(w);
            document.head.removeChild(s);
          }, animationTimeMs);
        }
      },
      { passive: true }
    );

    if (options.template) {
      w.innerHTML = options.template.replace("{{browsers}}", browsers.join("\n"));
    } else {
      const c = w.appendChild(document.createElement("div"));
      c.textContent = `Your browser is not supported`;
      const a = w.appendChild(document.createElement("a"));
      a.textContent = "Show supported browsers";
    }

    if (!document.body) {
      window.addEventListener("load", () => document.body.appendChild(w), {
        once: true,
        passive: true,
      });
    } else document.body.appendChild(w);

    console && //it's important for IE
      console.error("Not supported browser", {
        supportedBrowsers: browsers,
        userAgent: window.navigator && window.navigator.userAgent,
      });
  }
  return passed;
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.obsolete = obsolete;
