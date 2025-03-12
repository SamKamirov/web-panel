import AbstractView from "./abstract";

const getHeaderTemplate = (className, date) =>
  `<h2 class="unit__title ${className}">
      Повторные заявки
      <p class="date-container">${new Date(date).toLocaleDateString('ru-RU')}</p>
   </h2>`;

export default class HeaderView extends AbstractView {
  #className = null;
  #handleHeaderClick = null;
  #date = null;

  constructor({ className, date, onClick }) {
    super();
    this.#className = className;
    this.#date = date;
    this.#handleHeaderClick = onClick;
    this.element.addEventListener("click", this.#handleHeaderClick);
  }

  get template() {
    return getHeaderTemplate(this.#className, this.#date);
  }
}
