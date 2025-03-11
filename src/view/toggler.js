import { UpdateType } from "../const";
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

  constructor({ onClick }) {
    super();
    this._setState({ isActive: false })

    this.#handleTogglerClick = () => {
      this._setState({ isActive: !this._state.isActive })

      if (this._state.isActive) {
        onClick(UpdateType.SWITCH, 'with');
      } else {
        onClick(UpdateType.SWITCH, 'without')
      }
    };

    this.element.querySelector("input").addEventListener("click", this.#handleTogglerClick);
  }

  get template() {
    return getTogglerTemplate({ isToggleChecked: this._state.isActive });
  }

  hide() {
    this.element.classList.add('hidden')
  }

  show() {
    this.element.classList.remove('hidden')
  }
}
