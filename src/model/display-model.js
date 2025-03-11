import Observable from "../framework/observer";

export default class DisplayModel extends Observable {
  #mode = 'without';

  get displayMode() {
    return this.#mode;
  }

  setDisplayMode(updateType, mode) {
    this.#mode = mode
    this._notify(updateType)
  }
}
