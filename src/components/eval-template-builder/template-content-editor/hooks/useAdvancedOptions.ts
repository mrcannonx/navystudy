import { useState, useEffect, useCallback } from 'react';

export function useAdvancedOptions() {
  // State for including advanced options in PDF
  const [includeAdvancedOptions, setIncludeAdvancedOptions] = useState<boolean>(false);
  
  // Function to toggle advanced options
  const toggleAdvancedOptions = useCallback(() => {
    setIncludeAdvancedOptions(prev => !prev);
  }, []);
  
  // Add keyboard event listener for the toggle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If user presses 'a' key while holding Alt
      if (e.altKey && e.key === 'a') {
        toggleAdvancedOptions();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [toggleAdvancedOptions]);
  
  return {
    includeAdvancedOptions,
    toggleAdvancedOptions
  };
}