import { useEffect } from 'react';

export const useStyledAutocomplete = () => {
  useEffect(() => {
    // Apply custom styles to the Google Places Autocomplete dropdown
    const customizeAutocompleteStyles = () => {
      // This targets the Google Places Autocomplete dropdown container
      const style = document.createElement('style');
      style.textContent = `
            /* Main container for suggestions */
            .pac-container {
              background-color: #1f2937 !important; /* bg-gray-800 */
              border: 1px solid #374151 !important; /* border-gray-700 */
              border-radius: 0.375rem !important;
              box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
              margin-top: 4px !important;
              font-family: inherit !important;
              z-index: 9999 !important;
            }
            
            /* Individual suggestion items */
            .pac-item {
              padding: 8px 12px !important;
              color: #f9fafb !important; /* text-white */
              border-top: 1px solid #374151 !important; /* border-gray-700 */
              cursor: pointer !important;
            }
            
            /* Hover state for suggestion items */
            .pac-item:hover {
              background-color: #374151 !important; /* hover:bg-gray-700 */
            }
            
            /* Matched text in suggestions */
            .pac-item-query {
              color: #f9fafb !important; /* text-white */
              font-size: 0.875rem !important;
            }
            
            /* Matched text in suggestions (part 2) */
            .pac-matched {
              color: #60a5fa !important; /* text-blue-400 */
            }
            
            /* Secondary text in suggestions */
            .pac-item > span:not(.pac-item-query) {
              color: #9ca3af !important; /* text-gray-400 */
              font-size: 0.75rem !important;
            }
            
            /* Google attribution */
            .pac-logo:after {
              background-color: #1f2937 !important; /* bg-gray-800 */
              padding: 6px !important;
              height: auto !important;
            }
          `;
      document.head.appendChild(style);
    };

    // Apply the styles after a short delay to ensure the DOM is ready
    setTimeout(customizeAutocompleteStyles, 300);

    return () => {
      // Clean up added styles on component unmount
      document.querySelectorAll('style').forEach((style) => {
        if (style.textContent?.includes('.pac-container')) {
          style.remove();
        }
      });
    };
  }, []);
};
