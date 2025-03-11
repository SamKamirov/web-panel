import { ClassNames, DURATION, RANGE, UpdateType } from "../const";
import { getRangeByDuration } from "../utils";
import { groupAddressesByDuration } from "../utils/filter";
import { render, replace } from "../utils/render";
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
  #displayModel = null;

  #isLoading = true;

  constructor({ container, dataModel, displayModel }) {
    this.#container = container;
    this.#unitListView = new UnitListView();
    this.#headerView = new HeaderView({ className: ClassNames.DEFAULT });
    this.#applicationsModel = dataModel;
    this.#applicationsModel.addObserver(this.#handleModelChange);
    this.#displayModel = displayModel;
    this.#displayModel.addObserver(this.#handleDisplayChange);
    this.#togglerView = new TogglerView({ onClick: this.#togglerClickHandler });
  }

  #togglerClickHandler = (updateType, mode) => this.#displayModel.setDisplayMode(updateType, mode)

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
      this.#togglerView.show();

      this.#renderUnitItems();
    }
  }

  #renderUnitItems() {
    const displayMode = this.#displayModel.displayMode;
    const addresses = (displayMode === 'without' ?
      this.#applicationsModel.applications.groupedByHouse : this.#applicationsModel.applications.groupedByAddress);

    this.#renderUnitItem(DURATION.DAY, addresses);
    this.#renderUnitItem(DURATION.WEEK, addresses);
    this.#renderUnitItem(DURATION.MONTH, addresses);

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
    this.#togglerView.hide();
    console.log(addresses)

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

  #renderSwitchedUnitItems() {
    this.#clearComponent(this.#unitListView)
    this.#renderUnitItems()
  }

  #handleModelChange = (updateType) => {
    switch (updateType) {
      case UpdateType.INIT:
        this.#isLoading = false;
        console.log('init')
        this.init();
        break;
    }
  };

  #handleDisplayChange = (updateType) => {
    switch (updateType) {
      case UpdateType.SWITCH:
        this.#isLoading = false;
        this.#renderSwitchedUnitItems()
        break;
    }
  }
}
