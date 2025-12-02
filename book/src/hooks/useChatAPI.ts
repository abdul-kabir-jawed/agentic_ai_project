import { useState } from 'react';
import { ChatAPIRequest, ChatAPIResponse, Message } from '../components/ChatWidget/types';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '../contexts/AuthContext';

// API configuration - use global override, detect localhost, otherwise Vercel
const getApiBaseUrl = () => {
  if (typeof window === 'undefined') {
    return 'https://panaversity-robotics-hackathon.vercel.app';
  }
  if ((window as any).__API_BASE_URL) {
    return (window as any).__API_BASE_URL;
  }
  const isLocalhost = 
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname === '';
  if (isLocalhost) {
    return 'http://localhost:8000';
  }
  return 'https://panaversity-robotics-hackathon.vercel.app';
};
const API_BASE_URL = getApiBaseUrl();
const API_ENDPOINT = `${API_BASE_URL}/api/chat`;

interface UseChatAPIReturn {
  sendMessage: (query: string, sessionId: string, selectedText?: string, userId?: string) => Promise<Message | null>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

export function useChatAPI(): UseChatAPIReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { session } = useAuth();

  const clearError = () => setError(null);

  const sendMessage = async (
    query: string,
    sessionId: string,
    selectedText?: string,
    userId?: string
  ): Promise<Message | null> => {
    setIsLoading(true);
    setError(null);

    const requestBody: ChatAPIRequest = {
      query,
      session_id: sessionId,
      selected_text: selectedText,
      user_id: userId,
    };

    // Get auth token from session
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`;
    }

    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Too many requests. Please wait a moment and try again.');
        } else if (response.status >= 500) {
          throw new Error('Service temporarily unavailable. Please try again later.');
        } else {
          throw new Error(`Request failed: ${response.statusText}`);
        }
      }

      const data: ChatAPIResponse = await response.json();

      // Create Message object from API response
      const message: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: data.response,
        sources: data.sources,
        timestamp: new Date(),
      };

      setIsLoading(false);
      return message;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      setIsLoading(false);
      return null;
    }
  };

  return {
    sendMessage,
    isLoading,
    error,
    clearError,
  };
}
