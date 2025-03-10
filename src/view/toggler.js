import AbstractStatefulView from "./abstract-stateful-view";

const getTogglerTemplate = ({ isToggleChecked }) =>
  `<section class="toggler">
          <h3 class="toggler-title">С квартирами</h3>
          <div class="cl-toggle-switch">
            <label class="cl-switch">
              <input type="checkbox" ${isToggleChecked && "checked"}/>
              <span></span>
            </label>
          </div>
        </section>`;

export default class TogglerView extends AbstractStatefulView {
  #handleTogglerClick = null;

  constructor() {
    super();
    // this.#handleTogglerClick = onClick;
    // this.element
    //   .querySelector("input")
    //   .addEventListener("click", this.#handleTogglerClick);
  }

  get template() {
    return getTogglerTemplate(this._state);
  }
}
