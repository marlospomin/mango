const defaultConfig = {
}

export default function (selector = '[data-mango]', config = {}) {
  // Push default into config
  config = { ...defaultConfig, ...config }

  function select() {
    // Load all the images given selector
    const images = document.querySelectorAll(selector)
    // Return image collection
    return images
  }

  function clone(element) {
    // Save values into vars
    const { top, left, width, height } = element.getBoundingClientRect()
    // Clone the element
    const fakeElement = element.cloneNode()
    // Save the scrolled amounts into vars
    const scrollTop = window.pageYOffset
    const scrollLeft = window.pageXOffset
    // Set custom style for the fake element
    fakeElement.style.position = 'absolute'
    fakeElement.style.top = `${ top + scrollTop }px`
    fakeElement.style.left = `${ left + scrollLeft }px`
    fakeElement.style.width = `${ width }px`
    fakeElement.style.height = `${ height }px`
    // Return the cloned element
    return fakeElement
  }

  function wrap() {

  }

  function trigger() {

  }

  function zoom() {

  }

  function animate() {

  }

  function detach() {

  }
}
