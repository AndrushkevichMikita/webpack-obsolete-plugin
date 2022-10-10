import { getBasicBrowsers, setUserAgent } from "./browser";
import "../obsolete";

describe("method-test", () => {
  const originalUserAgent = navigator.userAgent;

  beforeEach(() => {
    document.body.innerHTML = "";
    setUserAgent(originalUserAgent);
  });
  describe("test self user agent", () => {
    it("should pass old IE", () => {
      setUserAgent("Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1");
      expect(obsolete(["ie 5.5"])).toBe(true);
      expect(obsolete(["ie 6"])).toBe(true);
      expect(obsolete(["ie 7"])).toBe(false);
      getBasicBrowsers(["ie"]).forEach((item) => {
        expect(obsolete([item])).toBe(false);
      });
    });
    it("should pass IE", () => {
      setUserAgent("Mozilla/5.0 (Windows NT 6.1; Trident/7.0; rv:10.0) like Gecko");
      expect(obsolete(["ie 9"])).toBe(true);
      expect(obsolete(["ie 10"])).toBe(true);
      expect(obsolete(["ie 11"])).toBe(false);
      getBasicBrowsers(["ie"]).forEach((item) => {
        expect(obsolete([item])).toBe(false);
      });
    });
    it("should pass Edge, old versions", () => {
      setUserAgent(
        "Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.9200"
      );
      expect(obsolete(["edge 15"])).toBe(true);
      expect(obsolete(["edge 16"])).toBe(true);
      expect(obsolete(["edge 17"])).toBe(false);
    });
    it("should pass Edge, new versions", () => {
      setUserAgent(
        "Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36 Edg/106.0.0.0"
      );
      expect(obsolete(["edge 15"])).toBe(true);
      expect(obsolete(["edge 104"])).toBe(true);
      expect(obsolete(["edge 107"])).toBe(false);
    });
    it("should pass Edge simulate mobile, new versions", () => {
      setUserAgent(
        "Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Mobile Safari/537.36 Edg/106.0.0.0"
      );
      expect(obsolete(["edge 15"])).toBe(true);
      expect(obsolete(["edge 104"])).toBe(true);
      expect(obsolete(["edge 107"])).toBe(false);
      expect(obsolete(["edge 106"])).toBe(true);
    });
    it("should pass Edge mobile, new versions", () => {
      setUserAgent(
        "Mozilla/5.0 (Linux; Android 10; Pixel 3 XL) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.5249.79 Mobile Safari/537.36 EdgA/106.0.1185.50"
      );
      expect(obsolete(["edge 15"])).toBe(true);
      expect(obsolete(["edge 104"])).toBe(true);
      expect(obsolete(["edge 107"])).toBe(false);
      expect(obsolete(["edge 106"])).toBe(true);
    });
    it("should pass Chrome", () => {
      setUserAgent(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3538.77 Safari/537.36"
      );
      expect(obsolete(["chrome 59"])).toBe(true);
      expect(obsolete(["chrome 60"])).toBe(true);
      expect(obsolete(["chrome 61"])).toBe(false);
      getBasicBrowsers(["chrome"]).forEach((item) => {
        expect(obsolete([item])).toBe(false);
      });
    });
    it("should pass Safari", () => {
      setUserAgent(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.1.0 Safari/605.1.15"
      );
      expect(obsolete(["safari 11"])).toBe(true);
      expect(obsolete(["safari 11.1"])).toBe(true);
      expect(obsolete(["safari 12"])).toBe(false);
      expect(obsolete(["safari TP"])).toBe(false);
      getBasicBrowsers(["safari"]).forEach((item) => {
        expect(obsolete([item])).toBe(false);
      });
    });
    it("should pass Firefox", () => {
      setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:63.0) Gecko/20100101 Firefox/60.0");
      expect(obsolete(["firefox 59"])).toBe(true);
      expect(obsolete(["firefox 60"])).toBe(true);
      expect(obsolete(["firefox 61"])).toBe(false);
      getBasicBrowsers(["firefox"]).forEach((item) => {
        expect(obsolete([item])).toBe(false);
      });
    });
    it("should pass old Opera", () => {
      setUserAgent("Opera/9.63 (Windows NT 6.0; U; en) Presto/2.1.1");
      expect(obsolete(["opera 9"])).toBe(true);
      expect(obsolete(["opera 9.5-9.6"])).toBe(true);
      expect(obsolete(["opera 10.0-10.1"])).toBe(false);
      // getBasicBrowsers(['epera']).forEach((item) => {
      //   expect(obsolete([item])).toBe(false);
      // });
      setUserAgent("Opera/9.80 (Macintosh; Intel Mac OS X 10.6.8; U; en) Presto/2.9.168 Version/11.52");
      expect(obsolete(["opera 11.1"])).toBe(true);
      expect(obsolete(["opera 11.5"])).toBe(true);
      expect(obsolete(["opera 11.6"])).toBe(false);
      getBasicBrowsers(["opera"]).forEach((item) => {
        expect(obsolete([item])).toBe(false);
      });
    });
    it("should pass Opera", () => {
      setUserAgent(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36 OPR/56.0.3051.52"
      );
      expect(obsolete(["opera 55"])).toBe(true);
      expect(obsolete(["opera 56"])).toBe(true);
      expect(obsolete(["opera 57"])).toBe(false);
      // getBasicBrowsers(['opera']).forEach((item) => {
      //   expect(obsolete([item])).toBe(false);
      // });
    });
    it("should pass Android", () => {
      setUserAgent(
        "Mozilla/5.0 (Linux; Android 5.1.1; Nexus 5 Build/LMY48B; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/43.0.2357.65 Mobile Safari/537.36"
      );
      expect(obsolete(["android 42"])).toBe(true);
      expect(obsolete(["android 43"])).toBe(true);
      expect(obsolete(["android 44"])).toBe(false);
      getBasicBrowsers(["android"]).forEach((item) => {
        expect(obsolete([item])).toBe(false);
      });
    });
    it("should pass iOS", () => {
      setUserAgent(
        "Mozilla/5.0 (iPad; CPU OS 11_0_3 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A432 Safari/604.1"
      );
      expect(obsolete(["ios_saf 10.3"])).toBe(true);
      expect(obsolete(["ios_saf 11.0-11.2"])).toBe(true);
      expect(obsolete(["ios_saf 11.3-11.4"])).toBe(false);
      getBasicBrowsers(["ios_saf"]).forEach((item) => {
        expect(obsolete([item])).toBe(false);
      });
      setUserAgent(
        "Mozilla/5.0 (iPhone; CPU iPhone OS 8_0 like Mac OS X) AppleWebKit/600.1.3 (KHTML, like Gecko) Version/8.0 Mobile/12A4345d Safari/600.1.4"
      );
      expect(obsolete(["ios_saf 7.0-7.1"])).toBe(true);
      expect(obsolete(["ios_saf 8"])).toBe(true);
      expect(obsolete(["ios_saf 8.1-8.4"])).toBe(false);
      getBasicBrowsers(["ios_saf"]).forEach((item) => {
        expect(obsolete([item])).toBe(false);
      });
    });
    it("should pass ChromeAndroid", () => {
      setUserAgent(
        "Mozilla/5.0 (Linux; Android 6.0.1; SM-G532G Build/MMB29T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.83 Mobile Safari/537.36"
      );
      expect(obsolete(["and_chr 62"])).toBe(true);
      expect(obsolete(["and_chr 63"])).toBe(true);
      expect(obsolete(["and_chr 64"])).toBe(false);
      getBasicBrowsers(["and_chr"]).forEach((item) => {
        expect(obsolete([item])).toBe(false);
      });
    });
  });
  describe("test engine based user agent", () => {
    it("should pass QQ", () => {
      setUserAgent(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36 QQBrowser/4.4.116.400"
      );
      expect(obsolete(["chrome 64"])).toBe(true);
      expect(obsolete(["chrome 65"])).toBe(true);
      expect(obsolete(["chrome 66"])).toBe(false);
      getBasicBrowsers(["chrome"]).forEach((item) => {
        expect(obsolete([item])).toBe(false);
      });
    });
    it("should pass 360", () => {
      setUserAgent(
        "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36"
      );
      expect(obsolete(["chrome 62"])).toBe(true);
      expect(obsolete(["chrome 63"])).toBe(true);
      expect(obsolete(["chrome 64"])).toBe(false);
      getBasicBrowsers(["chrome"]).forEach((item) => {
        expect(obsolete([item])).toBe(false);
      });
    });
    it("should pass Maxthon", () => {
      setUserAgent(
        "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Maxthon/4.4 Chrome/45.0.2454.85 Safari/537.36"
      );
      expect(obsolete(["chrome 44"])).toBe(true);
      expect(obsolete(["chrome 45"])).toBe(true);
      expect(obsolete(["chrome 46"])).toBe(false);
      getBasicBrowsers(["chrome"]).forEach((item) => {
        expect(obsolete([item])).toBe(false);
      });
    });
    it("should pass Yandex", () => {
      setUserAgent(
        "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.124 YaBrowser/15.7.2357.2877 Safari/537.36"
      );
      expect(obsolete(["chrome 42"])).toBe(true);
      expect(obsolete(["chrome 43"])).toBe(true);
      expect(obsolete(["chrome 44"])).toBe(false);
      getBasicBrowsers(["chrome"]).forEach((item) => {
        expect(obsolete([item])).toBe(false);
      });
    });
    it("should pass SeaMonkey", () => {
      setUserAgent("Mozilla/5.0 (Windows NT 6.1; WOW64; rv:38.0) Gecko/20100101 Firefox/38.0 SeaMonkey/2.35");
      expect(obsolete(["firefox 37"])).toBe(true);
      expect(obsolete(["firefox 38"])).toBe(true);
      expect(obsolete(["firefox 39"])).toBe(false);
      getBasicBrowsers(["firefox"]).forEach((item) => {
        expect(obsolete([item])).toBe(false);
      });
    });
    it("should pass Facebook", () => {
      setUserAgent(
        "Mozilla/5.0 (Linux; Android 8.1.0; OE106 Build/OPM1.171019.026; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/62.0.3202.84 Mobile Safari/537.36"
      );
      expect(obsolete(["android 61"])).toBe(true);
      expect(obsolete(["android 62"])).toBe(true);
      expect(obsolete(["android 63"])).toBe(false);
      getBasicBrowsers(["android"]).forEach((item) => {
        expect(obsolete([item])).toBe(false);
      });
    });
    it("should pass WeChat", () => {
      setUserAgent(
        "Mozilla/5.0 (Linux; Android 8.1; OE106 Build/OPM1.171019.026; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.132 MQQBrowser/6.2 TBS/044306 Mobile Safari/537.36"
      );
      expect(obsolete(["android 56"])).toBe(true);
      expect(obsolete(["android 57"])).toBe(true);
      expect(obsolete(["android 58"])).toBe(false);
      getBasicBrowsers(["android"]).forEach((item) => {
        expect(obsolete([item])).toBe(false);
      });
    });
    it("should pass UCAndroid", () => {
      setUserAgent(
        "Mozilla/5.0 (Linux; U; Android 8.1.0; zh-CN; OE106 Build/OPM1.171019.026) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.108 UCBrowser/12.1.8.998 Mobile Safari/537.36"
      );
      expect(obsolete(["and_chr 56"])).toBe(true);
      expect(obsolete(["and_chr 57"])).toBe(true);
      expect(obsolete(["and_chr 58"])).toBe(false);
      getBasicBrowsers(["and_chr"]).forEach((item) => {
        expect(obsolete([item])).toBe(false);
      });
    });
    it("should pass QQAndroid", () => {
      setUserAgent(
        "Mozilla/5.0 (Linux; U; Android 8.1.0; en-us; OE106 Build/OPM1.171019.026) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.132 MQQBrowser/8.9 Mobile Safari/537.36"
      );
      expect(obsolete(["and_chr 56"])).toBe(true);
      expect(obsolete(["and_chr 57"])).toBe(true);
      expect(obsolete(["and_chr 58"])).toBe(false);
      getBasicBrowsers(["and_chr"]).forEach((item) => {
        expect(obsolete([item])).toBe(false);
      });
    });
  });
  describe("test multiple target browsers", () => {
    it("should pass IE", () => {
      setUserAgent("Mozilla/5.0 (Windows NT 6.1; Trident/7.0; rv:10.0) like Gecko");
      expect(obsolete(["ie 9", "chrome 30"])).toBe(true);
      expect(obsolete(["ie 10", "chrome 30"])).toBe(true);
      expect(obsolete(["ie 11", "chrome 30"])).toBe(false);
    });
    it("should pass Chrome", () => {
      setUserAgent(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3538.77 Safari/537.36"
      );
      expect(obsolete(["ie 9", "chrome 59"])).toBe(true);
      expect(obsolete(["ie 9", "chrome 60"])).toBe(true);
      expect(obsolete(["ie 9", "chrome 61"])).toBe(false);
    });
  });
  describe("test duplicate name target browsers", () => {
    it("should pass IE", () => {
      setUserAgent("Mozilla/5.0 (Windows NT 6.1; Trident/7.0; rv:10.0) like Gecko");
      expect(obsolete(["ie 5.0", "ie 5", "ie 6"])).toBe(true);
      expect(obsolete(["ie 5.5", "ie 5", "ie 6"])).toBe(true);
      expect(obsolete(["ie 10", "ie 11"])).toBe(true);
      expect(obsolete(["ie 11"])).toBe(false);
    });
    it("should pass Chrome", () => {
      setUserAgent(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3538.77 Safari/537.36"
      );
      expect(obsolete(["chrome 61", "chrome 59", "chrome 60"])).toBe(true);
      expect(obsolete(["chrome 62", "chrome 60", "chrome 61"])).toBe(true);
      expect(obsolete(["chrome 63", "chrome 61", "chrome 62"])).toBe(false);
    });
  });
  describe("test unknown user agent", () => {
    it("should not pass jsdom", () => {
      setUserAgent("Mozilla/5.0 (darwin) AppleWebKit/537.36 (KHTML, like Gecko) jsdom/11.12.0");
      getBasicBrowsers().forEach((item) => {
        expect(obsolete([item])).toBe(false);
      });
    });
    it("should not pass google bot", () => {
      setUserAgent("Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)");
      getBasicBrowsers().forEach((item) => {
        expect(obsolete([item])).toBe(false);
      });
    });
  });
  describe("test exception conditions", () => {
    it("should throw empty", () => {
      expect(() => {
        obsolete([]);
      }).toThrow();
    });
  });
  describe("template", () => {
    const html = "<div>Sorry.</div>";
    it("should insert custom template", () => {
      setUserAgent(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3538.77 Safari/537.36"
      );
      expect(
        obsolete(["chrome 60"], {
          template: html,
        })
      ).toBe(true);
      expect(document.body.innerHTML).toBe("");
      expect(
        obsolete(["chrome 61"], {
          template: html,
        })
      ).toBe(false);
      expect(document.body.innerHTML.includes(html)).toBe(true);
    });
  });
  describe("Android chrome 104....", () => {
    it("should pass", () => {
      setUserAgent(
        "Mozilla/5.0 (Linux; Android 12; SM-S908B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.5112.97 Mobile Safari/537.36"
      );
      expect(
        obsolete([
          "and_chr 104",
          "and_ff 101",
          "chrome 104",
          "chrome 103",
          "chrome 102",
          "chrome 101",
          "chrome 100",
          "chrome 99",
          "chrome 98",
          "chrome 97",
          "chrome 96",
          "chrome 95",
          "edge 104",
          "edge 103",
          "edge 102",
          "edge 101",
          "edge 100",
          "firefox 103",
          "firefox 102",
          "firefox 101",
          "firefox 100",
          "firefox 99",
          "firefox 98",
          "firefox 97",
          "firefox 96",
          "firefox 95",
          "ios_saf 15.5",
          "ios_saf 15.4",
          "ios_saf 15.2-15.3",
          "ios_saf 15.0-15.1",
          "ios_saf 14.5-14.8",
          "ios_saf 14.0-14.4",
          "ios_saf 13.4-13.7",
          "ios_saf 13.3",
          "ios_saf 13.2",
          "ios_saf 13.0-13.1",
          "opera 89",
          "opera 88",
          "opera 87",
          "opera 86",
          "opera 85",
          "opera 84",
          "opera 83",
          "opera 82",
          "opera 81",
          "opera 80",
          "safari 15.6",
          "safari 15.5",
          "safari 15.4",
          "safari 15.2-15.3",
          "safari 15.1",
          "safari 15",
          "safari 14.1",
          "safari 14",
          "safari 13.1",
          "safari 13",
        ])
      ).toBe(true);
    });
  });
  describe("Should not pass Edg 95, if browserlist accept 100+ and strict mode", () => {
    it("should pass", () => {
      setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.54 Safari/537.36 Edg/95.0.1020.30"
      );
      expect(obsolete(["chrome 95", "edge 100"], { isStrict: true })).toBe(false);
    });
  });
  describe("browserlist template", () => {
    it("should pass chrome", () => {
      setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36"
      );
      expect(
        obsolete([
          "chrome 103",
          "chrome 102",
          "chrome 101",
          "chrome 100",
          "chrome 99",
          "chrome 98",
          "chrome 97",
          "chrome 96",
          "chrome 95",
          "chrome 94",
          "edge 103",
          "edge 102",
          "firefox 102",
          "firefox 101",
          "ios_saf 15.5",
          "ios_saf 15.4",
          "ios_saf 15.2-15.3",
          "ios_saf 15.0-15.1",
          "ios_saf 14.5-14.8",
          "ios_saf 14.0-14.4",
          "ios_saf 13.4-13.7",
          "ios_saf 13.3",
          "ios_saf 13.2",
          "ios_saf 13.0-13.1",
          "opera 86",
          "opera 85",
          "safari 15.5",
          "safari 15.4",
          "safari 15.2-15.3",
          "safari 15.1",
          "safari 15",
          "safari 14.1",
          "safari 14",
          "safari 13.1",
          "safari 13",
        ])
      ).toBe(true);
    });
  });
});
