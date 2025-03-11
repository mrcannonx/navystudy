// This script helps diagnose and fix issues with input fields not accepting typing

(function() {
  // Function to check if inputs are working
  function checkInputs(): void {
    const inputs = document.querySelectorAll('input, textarea');
    
    // Process input elements
    inputs.forEach((element: Element, index: number) => {
      const input = element as HTMLInputElement | HTMLTextAreaElement;
      
      // Check if the input has event listeners (this is a simplified check)
      const inputAny = input as any;
      const hasInputListener = inputAny._events &&
        (inputAny._events.input || inputAny._events.change);
      
      // Ensure the input is not disabled or readonly
      if (input.disabled) {
        input.disabled = false;
      }
      
      if (input.readOnly) {
        input.readOnly = false;
      }
    });
  }
  
  // Function to fix potential issues with event propagation
  function fixEventPropagation(): void {
    // Check if there are any global event listeners capturing keydown events
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    
    // Override addEventListener for keyboard events
    EventTarget.prototype.addEventListener = function(
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | AddEventListenerOptions
    ): void {
      return originalAddEventListener.call(this, type, listener, options);
    };
    
    // Add a global keydown handler that ensures events reach inputs
    document.addEventListener('keydown', function(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        // Don't prevent default or stop propagation here
      }
    }, true);
  }
  
  // Function to ensure React synthetic events are working
  function fixReactEvents(): void {
    // Check if we're in a React environment
    const windowAny = window as any;
    if (windowAny.React && windowAny.React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED) {
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
  function runFixes(): void {
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