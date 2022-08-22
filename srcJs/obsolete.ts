import Detective from './detective';

interface Options{
  template?:
  string,
position?: string,
promptOnNonTargetBrowser?: boolean,
promptOnUnknownBrowser?: boolean,
}

class Obsolete {
  static defaultOptions = {
    template:
      '<div>Your browser is not supported. <button id="obsoleteClose">&times;</button></div>',
    position: 'afterbegin',
    promptOnNonTargetBrowser: false,
    promptOnUnknownBrowser: true,
  };

  /**
   * @param {Object} [options]
   * @param {string} [options.template] The prompt html template. It accepts any document fragment.
   * @param {string} [options.position='afterbegin'] If set 'afterbegin', the template will be injected
   * into the start of body. If set 'beforeend', the template will be injected into the end of body.
   * @param {boolean} [options.promptOnNonTargetBrowser=false] If the current browser useragent
   * doesn't match one of the target browsers, it's considered as unsupported. Thus, the prompt
   * will be shown. E.g, your browserslist configuration is `ie > 8`, by default, the prompt won't
   * be shown on Chrome or Safari browser.
   * @param {boolean} [options.promptOnUnknownBrowser=true] If the current browser useragent is
   * unknown, the prompt will be shown.
   */

  options: Options;

  detective: Detective;

  // alert: Alert | null;

  constructor(options : Options) {
    this.options = {
      ...Obsolete.defaultOptions,
      ...options,
    };
    this.detective = new Detective();
    // this.alert = null;
  }
  /**
   * Test browser compatibility.
   *
   * @param {string[]} browsers Browser names in Can I Use.
   * @param {function} done Callback when the template is injected in finish.
   * @returns {boolean}
   */
  test(browsers : Array<string>) {
    if (!browsers.length) {
      throw new Error('Parameter `browsers` is empty.');
    }

    const passed = this.detective.detect(
      navigator.userAgent,
      browsers,
      this.options.promptOnNonTargetBrowser as boolean,
      this.options.promptOnUnknownBrowser as boolean
    );
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

      // requestIdleCallback(() => {
      //   if (this.alert) {
      //     this.alert.handleClose();
      //   } else {
      //     this.alert = new Alert();
      //   }
      //   this.alert.prompt(this.options.template, this.options.position);
      // });
      return false;
    }
    return true;
  }
}

export default Obsolete;
