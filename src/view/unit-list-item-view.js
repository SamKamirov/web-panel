import { API_TARGET, POSTFIX } from "../config.js";
import AbstractView from "./abstract.js";

const linkClasses = {
  "Согласование": 'recieved',
  "В работе": "proccessing",
  "Закрыт": "closed"
}

const renderApplicationsList = (address) => {
  return address.applications
    .map((item) => {
      const className = linkClasses[item.status]
      return `<li class="application__item">
            <a class="application__link ${className}"
              href="${API_TARGET}${item.id + POSTFIX}"
              target="blank">${item.id}
            </a>
            <span class="application__type"> (${item.type})</span>
          </li>`
    }).join("");
};

const checkAreAllApplicationsClosed = (address) => {
  return address.applications.every(application => application.status === 'Закрыт')
}

const renderApplicationsInfo = (addresses) => {
  return addresses
    .map((address) => {
      const isAllClosed = checkAreAllApplicationsClosed(address)
      return `<li class="addresses__wrapper">
            <div class="addresses__content">
              <p class="addresses__count ${isAllClosed ? 'address--closed' : ''}">${address.applications.length}</p>
              <p class="addresses__address">${address.id}</p>
            </div>
              <ul class="addresses__applications-list hidden">
              ${renderApplicationsList(address)}
              </ul>
          </li>`;
    })
    .join("")
};

const getUnitItemTemplate = (range, addresses, className) => {
  return `<li class="unit-item unit-item--${addresses.length ? "active" : "hidden"}">
            <article class="unit__canvas canvas">
              <h3 class="canvas__title ${className}">${range}</h3>
              <ul class="addresses addresses--month">
               ${renderApplicationsInfo(addresses)}
              </ul>
            </article>
          </li>`;
};

export default class UnitListItemView extends AbstractView {
  #range = null;
  #addresses = null;
  #className = null;

  #handleClick = null;

  constructor({ range, addresses, className, onClick = null }) {
    super();
    this.#range = range;
    this.#addresses = addresses;
    this.#handleClick = onClick;
    this.#className = className;

    this.element
      .querySelector(".unit__canvas")
      .addEventListener("click", this.#handleClick);

    !onClick && this.#addListeners();
  }

  get template() {
    return getUnitItemTemplate(this.#range, this.#addresses, this.#className);
  }

  #handleAddressClick(e) {
    e.currentTarget
      .parentElement
      .querySelector(".addresses__applications-list")
      .classList.toggle("hidden");
  }

  #addListeners() {
    const items = this.element.querySelectorAll(".addresses__content");

    items.forEach((item) =>
      item.addEventListener("click", this.#handleAddressClick),
    );
  }
}
