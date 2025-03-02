import { ClassNames, DURATION, RANGE, UpdateType } from "../const";
import { getRangeByDuration } from "../utils";
import { groupAddressesByDuration } from "../utils/filter";
import { remove, render, replace } from "../utils/render";
import HeaderView from "../view/header-view";
import TogglerView from "../view/toggler";
import UnitListItemView from "../view/unit-list-item-view";
import UnitListView from "../view/unit-list-view";

export default class Unit {
  #container = null;
  #unitListView = null;
  #headerView = null;
  #togglerView = null;

  #applicationsModel = null;
  #isLoading = true;

  constructor({ container, model }) {
    this.#container = container;
    this.#unitListView = new UnitListView();
    this.#headerView = new HeaderView({ className: ClassNames.DEFAULT });
    this.#applicationsModel = model;
    this.#applicationsModel.addObserver(this.#handleModelChange);
    this.#togglerView = new TogglerView();
  }

  #clearContainer() {
    this.#container.innerHTML = "";
    this.#unitListView.element.innerHTML = "";
  }

  init = () => {
    this.#clearContainer();
    this.#renderPageMain();
  };

  #renderPageMain() {
    if (!this.#isLoading) {
      render(this.#container, this.#headerView);
      render(this.#container, this.#togglerView);
      this.#renderUnitItems();
    }
  }

  #renderUnitItems() {
    this.#renderUnitItem(DURATION.DAY, this.#applicationsModel.applications);
    this.#renderUnitItem(DURATION.WEEK, this.#applicationsModel.applications);
    this.#renderUnitItem(DURATION.MONTH, this.#applicationsModel.applications);

    render(this.#container, this.#unitListView);
  }

  #renderUnitItem(duration, addresses) {
    const range = getRangeByDuration(duration);
    const filteredAddresses = groupAddressesByDuration(duration, addresses);

    if (!filteredAddresses.length) return;

    const unitListItem = new UnitListItemView({
      range,
      addresses: filteredAddresses.slice(RANGE.START, RANGE.END),
      onClick: () => this.#renderPreviewPage(range, filteredAddresses),
      className: ClassNames.MAIN_PAGE,
    });

    render(this.#unitListView.element, unitListItem);
  }

  #clearComponent(component) {
    component.element.innerHTML = "";
  }

  #renderPreviewPage = (range, addresses) => {
    this.#clearComponent(this.#unitListView);
    remove(this.#togglerView);

    const newHeaderComponent = new HeaderView({
      className: ClassNames.UNIT_TITLE_LINK,
      onClick: this.init,
    });

    replace(newHeaderComponent, this.#headerView);

    const unitListItem = new UnitListItemView({
      range,
      addresses,
      className: ClassNames.DEFAULT,
    });

    render(this.#unitListView.element, unitListItem);
  };

  #handleModelChange = (updateType) => {
    switch (updateType) {
      case UpdateType.INIT:
        this.#isLoading = false;
        this.init();
        break;
    }
  };
}
