(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports);
    global.mango = mod.exports;
  }
})(this, function (module, exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function () {
    var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '[data-mango]';
    var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    // Push default into config
    config = _extends({}, defaultConfig, config);

    function select() {
      // Load all the images given selector
      var images = document.querySelectorAll(selector);
      // Return image collection
      return images;
    }

    // Load each image into images
    var images = select();

    function clone(element) {
      // Save values into vars
      var _element$getBoundingC = element.getBoundingClientRect(),
          top = _element$getBoundingC.top,
          left = _element$getBoundingC.left,
          width = _element$getBoundingC.width,
          height = _element$getBoundingC.height;
      // Clone the element


      var fakeElement = element.cloneNode();
      // Save the scrolled amounts into vars
      var scrollTop = window.pageYOffset;
      var scrollLeft = window.pageXOffset;
      // Set custom style for the fake element
      fakeElement.style.position = 'absolute';
      fakeElement.style.top = top + scrollTop + 'px';
      fakeElement.style.left = left + scrollLeft + 'px';
      fakeElement.style.width = width + 'px';
      fakeElement.style.height = height + 'px';
      // Return the cloned element
      return fakeElement;
    }

    function wrap() {
      // Create an overlay
      var wrapper = document.createElement('div');
      // Style the overlay
      wrapper.classList.add('mango-overlay');
      // Return the created overlay
      return wrapper;
    }

    // Save the created wrapper into the var
    var wrapper = wrap();

    function trigger(event) {
      // Prevent default
      event.preventDefault();
      // If whoever triggered the event is an actual element
      if (event.target) {
        // Save the element who did that
        var _origin = event.target;
        // Trigger zoom-in
        zoom(_origin);
      } else {
        // Zoom out
        zoom(origin).out(150);
      }
    }

    function zoom(origin) {
      // If origin is not found break
      if (!origin) return;
      // Save scrolltop value
      var scrollTop = window.pageYOffset || 0;
      // Set control var
      var isAnimating = true;
      // Save zoomed image into var
      var zoomed = clone(origin);
      // Apply the overlay
      document.body.appendChild(wrapper);
      // Apply the clone
      document.body.appendChild(zoomed);

      // zoomed.parentNode.insertBefore(wrapper, zoomed)
      // wrapper.appendChild(zoomed)

      // Request animation event
      requestAnimationFrame(function () {
        document.body.classList.add('mango--open');
      });
      // Set style to the original image
      origin.style.visibility = 'hidden';
      // Set styles for the zoomed image
      zoomed.classList.add('mango-image--open');
      // Remove handler
      var remove = function remove() {
        // Set control var
        isAnimating = true;
        // Add zoom-out events
        zoomed.addEventListener('click', function () {
          isAnimating = false;
          out();
        });
        window.addEventListener('resize', function () {
          isAnimating = false;
          out(20);
        });
        wrapper.addEventListener('click', function () {
          isAnimating = false;
          out();
        });
        // Remove itself
        zoomed.removeEventListener('transitionend', remove);
      };
      // Keydown handler
      var keydown = function remove() {
        if ([27, 37, 39].includes(event.keyCode)) {
          isAnimating = false;
          out();
        }
      };
      // Scroll handler
      var scroll = function remove() {
        // Save current scroll
        var currentScroll = window.pageYOffset || 0;
        // If scrolled more than 50px zoom out
        if (Math.abs(scrollTop - currentScroll) > 50) {
          isAnimating = false;
          out(150);
        }
      };
      // Add event listeners
      zoomed.addEventListener('transitionend', remove);
      document.addEventListener('keydown', keydown);
      document.addEventListener('scroll', scroll);
      // Animate transitions
      animate(origin, zoomed);
      // Zoom out function
      function out() {
        var timeout = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

        // If timeout is more than 0 time it out else zoom out
        timeout > 0 ? setTimeout(run, timeout) : run();

        function run() {
          // If we are animating break -- Failing here
          if (isAnimating) return;
          // Set animation var
          isAnimating = true;
          // Remove class from body
          document.body.classList.remove('mango--open');
          // De transform the element
          zoomed.style.transform = 'none';
          // Remove event listener from click
          zoomed.removeEventListener('click', out());
          // Remove handler
          remove = function remove() {
            // Set visibility of the original image
            origin.style.visibility = 'visible';
            // Remove the fake element
            // document.body.removeChild(zoomed)
            zoomed.remove();
            // Remove the wrapper
            // document.body.removeChild(wrapper)
            wrapper.remove();
            // Remove classes
            zoomed.classList.remove('mango-image--open');
            // Set animation var
            isAnimating = false;
            // Remove event itself
            zoomed.removeEventListener('transitionend', remove);
          };
          // Add animations to zoom out
          zoomed.addEventListener('transitionend', remove);
        }
      }
    }

    function animate(origin, zoomed) {
      // Create a container
      var container = {
        width: window.innerWidth, height: window.innerHeight,
        left: 0, top: 0, right: 0, bottom: 0
        // Set viewport vars
      };var viewportWidth = viewportWidth || container.width - 5 * 2;
      var viewportHeight = viewportHeight || container.height - 5 * 2;
      // Set the zoom target
      var zoomTarget = origin;
      // Save computed information
      var _zoomTarget$naturalWi = zoomTarget.naturalWidth,
          naturalWidth = _zoomTarget$naturalWi === undefined ? viewportWidth : _zoomTarget$naturalWi,
          _zoomTarget$naturalHe = zoomTarget.naturalHeight,
          naturalHeight = _zoomTarget$naturalHe === undefined ? viewportHeight : _zoomTarget$naturalHe;

      var _zoomTarget$getBoundi = zoomTarget.getBoundingClientRect(),
          top = _zoomTarget$getBoundi.top,
          left = _zoomTarget$getBoundi.left,
          width = _zoomTarget$getBoundi.width,
          height = _zoomTarget$getBoundi.height;
      // Set scales


      var scaleX = Math.min(naturalWidth, viewportWidth) / width;
      var scaleY = Math.min(naturalHeight, viewportHeight) / height;
      // Set scale
      var scale = Math.min(scaleX, scaleY) || 1;
      // Set transform values
      var translateX = (-left + (viewportWidth - width) / 2 + 5 + container.left) / scale;
      var translateY = (-top + (viewportHeight - height) / 2 + 5 + container.top) / scale;
      // Transform
      var transform = 'scale(' + scale + ') translate3d(' + translateX + 'px, ' + translateY + 'px, 0)';
      // Style element
      zoomed.style.transform = transform;
    }

    function run(images) {
      // For each image in the collection run mango upon click
      Array.from(images).forEach(function (image) {
        // Add styles to each image
        image.classList.add('mango-image');
        // Trigger the zoom effect
        image.addEventListener('click', function () {
          trigger(event);
        });
      });
    }

    return run(images);
  };

  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  // Add default config
  // Fix z-index issues
  // Wrap image into wrapper
  // Refactor animate
  // Refactor out
  // Refactor event listeners
  // Refactor comments

  var defaultConfig = {/* Empty for now */};

  module.exports = exports['default'];
});