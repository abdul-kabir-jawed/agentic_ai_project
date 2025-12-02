import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { Languages } from 'lucide-react';
import { useAuth } from '@site/src/contexts/AuthContext';
import ConfirmationModal from './ConfirmationModal';

const API_BASE_URL =
  (typeof window !== 'undefined' && (window as any).__API_BASE_URL) ||
  'https://panaversity-robotics-hackathon.vercel.app';

const LANGUAGES = [
  { code: 'english', label: 'English', apiCode: 'english' },
  { code: 'urdu', label: 'اردو', apiCode: 'urdu' },
  { code: 'spanish', label: 'Español', apiCode: 'spanish' },
  { code: 'chinese', label: '中文', apiCode: 'chinese' },
  { code: 'arabic', label: 'العربية', apiCode: 'arabic' },
];

const TranslationSwitcherButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState('english');
  const [isUpdating, setIsUpdating] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [pendingOkAction, setPendingOkAction] = useState<(() => void) | null>(null);
  const { user, session } = useAuth();
  
  // Get current document title from page
  const [currentDocTitle, setCurrentDocTitle] = useState<string | null>(null);
  
  useEffect(() => {
    // Get title from page h1 or document title
    if (typeof document !== 'undefined') {
      const titleEl = document.querySelector('article h1, h1');
      setCurrentDocTitle(titleEl?.textContent?.trim() || null);
    }
  }, []);

  // Load user's language preference on mount
  useEffect(() => {
    const loadUserLanguage = async () => {
      if (!user || !session) return;
      
      try {
        const response = await fetch(`${API_BASE_URL}/api/personalization?user_id=${user.id}`, {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.language) {
            setActiveLanguage(data.language);
          }
        }
      } catch (error) {
        console.error('Error loading user language:', error);
      }
    };
    
    loadUserLanguage();
  }, [user, session]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.translation-switcher-button-wrapper')) {
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

  const handleLanguageSelect = (code: string) => {
    if (!user || !session) {
      alert('Please sign in to change language');
      return;
    }

    if (code === activeLanguage) {
      setIsOpen(false);
      return; // Already selected
    }

    const languageName = LANGUAGES.find(l => l.code === code)?.label || code;
    
    // Create action that opens chat
    setPendingAction(() => async () => {
      setIsOpen(false);
      setIsUpdating(true);
      
      try {
        // Call API to update language
        const response = await fetch(`${API_BASE_URL}/api/personalization?user_id=${user.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ language: code }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.detail || 'Failed to update language');
        }

    setActiveLanguage(code);
        
        // Open chatbox and auto-send message
        if (typeof window !== 'undefined' && (window as any).__openChatWithMessageAndAutoSend) {
          let message = '';
          if (currentDocTitle) {
            message = `Please explain "${currentDocTitle}" in ${languageName}.`;
          } else {
            message = `Please explain the current page in ${languageName}.`;
          }
          
          (window as any).__openChatWithMessageAndAutoSend(message);
        }
      } catch (error) {
        console.error('Error updating language:', error);
        alert('Failed to update language. Please try again.');
      } finally {
        setIsUpdating(false);
        setShowConfirmation(false);
        setPendingAction(null);
        setPendingOkAction(null);
      }
    });

    // Create action that just saves (OK button)
    setPendingOkAction(() => async () => {
    setIsOpen(false);
      setIsUpdating(true);
      
      try {
        const response = await fetch(`${API_BASE_URL}/api/personalization?user_id=${user.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ language: code }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.detail || 'Failed to update language');
        }

        setActiveLanguage(code);
      } catch (error) {
        console.error('Error updating language:', error);
        alert('Failed to update language. Please try again.');
      } finally {
        setIsUpdating(false);
        setShowConfirmation(false);
        setPendingAction(null);
        setPendingOkAction(null);
      }
    });
    
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    if (pendingAction) {
      pendingAction();
    }
  };

  const handleOk = () => {
    if (pendingOkAction) {
      pendingOkAction();
    }
  };

  const handleCancel = () => {
    setShowConfirmation(false);
    setPendingAction(null);
    setPendingOkAction(null);
  };

  const currentLang = LANGUAGES.find(lang => lang.code === activeLanguage) || LANGUAGES[0];

  return (
    <>
    <div className="translation-switcher-button-wrapper" style={{ position: 'relative' }}>
      <button
        type="button"
        className="translation-switcher-button"
        onClick={() => setIsOpen(!isOpen)}
          disabled={isUpdating}
      >
        <Languages size={16} className="translation-switcher-button__icon" />
          <span>{currentLang.code.toUpperCase().slice(0, 2)}</span>
        <span className="translation-switcher-button__label">{currentLang.label}</span>
      </button>
      
      {isOpen && (
        <>
          <div 
            className="translation-switcher-button__backdrop"
            onClick={() => setIsOpen(false)}
          />
          <div className="translation-switcher-button__dropdown">
            {LANGUAGES.map(({ code, label }) => (
              <button
                key={code}
                type="button"
                className={clsx(
                  'translation-switcher-button__option',
                  activeLanguage === code && 'translation-switcher-button__option--active'
                )}
                onClick={() => handleLanguageSelect(code)}
                  disabled={isUpdating}
              >
                  <span className="translation-switcher-button__code">{code.toUpperCase().slice(0, 2)}</span>
                <span>{label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
      
      <ConfirmationModal
        isOpen={showConfirmation}
        onConfirm={handleConfirm}
        onOk={handleOk}
        onCancel={handleCancel}
        title="Language Changed"
        message="These effects will take effect in the chat. The AI will now respond in your selected language. The document will remain unchanged."
        confirmText="Continue to Chat"
        cancelText="Cancel"
        okText="OK"
      />
    </>
  );
};

export default TranslationSwitcherButton;
