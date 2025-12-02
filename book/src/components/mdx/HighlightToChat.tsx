import React, { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@site/src/components/ui/button';
import { MessageSquare } from 'lucide-react';
import { useTextSelection } from '@site/src/hooks/useTextSelection';

interface HighlightToChatProps {
  onAskAI?: (text: string) => void;
}

const HighlightToChat: React.FC<HighlightToChatProps> = ({ onAskAI }) => {
  const { text, rect, range } = useTextSelection();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isValidSelection, setIsValidSelection] = useState(false);

  // Check if selection is within article/doc content only
  useEffect(() => {
    if (!text || !range || text.length < 3) {
      setIsValidSelection(false);
      return;
    }

    // Find the article element (main doc content)
    const articleElement = document.querySelector('article');
    
    if (!articleElement) {
      setIsValidSelection(false);
      return;
    }

    // Get the selection range
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      setIsValidSelection(false);
      return;
    }

    const selectedRange = selection.getRangeAt(0);
    const commonAncestor = selectedRange.commonAncestorContainer;
    
    // Get the actual element (handle text nodes)
    let element: Element | null = null;
    if (commonAncestor.nodeType === Node.TEXT_NODE) {
      element = commonAncestor.parentElement;
    } else if (commonAncestor.nodeType === Node.ELEMENT_NODE) {
      element = commonAncestor as Element;
    }

    if (!element) {
      setIsValidSelection(false);
      return;
    }

    // Check if the element is within the article
    const isWithinArticle = articleElement.contains(element);
    
    // Also exclude navigation, headers, footers, and controls
    const isExcluded = element.closest('nav, header, footer, .navbar, .docs-controls-bar, .personalization-button-wrapper, .translation-switcher-button-wrapper');
    
    setIsValidSelection(isWithinArticle && !isExcluded);
  }, [text, range]);

  const handleAskAIClick = () => {
    if (text && isValidSelection) {
      // Call global function exposed by ChatLauncher with auto-send
      if (typeof window !== 'undefined' && (window as any).__openChatWithMessageAndAutoSend) {
        (window as any).__openChatWithMessageAndAutoSend(`Explain this: "${text}"`);
      }
      
      // Also call the prop callback if provided (for backwards compatibility)
      onAskAI?.(text);
      
      // Clear selection after opening chat
      window.getSelection()?.removeAllRanges();
    }
  };

  if (!text || !rect || !isValidSelection) {
    return null;
  }

  // Calculate button position (adjust as needed)
  const buttonStyle: React.CSSProperties = {
    position: 'absolute',
    top: rect.top + window.scrollY - 45, // Above the selection
    left: rect.left + window.scrollX + rect.width / 2 - 50,
    zIndex: 10000, // Ensure it's above other content
  };

  return createPortal(
    <Button
      ref={buttonRef}
      onClick={handleAskAIClick}
      className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all duration-300"
      style={buttonStyle}
    >
      <MessageSquare className="h-4 w-4" />
      <span className="font-medium">Ask AI</span>
    </Button>,
    document.body
  );
};

export default HighlightToChat;
