import AbstractView from "../view/abstract";

export function render(container, component, position = "beforeend") {
  container.insertAdjacentElement(position, component.element);
}

export function createElement(template) {
  const newElement = document.createElement("div");
  newElement.innerHTML = template;

  return newElement.firstElementChild;
}

export function remove(component) {
  if (component === null) {
    return;
  }

  component.element.remove();
  component.removeElement();
}

export function replace(newComponent, oldComponent) {
  if (
    !(
      newComponent instanceof AbstractView &&
      oldComponent instanceof AbstractView
    )
  ) {
    throw new Error("Can replace only components");
  }

  const newElement = newComponent.element;
  const oldElement = oldComponent.element;

  const parent = oldElement.parentElement;

  if (parent === null) {
    throw new Error("Parent element doesn't exist");
  }

  parent.replaceChild(newElement, oldElement);
}
