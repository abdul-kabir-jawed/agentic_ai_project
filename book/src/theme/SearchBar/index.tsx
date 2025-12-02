import React, { JSX } from 'react';
import SearchBar from '@easyops-cn/docusaurus-search-local/dist/client/client/theme/SearchBar';
import { useLocalPathname } from '@docusaurus/theme-common/internal';
import { useEffect } from 'react';

export default function SearchBarWrapper(): JSX.Element | null {
  const pathname = useLocalPathname();
  const isAuthPage = pathname === '/signin' || pathname === '/signup';

  useEffect(() => {
    const handleAuthPageKeydown = (event: KeyboardEvent) => {
      // Explicitly check for undefined event.key to prevent the TypeError
      if (event.key === undefined) {
        event.stopPropagation();
        event.preventDefault(); // Prevent default action for problematic keys
      }
      // Unconditionally stop propagation to prevent other search plugin listeners
      event.stopPropagation();
    };

    if (isAuthPage) {
      // Use capture phase to ensure our listener runs before others
      document.addEventListener('keydown', handleAuthPageKeydown, { capture: true });
    } else {
      document.removeEventListener('keydown', handleAuthPageKeydown, { capture: true });
    }

    return () => {
      document.removeEventListener('keydown', handleAuthPageKeydown, { capture: true });
    };
  }, [isAuthPage]);

  if (isAuthPage) {
    return null; // Don't render the search bar component at all
  }

  return <SearchBar />;
}