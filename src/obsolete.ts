import Detective from "./detective";
import Alert from "./alert";

interface ObsoleteOptions {
  template?: string; // The prompt html template. It accepts any document fragment.
}

function requestIdleCallback(callback: IdleRequestCallback, options: IdleRequestOptions = {}) {
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(callback, options);
    return;
  }

  const start = new Date().getTime();

  setTimeout(() => {
    const elapsedTime = Date.now() - start;

    callback({
      didTimeout: false,
      timeRemaining() {
        return Math.max(0, 50 - elapsedTime);
      },
    });
  }, 1);
}

export default class Obsolete {
  static defaultOptions = {
    template:
      "<button id=\"obsoleteClose\" style='border:none;cursor:pointer;border-radius:unset;width:100%;text-align:center;color:white;background-color:red'>Your browser is not supported</button>",
  };

  options: { template: string };

  detective: Detective;

  alert: Alert | null;

  constructor(options: ObsoleteOptions) {
    this.options = {
      ...Obsolete.defaultOptions,
      ...options,
    };
    this.detective = new Detective();
    this.alert = null;
  }

  /**
   * Test browser compatibility.
   */
  test(browsers: string[], doneCallBack: () => void | null) {
    if (!browsers.length) {
      throw new Error("Parameter `browsers` is empty.");
    }

    const passed = this.detective.detect(navigator.userAgent, browsers);
    if (!passed) {
      requestIdleCallback(() => {
        if (this.alert) {
          this.alert.handleClose();
        } else {
          this.alert = new Alert();
        }
        this.alert.prompt(this.options.template);
        doneCallBack && doneCallBack();
      });
      return false;
    }
    return true;
  }
}
