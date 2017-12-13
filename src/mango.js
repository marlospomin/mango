/*

-Refactor Notes-

Add margin options.
Add data-src image.
Add default config options.
Merge selector into defaults.
Make selected images to only support an image tag.
Remove useless comments.
Move contants to the top.
Refactor zoom() function.
Refactor event listeners incl. their handlers.
Fix isAnimating variable.
Refactor animate() into methods and rename to calculate.
Rename fakeElement.
Reduce to 100 lines or less (without comments).

-After all above-

Refactor to annonymous const functions (like the kids today).

*/

const defaultConfig = { /* Empty for now */}

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
      // Zoom out
      zoom(origin).out(150)
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
      // Set control var
      isAnimating = true
      // Add zoom-out events
      zoomed.addEventListener('click', () => {
        isAnimating = false
        out()
      })
      window.addEventListener('resize', () => {
        isAnimating = false
        out(20)
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
      if ([27, 37, 39].includes(event.keyCode)) {
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
    // Animate transitions
    animate(origin, zoomed)
    // Zoom out function
    function out(timeout = 0) {
      // If timeout is more than 0 time it out else zoom out
      timeout > 0 ? setTimeout(run, timeout) : run()

      function run() {
        // If we are animating break -- Failing here
        if (isAnimating) return
        // Set animation var
        isAnimating = true
        // Remove class from body
        document.body.classList.remove('mango--open')
        // De transform the element
        zoomed.style.transform = 'none'
        // Remove event listener from click
        zoomed.removeEventListener('click', out())
        // Remove handler
        remove = function remove() {
          // Set visibility of the original image
          origin.style.visibility = 'visible'
          // Remove the cloned element
          zoomed.remove()
          // Remove the wrapper
          wrapper.remove()
          // Remove classes
          zoomed.classList.remove('mango-image--open')
          // Set animation var
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

  function animate(origin, zoomed) {
    // Create a container
    const container = {
      width: window.innerWidth, height: window.innerHeight,
      left: 0, top: 0, right: 0, bottom: 0
    }
    // Set viewport vars
    let viewportWidth = viewportWidth || container.width - 5 * 2
    let viewportHeight = viewportHeight || container.height - 5 * 2
    // Set the zoom target
    const zoomTarget = origin
    // Save computed information
    const { naturalWidth = viewportWidth,
       naturalHeight = viewportHeight } = zoomTarget
    const { top, left, width, height } = zoomTarget.getBoundingClientRect()
    // Set scales
    const scaleX = Math.min(naturalWidth, viewportWidth) / width
    const scaleY = Math.min(naturalHeight, viewportHeight) / height
    // Set scale
    const scale = Math.min(scaleX, scaleY) || 1
    // Set transform values
    const translateX = (-left + (viewportWidth - width) / 2 + 5 + container.left) / scale
    const translateY = (-top + (viewportHeight - height) / 2 + 5 + container.top) / scale
    // Transform
    const transform = `scale(${scale}) translate3d(${translateX}px, ${translateY}px, 0)`
    // Style element
    zoomed.style.transform = transform
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
