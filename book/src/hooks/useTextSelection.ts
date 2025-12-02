
import { useState, useEffect } from 'react';

interface TextSelectionState {
  text: string;
  range: Range | null;
  rect: DOMRect | null;
}

export function useTextSelection(): TextSelectionState {
  const [selectionState, setSelectionState] = useState<TextSelectionState>({
    text: '',
    range: null,
    rect: null,
  });

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) {
        setSelectionState({ text: '', range: null, rect: null });
        return;
      }

      const range = selection.getRangeAt(0);
      const text = selection.toString();
      const rect = text.length > 0 ? range.getBoundingClientRect() : null;

      setSelectionState({ text, range, rect });
    };

    document.addEventListener('selectionchange', handleSelectionChange);

    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, []);

  return selectionState;
}
