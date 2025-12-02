import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Message } from '../components/ChatWidget/types';

const STORAGE_KEY = 'rag_chat_history';
const SESSION_KEY = 'rag_chat_session_id';
const MAX_MESSAGES = 50; // Limit to prevent localStorage quota issues

interface UseChatStorageReturn {
  messages: Message[];
  sessionId: string;
  saveMessage: (message: Message) => void;
  clearHistory: () => void;
  loadMessages: () => void;
}

export function useChatStorage(): UseChatStorageReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState<string>('');

  // Initialize session ID
  useEffect(() => {
    const stored = localStorage.getItem(SESSION_KEY);
    if (stored) {
      setSessionId(stored);
    } else {
      const newSessionId = uuidv4();
      localStorage.setItem(SESSION_KEY, newSessionId);
      setSessionId(newSessionId);
    }
  }, []);

  // Load messages from localStorage
  const loadMessages = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert timestamp strings back to Date objects
        const messagesWithDates = parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
        setMessages(messagesWithDates);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  // Load on mount
  useEffect(() => {
    loadMessages();
  }, []);

  // Save message to both state and localStorage
  const saveMessage = (message: Message) => {
    setMessages((prev) => {
      const updated = [...prev, message];
      // Limit to MAX_MESSAGES
      const trimmed = updated.slice(-MAX_MESSAGES);
      
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
      
      return trimmed;
    });
  };

  // Clear all history
  const clearHistory = () => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
    // Generate new session ID
    const newSessionId = uuidv4();
    localStorage.setItem(SESSION_KEY, newSessionId);
    setSessionId(newSessionId);
  };

  return {
    messages,
    sessionId,
    saveMessage,
    clearHistory,
    loadMessages,
  };
}
