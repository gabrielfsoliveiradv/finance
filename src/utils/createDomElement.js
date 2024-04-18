export function createDomElement(element, ...htmlClasses) {
  element = document.createElement(element)
  htmlClasses.forEach(htmlClass =>{
    element.classList.add(htmlClass)
  })

  return element
}