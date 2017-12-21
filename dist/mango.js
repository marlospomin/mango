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
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    // Push default into config
    var _defaultConfig$config = _extends({}, defaultConfig, config),
        selector = _defaultConfig$config.selector,
        background = _defaultConfig$config.background,
        margin = _defaultConfig$config.margin,
        interruptKeys = _defaultConfig$config.interruptKeys;

    // Load each image into images


    var images = select();
    // Save the created wrapper into the var
    var wrapper = wrap();
    // Create a control var
    var isAnimating = false;

    function select() {
      // Load all the images given selector
      var images = document.querySelectorAll(selector);
      // Return image collection
      return images;
    }

    function clone(element) {
      // Save values into vars
      var _element$getBoundingC = element.getBoundingClientRect(),
          top = _element$getBoundingC.top,
          left = _element$getBoundingC.left,
          width = _element$getBoundingC.width,
          height = _element$getBoundingC.height;
      // Clone the element


      var clone = element.cloneNode();
      // Save the scrolled amounts into vars
      var scrollTop = window.pageYOffset || 0;
      var scrollLeft = window.pageXOffset || 0;
      // Set custom style for the fake element
      clone.style.position = 'absolute';
      clone.style.top = top + scrollTop + 'px';
      clone.style.left = left + scrollLeft + 'px';
      clone.style.width = width + 'px';
      clone.style.height = height + 'px';
      // Return the cloned element
      return clone;
    }

    function wrap() {
      // Create an overlay
      var wrapper = document.createElement('div');
      // Style the overlay
      wrapper.classList.add('mango-overlay');
      // Style the background color
      wrapper.style.backgroundColor = background;
      // Return the created overlay
      return wrapper;
    }

    function trigger(event) {
      // Prevent default
      event.preventDefault();
      // If whoever triggered the event is an actual element
      if (event.target) {
        // Save the element who did that
        var _origin = event.target;
        // Zoom in
        zoom(_origin);
      } else {
        // Zoom out
        zoom(origin).out(150);
      }
    }

    function zoom(origin) {
      // If origin is not found break
      if (!origin) return;
      // Set control var
      isAnimating = true;
      // Save the current scrollTop value
      var scrollTop = window.pageYOffset || 0;
      // Save zoomed image into var
      var zoomed = clone(origin);
      // Apply the overlay
      document.body.appendChild(wrapper);
      // Apply the clone
      document.body.appendChild(zoomed);
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
        // Add events
        zoomed.addEventListener('click', function () {
          isAnimating = false;
          out();
        });
        window.addEventListener('resize', function () {
          isAnimating = false;
          out();
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
        if (interruptKeys.includes(event.keyCode)) {
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
      // Calculte and set transform
      if (origin.dataset.src) {
        // Fetchs an image
        var fetchImage = function fetchImage(url) {
          return new Promise(function (resolve, reject) {
            // Create a new image
            var image = new Image();
            // Load the src
            image.src = url;
            // Handle errors
            image.onload = resolve;
            image.onerror = reject;
          });
        };
        // Preloads an image


        var preloadImage = function preloadImage(image) {
          // Save the src
          var src = image.dataset.src;
          // Return to those 2 methods or fallback
          return fetchImage(src).then(function () {
            return applyTransform(image, src);
          }).catch(function () {
            return zoomed.style.transform = calculate(origin);
          });
        };
        // Apply the transform


        var applyTransform = function applyTransform(image, src) {
          // Load src into the image
          image.src = src;
          // Apply the real transform
          var interval = setInterval(function () {
            clearInterval(interval);
            image.style.transform = calculate(image);
          }, 20);
        };
        // Run the preload


        preloadImage(zoomed);
      } else {
        // Fallback
        zoomed.style.transform = calculate(origin);
      }
      // Zoom out function
      function out() {
        var timeout = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

        // If timeout is more than 0 time it out else zoom out
        if (timeout > 0) {
          setTimeout(run, timeout);
        } else {
          run();
        }

        function run() {
          // If we are animating break
          if (isAnimating) return;
          // Set control var
          isAnimating = true;
          // Remove class from body
          document.body.classList.remove('mango--open');
          // De-transform the element
          zoomed.style.transform = 'none';
          // Remove event listener from click
          zoomed.removeEventListener('click', out());
          // Remove handler
          remove = function remove() {
            // Set visibility of the original image
            origin.style.visibility = 'visible';
            // Remove the cloned element and the wrapper
            zoomed.remove();
            wrapper.remove();
            // Remove classes
            zoomed.classList.remove('mango-image--open');
            // Set control var
            isAnimating = false;
            // Remove event itself
            zoomed.removeEventListener('transitionend', remove);
          };
          // Add animations to zoom out
          zoomed.addEventListener('transitionend', remove);
          // Remove events
          document.removeEventListener('keydown', keydown);
          document.removeEventListener('scroll', scroll);
        }
      }
    }

    function calculate(origin) {
      // Create a container
      var container = {
        width: window.innerWidth, height: window.innerHeight,
        left: 0, top: 0, right: 0, bottom: 0
        // Set viewport vars
      };var viewportWidth = container.width - margin * 2;
      var viewportHeight = container.height - margin * 2;
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
      // Get scale


      var scaleX = Math.min(naturalWidth, viewportWidth) / width;
      var scaleY = Math.min(naturalHeight, viewportHeight) / height;
      var scale = Math.min(scaleX, scaleY) || 1;
      // Set transform values
      var translateX = (-left + (viewportWidth - width) / 2 + margin + container.left) / scale;
      var translateY = (-top + (viewportHeight - height) / 2 + margin + container.top) / scale;
      // Apply transform
      var transform = 'scale(' + scale + ') translate3d(' + translateX + 'px,\n       ' + translateY + 'px, 0)';
      // Return transform
      return transform;
    }

    function run(images) {
      // For each image in the collection run mango upon click
      Array.from(images).forEach(function (image) {
        // Add styles to each image
        image.classList.add('mango-image');
        // Trigger the zoom effect
        image.addEventListener('click', function (event) {
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

  var defaultConfig = {
    // Default selector
    selector: '[data-mango]',
    // Default background color
    background: 'white',
    // Default margin
    margin: 50,
    // Default cancel keys
    interruptKeys: [27, 37, 39]
  };

  module.exports = exports['default'];
});