import { UpdateType } from "../const";
import Observable from "../framework/observer.js";

export default class DataModel extends Observable {
  #data = null;

  set applications(data) {
    this.#data = data;
  }

  get applications() {
    return this.#data;
  }

  async init() {
    try {
      const response = await fetch("data/data.json").then(
        (response) => response,
      );

      this.#data = await response.json();
      this._notify(UpdateType.INIT);
    } catch (e) {
      console.log(e);
    }
  }
}
