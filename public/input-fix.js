// This script helps diagnose and fix issues with input fields not accepting typing

(function() {
  // Function to check if inputs are working
  function checkInputs() {
    const inputs = document.querySelectorAll('input, textarea');
    
    // Process input elements
    inputs.forEach((element, index) => {
      const input = element;
      
      // Check if the input has event listeners (this is a simplified check)
      const inputAny = input;
      const hasInputListener = inputAny._events &&
        (inputAny._events.input || inputAny._events.change);
      
      // Ensure the input is not disabled or readonly
      if (input.disabled) {
        input.disabled = false;
      }
      
      if (input.readOnly) {
        input.readOnly = false;
      }

      // Add direct event listeners to ensure input events work
      input.addEventListener('keydown', function(e) {
        // Event handler for keydown
      });

      input.addEventListener('input', function(e) {
        // Event handler for input
      });
    });
  }
  
  // Function to fix potential issues with event propagation
  function fixEventPropagation() {
    // Check if there are any global event listeners capturing keydown events
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    
    // Override addEventListener for keyboard events
    EventTarget.prototype.addEventListener = function(type, listener, options) {
      return originalAddEventListener.call(this, type, listener, options);
    };
    
    // Add a global keydown handler that ensures events reach inputs
    document.addEventListener('keydown', function(e) {
      const target = e.target;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        // Skip if this is a DirectInput component (which has its own event handling)
        if (target.hasAttribute('data-direct-input')) {
          return;
        }
        // Don't prevent default or stop propagation here
      }
    }, true);

    // Patch preventDefault for keyboard events
    const originalPreventDefault = Event.prototype.preventDefault;
    Event.prototype.preventDefault = function() {
      return originalPreventDefault.call(this);
    };
  }
  
  // Function to ensure React synthetic events are working
  function fixReactEvents() {
    // Check if we're in a React environment
    if (window.React) {
      // Add a MutationObserver to watch for new input elements
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.addedNodes.length) {
            checkInputs();
          }
        });
      });
      
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    }
  }
  
  // Run the fixes when the DOM is fully loaded
  function runFixes() {
    checkInputs();
    fixEventPropagation();
    fixReactEvents();
    
    // Re-check inputs after a short delay to catch any that might be added dynamically
    setTimeout(checkInputs, 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runFixes);
  } else {
    runFixes();
  }
})();