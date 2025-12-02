import React, { KeyboardEvent } from 'react';
import { Send } from 'lucide-react';
import { ChatInputProps } from './types';
import styles from './ChatPanel.module.css';

const ChatInput: React.FC<ChatInputProps> = ({ 
  value, 
  onChange, 
  onSend, 
  isLoading,
  placeholder = "Ask about Physical AI & Robotics..." 
}) => {
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !isLoading) {
        onSend();
      }
    }
  };

  return (
    <div className={styles.inputContainer}>
      <textarea
        className={styles.input}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={isLoading}
        rows={1}
      />
      <button
        className={styles.sendButton}
        onClick={onSend}
        disabled={!value.trim() || isLoading}
        aria-label="Send message"
      >
        <Send className={styles.sendIcon} />
      </button>
    </div>
  );
};

export default ChatInput;
