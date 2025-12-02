import React from 'react';
import ReactDOM from 'react-dom/client';
import ChapterDropdown from '@site/src/components/ChapterDropdown';

// Initialize chapter dropdown when DOM is ready
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('chapter-dropdown-container');
    if (container) {
      const root = ReactDOM.createRoot(container);
      root.render(
        <React.StrictMode>
          <ChapterDropdown />
        </React.StrictMode>
      );
    }
  });
}

