export default class Alert {
  refs: HTMLElement[];

  constructor() {
    this.refs = [];
  }

  /**
   * Prompt message to user.
   */
  prompt(template: string) {
    const fragment = document.createDocumentFragment();
    const placeholderElement = this.createElement("div", null);

    placeholderElement.innerHTML = template;
    while (true) {
      const { firstChild } = placeholderElement;

      if (!firstChild) {
        break;
      }
      if (firstChild.nodeType === 1 && firstChild.nodeName === "SCRIPT") {
        const script = this.createElement("script", null);

        script.innerHTML = firstChild.nodeValue!;
        fragment.appendChild(script);
        this.refs.push(script);
        placeholderElement.removeChild(firstChild);
      } else {
        fragment.appendChild(firstChild);
        this.refs.push(firstChild as HTMLElement);
      }
    }
    this.bindEvents(fragment);
    document.body.insertBefore(fragment, document.body.firstChild);
  }

  /**
   * Bind events for close button.
   */
  bindEvents(fragment: DocumentFragment) {
    let close;

    if (fragment.querySelector) {
      close = fragment.querySelector("#obsoleteClose");
    } else if (fragment.getElementById) {
      close = fragment.getElementById("obsoleteClose");
    }
    if (!close) {
      return;
    }
    if (close.addEventListener) {
      // close.addEventListener("click", bind(this.handleClose, this));
      // @ts-ignore
      close.addEventListener("click", (...args) => this.handleClose.apply(this, [...args]));
    }
    // for IE9+
    // @ts-ignore
    else if (close.attachEvent) {
      // @ts-ignore
      close.attachEvent("onclick", (...args) => this.handleClose.apply(this, [...args]));
    }
  }

  /**
   * Close event handler.
   */
  handleClose() {
    this.refs.forEach((element) => {
      element.parentNode?.removeChild(element);
    });
  }

  /**
   * Create DOM element.
   */
  createElement(tag: string, attributes: [{ key: string; value: string }] | null) {
    const element: HTMLElement = document.createElement(tag);

    if (attributes)
      attributes.forEach((pair) => {
        element.setAttribute(pair.key, pair.value);
      });

    return element;
  }
}

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
