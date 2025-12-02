import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

const SidebarToggle: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    // Check localStorage for saved state
    const savedState = localStorage.getItem('sidebar-collapsed');
    if (savedState === 'true') {
      setIsCollapsed(true);
      document.documentElement.setAttribute('data-sidebar-collapsed', 'true');
    }
  }, []);

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    document.documentElement.setAttribute('data-sidebar-collapsed', newState.toString());
    localStorage.setItem('sidebar-collapsed', newState.toString());
  };

  return (
    <button
      type="button"
      className="sidebar-toggle-button"
      onClick={toggleSidebar}
      aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
    >
      {isCollapsed ? (
        <ChevronRight size={18} />
      ) : (
        <ChevronLeft size={18} />
      )}
    </button>
  );
};

export default SidebarToggle;

