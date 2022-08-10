import Detective from "./detective";
import browserslist from "../node_modules/browserslist/index";

interface ObsoleteOptions {
  template?: string; // The prompt html template. It accepts any document fragment.
}

export default class Obsolete {
  static defaultOptions = {
    template:
      "<button id=\"obsoleteClose\" style='border:none;cursor:pointer;border-radius:unset;width:100%;text-align:center;color:white;background-color:red'>Your browser is not supported</button>",
  };

  options: { template: string };

  detective: Detective;

  constructor(options?: ObsoleteOptions) {
    this.options = {
      ...Obsolete.defaultOptions,
      ...options,
    };
    this.detective = new Detective();
  }

  /**
   * Test browser compatibility.
   */
  test(browsers: string[]) {
    if (!browsers.length) {
      throw new Error("Parameter `browsers` is empty.");
    }

    const passed = this.detective.detect(navigator.userAgent, browsers);
    if (!passed) {
      const el = document.createElement("div");
      el.onclick = function click() {
        el.remove();
      };
      el.style.color = "#fff";
      el.style.background = "red";
      el.style.position = "fixed";
      el.style.width = "100vw";
      el.style.padding = "4px";
      el.textContent = "Your browser is not supported, supported browsers here";
      
      document.body.appendChild(el);
      return false;
    }
    return true;
  }
}

// new Obsolete().test(browserslist());