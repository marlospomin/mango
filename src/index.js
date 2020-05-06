const defaultConfig = {
  // Default selector
  selector: '[data-mango]',
  // Default background color
  background: 'white',
  // Default margin
  margin: 50,
  // Default cancel keys
  interruptKeys: [27, 37, 39]
}

export default function (config = {}) {
  // Push default into config
  const { selector, background,
     margin, interruptKeys } = { ...defaultConfig, ...config }

  // Load each image into images
  const images = select()
  // Save the created wrapper into the var
  const wrapper = wrap()
  // Create a control var
  let isAnimating = false

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
    const clone = element.cloneNode()
    // Save the scrolled amounts into vars
    const scrollTop = window.pageYOffset || 0
    const scrollLeft = window.pageXOffset || 0
    // Set custom style for the fake element
    clone.style.position = 'absolute'
    clone.style.top = `${ top + scrollTop }px`
    clone.style.left = `${ left + scrollLeft }px`
    clone.style.width = `${ width }px`
    clone.style.height = `${ height }px`
    // Return the cloned element
    return clone
  }

  function wrap() {
    // Create an overlay
    const wrapper = document.createElement('div')
    // Style the overlay
    wrapper.classList.add('mango-overlay')
    // Style the background color
    wrapper.style.backgroundColor = background
    // Return the created overlay
    return wrapper
  }

  function trigger(event) {
    // Prevent default
    event.preventDefault()
    // If whoever triggered the event is an actual element
    if (event.target) {
      // Save the element who did that
      const origin = event.target
      // Zoom in
      zoom(origin)
    } else {
      // Zoom out
      zoom(origin).out(150)
    }
  }

  function zoom(origin) {
    // If origin is not found break
    if (!origin) return
    // Set control var
    isAnimating = true
    // Save the current scrollTop value
    const scrollTop = window.pageYOffset || 0
    // Save zoomed image into var
    const zoomed = clone(origin)
    // Apply the overlay
    document.body.appendChild(wrapper)
    // Apply the clone
    document.body.appendChild(zoomed)
    // Request animation event
    requestAnimationFrame(() => {
      document.body.classList.add('mango--open')
    })
    // Set style to the original image
    origin.style.visibility = 'hidden'
    // Set styles for the zoomed image
    zoomed.classList.add('mango-image--open')
    // Remove handler
    let remove = function remove() {
      // Add events
      zoomed.addEventListener('click', () => {
        isAnimating = false
        out()
      })
      window.addEventListener('resize', () => {
        isAnimating = false
        out()
      })
      wrapper.addEventListener('click', () => {
        isAnimating = false
        out()
      })
      // Remove itself
      zoomed.removeEventListener('transitionend', remove)
    }
    // Keydown handler
    const keydown = function remove() {
      if (interruptKeys.includes(event.keyCode)) {
        isAnimating = false
        out()
      }
    }
    // Scroll handler
    const scroll = function remove() {
      // Save current scroll
      const currentScroll = window.pageYOffset || 0
      // If scrolled more than 50px zoom out
      if (Math.abs(scrollTop - currentScroll) > 50) {
        isAnimating = false
        out(150)
      }
    }
    // Add event listeners
    zoomed.addEventListener('transitionend', remove)
    document.addEventListener('keydown', keydown)
    document.addEventListener('scroll', scroll)
    // Calculte and set transform
    if (origin.dataset.src) {
      // Fetchs an image
      function fetchImage(url) {
        return new Promise((resolve, reject) => {
          // Create a new image
          const image = new Image()
          // Load the src
          image.src = url
          // Handle errors
          image.onload = resolve
          image.onerror = reject
        })
      }
      // Preloads an image
      function preloadImage(image) {
        // Save the src
        const src = image.dataset.src
        // Return to those 2 methods or fallback
        return fetchImage(src).then(() => applyTransform(image, src)).catch(
          () => zoomed.style.transform = calculate(origin))
      }
      // Apply the transform
      function applyTransform(image, src) {
        // Load src into the image
        image.src = src
        // Apply the real transform
        const interval = setInterval(() => { clearInterval(interval)
          image.style.transform = calculate(image) }, 20)
      }
      // Run the preload
      preloadImage(zoomed)
    } else {
      // Fallback
      zoomed.style.transform = calculate(origin)
    }
    // Zoom out function
    function out(timeout = 0) {
      // If timeout is more than 0 time it out else zoom out
      if (timeout > 0) {
        setTimeout(run, timeout)
      } else {
        run()
      }

      function run() {
        // If we are animating break
        if (isAnimating) return
        // Set control var
        isAnimating = true
        // Remove class from body
        document.body.classList.remove('mango--open')
        // De-transform the element
        zoomed.style.transform = 'none'
        // Remove event listener from click
        zoomed.removeEventListener('click', out())
        // Remove handler
        remove = function remove() {
          // Set visibility of the original image
          origin.style.visibility = 'visible'
          // Remove the cloned element and the wrapper
          zoomed.remove()
          wrapper.remove()
          // Remove classes
          zoomed.classList.remove('mango-image--open')
          // Set control var
          isAnimating = false
          // Remove event itself
          zoomed.removeEventListener('transitionend', remove)
        }
        // Add animations to zoom out
        zoomed.addEventListener('transitionend', remove)
        // Remove events
        document.removeEventListener('keydown', keydown)
        document.removeEventListener('scroll', scroll)
      }
    }
  }

  function calculate(origin) {
    // Create a container
    const container = {
      width: window.innerWidth, height: window.innerHeight,
      left: 0, top: 0, right: 0, bottom: 0
    }
    // Set viewport vars
    let viewportWidth = container.width - margin * 2
    let viewportHeight = container.height - margin * 2
    // Set the zoom target
    const zoomTarget = origin
    // Save computed information
    const { naturalWidth = viewportWidth,
       naturalHeight = viewportHeight } = zoomTarget
    const { top, left, width, height } = zoomTarget.getBoundingClientRect()
    // Get scale
    const scaleX = Math.min(naturalWidth, viewportWidth) / width
    const scaleY = Math.min(naturalHeight, viewportHeight) / height
    const scale = Math.min(scaleX, scaleY) || 1
    // Set transform values
    const translateX = (-left + (viewportWidth - width) / 2 + margin +
     container.left) / scale
    const translateY = (-top + (viewportHeight - height) / 2 + margin +
     container.top) / scale
    // Apply transform
    const transform = `scale(${scale}) translate3d(${translateX}px,
       ${translateY}px, 0)`
    // Return transform
    return transform
  }

  function run(images) {
    // For each image in the collection run mango upon click
    Array.from(images).forEach(image => {
      // Add styles to each image
      image.classList.add('mango-image')
      // Trigger the zoom effect
      image.addEventListener('click', (event) => {
        trigger(event)
      })
    })
  }

  return run(images)
}
