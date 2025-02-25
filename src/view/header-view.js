import AbstractView from "./abstract";

const getHeaderTemplate = (className) =>
  `<h2 class="unit__title ${className}">Повторные заявки</h2>`;

export default class HeaderView extends AbstractView {
  #className = null;
  #handleHeaderClick = null;

  constructor({ className, onClick }) {
    super();
    this.#className = className;
    this.#handleHeaderClick = onClick;
    this.element.addEventListener("click", this.#handleHeaderClick);
  }

  get template() {
    return getHeaderTemplate(this.#className);
  }
}
