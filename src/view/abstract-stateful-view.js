import AbstractView from "./abstract";

export default class AbstractStatefulView extends AbstractView {
  _state = {};

  updateElement(update) {
    if (!update) {
      return;
    }

    this._setState(update);

    this.#rerenderElement();
  }

  _setState(update) {
    this._state = structuredClone({ ...this._state, ...update });
  }

  #rerenderElement() {
    const prevElement = this.element;
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.element;

    parent.replaceChild(newElement, prevElement);

    this._restoreHandlers();
  }
}
