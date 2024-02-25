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
  }

  renderedCallback() {
    if (this._result && !this.loaded) {
      this.attachHtml();
    }
  }

  attachHtml() {
    const container = this.template.querySelector(".htmlcontainer");

    console.log("Container", container);

    if (container) {
      container.innerHTML = this._result;
      this.loaded = true;
    }
  }
}