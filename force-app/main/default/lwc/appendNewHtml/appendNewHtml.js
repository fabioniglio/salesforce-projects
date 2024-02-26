/* eslint-disable @lwc/lwc/no-inner-html */
import { LightningElement, api } from "lwc";

export default class AppendHTML extends LightningElement {
  _result;
  loaded;

  @api
  get result() {
    return this._result;
  }

  set result(data) {
    this._result = data;
    if (this.loaded) {
      this.attachHtml();
    }
  }

  renderedCallback() {
    if (this._result) {
      this.attachHtml();
    }
  }

  attachHtml() {
    const container = this.template.querySelector(".htmlcontainer");

    if (container) {
      container.innerHTML = this._result;
      this.loaded = true;
    }
  }
}
