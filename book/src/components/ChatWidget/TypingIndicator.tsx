import React from 'react';
import styles from './ChatPanel.module.css';

const TypingIndicator: React.FC = () => {
  return (
    <div className={styles.typingIndicator}>
      <div className={styles.typingDot}></div>
      <div className={styles.typingDot}></div>
      <div className={styles.typingDot}></div>
    </div>
  );
};

export default TypingIndicator;
