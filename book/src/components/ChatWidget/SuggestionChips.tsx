import React from 'react';
import { SuggestionChipsProps } from './types';
import styles from './ChatPanel.module.css';

const SUGGESTIONS = [
  "What is Physical AI?",
  "Explain humanoid robotics",
  "Show me ROS2 examples",
  "How do robots perceive the world?"
];

const SuggestionChips: React.FC<SuggestionChipsProps> = ({ 
  suggestions = SUGGESTIONS, 
  onSelect,
  disabled = false 
}) => {
  return (
    <div className={styles.suggestionChips}>
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          className={styles.suggestionChip}
          onClick={() => onSelect(suggestion)}
          disabled={disabled}
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
};

export default SuggestionChips;
