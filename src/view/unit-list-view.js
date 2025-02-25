import AbstractView from "./abstract.js";

const getUnitListViewTemplate = () => ('<ul class="unit-list"></ul>');

export default class UnitListView extends AbstractView {

  get template() {
    return getUnitListViewTemplate();
  }
}
