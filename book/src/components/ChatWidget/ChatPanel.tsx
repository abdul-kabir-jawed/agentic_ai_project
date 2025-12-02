import React, { useState, useEffect, useRef } from 'react';
import { X, Minimize2, Maximize2, Trash2, Bot } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import SuggestionChips from './SuggestionChips';
import TypingIndicator from './TypingIndicator';
import { ChatPanelProps, Message } from './types';
import { useChatAPI } from '@site/src/hooks/useChatAPI';
import { useChatStorage } from '@site/src/hooks/useChatStorage';
import { useAuth } from '@site/src/contexts/AuthContext';
import styles from './ChatPanel.module.css';

const WELCOME_MESSAGE: Message = {
  id: 'welcome',
  role: 'system',
  content: 'Welcome to the Physical AI & Robotics AI Tutor! Ask me anything about the textbook content.',
  timestamp: new Date(),
};

const ChatPanel: React.FC<ChatPanelProps> = ({ isOpen, onClose, initialMessage, shouldAutoSend = false }) => {
  const [inputValue, setInputValue] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { sendMessage: sendToAPI, isLoading, error, clearError } = useChatAPI();
  const { messages, sessionId, saveMessage, clearHistory, loadMessages } = useChatStorage();
  const { user } = useAuth();
  const welcomeMessageAddedRef = React.useRef(false);

  // Initialize with welcome message only once when chat is first opened and no messages exist
  useEffect(() => {
    if (isOpen) {
      // Wait a bit for messages to load from localStorage
      const timer = setTimeout(() => {
        // Check if there are any messages (including welcome message)
        const hasWelcomeMessage = messages.some(msg => msg.id === 'welcome');
        const hasAnyMessages = messages.length > 0;
        
        // Only add welcome message if there are no messages at all and we haven't added it yet
        if (!hasAnyMessages && !hasWelcomeMessage && !welcomeMessageAddedRef.current) {
          saveMessage(WELCOME_MESSAGE);
          welcomeMessageAddedRef.current = true;
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isOpen, messages, saveMessage]);

  // Set initial message if provided (from text selection)
  useEffect(() => {
    if (initialMessage) {
      setInputValue(initialMessage);
    }
  }, [initialMessage]);

  const handleSendMessage = async (messageText: string) => {
    if (!messageText || isLoading) return;

    // Create user message
    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    // Save user message and clear input
    saveMessage(userMessage);
    setInputValue('');
    clearError();

    // Send to API with user_id if available
    const userId = user?.id || undefined;
    const botResponse = await sendToAPI(messageText, sessionId, undefined, userId);

    if (botResponse) {
      saveMessage(botResponse);
    }
  };

  // Auto-send message when chat opens with initialMessage and shouldAutoSend is true
  const hasAutoSentRef = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (isOpen && initialMessage && shouldAutoSend && hasAutoSentRef.current !== initialMessage && !isLoading) {
      // Small delay to ensure chat is fully rendered
      const timer = setTimeout(async () => {
        hasAutoSentRef.current = initialMessage;
        // Trigger send automatically
        const trimmedInput = initialMessage.trim();
        if (trimmedInput) {
          // Create user message
          const userMessage: Message = {
            id: uuidv4(),
            role: 'user',
            content: trimmedInput,
            timestamp: new Date(),
          };

          // Save user message and clear input
          saveMessage(userMessage);
          setInputValue('');
          clearError();

          // Send to API with user_id if available
          const userId = user?.id || undefined;
          const botResponse = await sendToAPI(trimmedInput, sessionId, undefined, userId);

          if (botResponse) {
            saveMessage(botResponse);
          }
        }
      }, 500);
      return () => clearTimeout(timer);
    }
    
    // Reset when chat closes
    if (!isOpen) {
      hasAutoSentRef.current = undefined;
    }
  }, [isOpen, initialMessage, shouldAutoSend, isLoading, saveMessage, sendToAPI, sessionId, user, clearError]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async () => {
    const trimmedInput = inputValue.trim();
    if (!trimmedInput || isLoading) return;
    await handleSendMessage(trimmedInput);
  };

  const handleSuggestionSelect = (suggestion: string) => {
    setInputValue(suggestion);
  };

  const handleSourceClick = (url: string) => {
    // Navigate to the chapter
    if (typeof window !== 'undefined') {
      window.location.href = url;
    }
  };

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear chat history?')) {
      clearHistory();
      welcomeMessageAddedRef.current = false; // Reset so welcome message can show again
      // Welcome message will be added by the useEffect
      setTimeout(() => {
        saveMessage(WELCOME_MESSAGE);
        welcomeMessageAddedRef.current = true;
      }, 100);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`${styles.chatWindow} ${isMinimized ? styles.minimized : ''}`}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Bot className={styles.headerIcon} />
          <div className={styles.headerTitle}>
            <span className={styles.titleText}>AI Tutor</span>
            <span className={styles.subtitle}>Physical AI & Robotics</span>
          </div>
        </div>
        <div className={styles.headerActions}>
          <button
            className={styles.headerButton}
            onClick={handleClearHistory}
            aria-label="Clear history"
            title="Clear history"
          >
            <Trash2 className={styles.headerButtonIcon} />
          </button>
          <button
            className={styles.headerButton}
            onClick={() => setIsMinimized(!isMinimized)}
            aria-label={isMinimized ? 'Maximize' : 'Minimize'}
          >
            {isMinimized ? (
              <Maximize2 className={styles.headerButtonIcon} />
            ) : (
              <Minimize2 className={styles.headerButtonIcon} />
            )}
          </button>
          <button
            className={styles.headerButton}
            onClick={onClose}
            aria-label="Close chat"
          >
            <X className={styles.headerButtonIcon} />
          </button>
        </div>
      </div>

      {/* Main Content (hidden when minimized) */}
      {!isMinimized && (
        <>
          {/* Messages Area */}
          <div className={styles.messagesContainer}>
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                onSourceClick={handleSourceClick}
              />
            ))}
            {isLoading && (
              <div className={styles.botMessage}>
                <div className={styles.messageAvatar}>
                  <Bot className={styles.avatarIcon} />
                </div>
                <TypingIndicator />
              </div>
            )}
            {error && (
              <div className={styles.errorMessage}>
                <span className={styles.errorText}>{error}</span>
                <button className={styles.retryButton} onClick={handleSend}>
                  Retry
                </button>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestion Chips */}
          {messages.length <= 1 && !isLoading && (
            <SuggestionChips onSelect={handleSuggestionSelect} />
          )}

          {/* Input Area */}
          <div className={styles.inputArea}>
            <ChatInput
              value={inputValue}
              onChange={setInputValue}
              onSend={handleSend}
              isLoading={isLoading}
            />
          </div>

          {/* Footer Attribution */}
          <div className={styles.footer}>
            <span className={styles.footerText}>
              Powered by OpenAI | Answers from textbook content
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatPanel;
