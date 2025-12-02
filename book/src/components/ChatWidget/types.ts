// TypeScript interfaces for RAG chatbot

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  sources?: Source[];
  timestamp: Date;
}

export interface Source {
  chapter: string;
  section: string;
  url: string;
  excerpt?: string;
}

export interface ChatAPIRequest {
  query: string;
  session_id: string;
  user_id?: string;
  selected_text?: string;
}

export interface ChatAPIResponse {
  response: string;
  sources: Source[];
  session_id: string;
}

export interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  initialMessage?: string;
  shouldAutoSend?: boolean;
}

export interface ChatMessageProps {
  message: Message;
  onSourceClick?: (url: string) => void;
}

export interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
  placeholder?: string;
}

export interface SuggestionChipsProps {
  suggestions?: string[];
  onSelect: (suggestion: string) => void;
  disabled?: boolean;
}
