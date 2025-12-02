import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, BookOpen } from 'lucide-react';
import { useHistory } from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import clsx from 'clsx';

const chapters = [
  { label: 'Chapter 1', path: '/docs/chapter-1-introduction-to-physical-ai' },
  { label: 'Chapter 2', path: '/docs/chapter-2-humanoid-robotics-overview' },
  { label: 'Chapter 3', path: '/docs/chapter-3-humanoid-robotics-sensors-and-actuators' },
  { label: 'Chapter 4', path: '/docs/chapter-4-navigation-and-path-planning' },
  { label: 'Chapter 5', path: '/docs/chapter-5-motion-planning-and-control' },
  { label: 'Chapter 6', path: '/docs/chapter-6-machine-learning-for-robotics' },
  { label: 'Chapter 7', path: '/docs/chapter-7-human-robot-interaction' },
  { label: 'Chapter 8', path: '/docs/chapter-8-advanced-topics-future-directions' },
];

const ChapterDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const history = useHistory();
  const {siteConfig} = useDocusaurusContext();
  const baseUrl = siteConfig.baseUrl;

  useEffect(() => {
    // Set initial selected chapter based on current path
    const currentPath = window.location.pathname;
    const currentChapter = chapters.find(ch => currentPath.includes(ch.path));
    if (currentChapter) {
      setSelectedChapter(currentChapter.label);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (chapter: typeof chapters[0]) => {
    setSelectedChapter(chapter.label);
    setIsOpen(false);
    const normalizedPath = `${baseUrl.replace(/\/$/, '')}${chapter.path}`;
    history.push(normalizedPath);
  };

  return (
    <div className="navbar__chapter-dropdown" ref={dropdownRef}>
      <button
        type="button"
        className="navbar__chapter-dropdown-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <BookOpen size={16} className="navbar__chapter-dropdown-icon" />
        <span className="navbar__chapter-dropdown-text">
          {selectedChapter || 'Select Chapter'}
        </span>
        <ChevronDown 
          size={16} 
          className={clsx('navbar__chapter-dropdown-chevron', isOpen && 'open')} 
        />
      </button>
      
      {isOpen && (
        <div className="navbar__chapter-dropdown-menu">
          {chapters.map((chapter) => (
            <button
              key={chapter.path}
              type="button"
              className={clsx(
                'navbar__chapter-dropdown-item',
                selectedChapter === chapter.label && 'active'
              )}
              onClick={() => handleSelect(chapter)}
            >
              {chapter.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChapterDropdown;

