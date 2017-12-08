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

  // Load each image into images
  const images = select()

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
    // Create an overlay
    const wrapper = document.createElement('div')
    // Style the overlay
    wrapper.classList.add('mango-overlay')
    // Return the created overlay
    return wrapper
  }

  // Save the created wrapper into the var
  const wrapper = wrap()

  function trigger(event) {
    // Prevent default
    event.preventDefault()
    // If whoever triggered the event is an actual element
    if (event.target) {
      // Save the element who did that
      const origin = event.target
      // Trigger zoom-in
      zoom(origin)
    } else {
      // zoom-out
    }
  }

  function zoom(origin) {
    // If origin is not found break
    if (!origin) return
    // Save scrolltop value
    const scrollTop = window.pageYOffset || 0
    // Set control var
    let isAnimating = true
    // Save zoomed image into var
    const zoomed = clone(origin)
    // Apply the overlay
    document.body.appendChild(wrapper)
    // Request animation event
    requestAnimationFrame(() => {
      document.body.classList.add('mango--open')
    })
    // Set style to the original image
    origin.style.visibility = 'hidden'
    // Set styles for the zoomed image
    zoomed.classList.add('mango-image--open')
    // Add zoom-out events
    zoomed.addEventListener('click', out())
    zoomed.addEventListener('transitioned', () => {
      // Set control var
      isAnimating = false
      // Remove itself
      zoomed.removeEventListener('transitioned')
    })
    // Animate transitions
    animate()
    // Zoom out function
    function out() {
      console.log('hello')
    }
  }

  function animate() {

  }

  function run(images) {
    // For each image in the collection run mango upon click
    images.forEach(image => {
      // Add styles to each image
      image.classList.add('mango-image')
      // Trigger the zoom effect
      image.addEventListener('click', () => {
        trigger(event)
      })
    })
  }

  return run(images)
}
