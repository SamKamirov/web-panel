import { DATA_FILE } from "../config.js";
import { UpdateType } from "../const.js";
import Observable from "../framework/observer.js";

const DATE_FILE = 'data/config.json'

export default class AddressesModel extends Observable {
  #data = null;
  #date = null;

  set applications(data) {
    this.#data = data;
  }

  get applications() {
    return this.#data;
  }

  get date() {
    return this.#date.date;
  }

  set date(date) {
    this.#date = date;
  }

  async init() {
    try {
      const addresses = await fetch(DATA_FILE).then((response) => response);
      const date = await fetch(DATE_FILE).then((response) => response)

      this.applications = await addresses.json();
      this.date = await date.json();

      this._notify(UpdateType.INIT);
    } catch (e) {
      console.log(e);
    }
  }
}
