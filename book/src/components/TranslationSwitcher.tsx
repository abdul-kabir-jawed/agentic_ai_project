import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { Languages, Sparkles } from 'lucide-react';
import { useAuth } from '@site/src/contexts/AuthContext';
import ConfirmationModal from './ConfirmationModal';

const API_BASE_URL = typeof window !== 'undefined' && (window as any).__API_BASE_URL 
  ? (window as any).__API_BASE_URL 
  : 'http://localhost:8000';

const LANGUAGES = [
  { code: 'english', label: 'English', apiCode: 'english' },
  { code: 'urdu', label: 'اردو', apiCode: 'urdu' },
  { code: 'spanish', label: 'Español', apiCode: 'spanish' },
  { code: 'chinese', label: '中文', apiCode: 'chinese' },
  { code: 'arabic', label: 'العربية', apiCode: 'arabic' },
];

const TranslationSwitcher: React.FC = () => {
  const [activeLanguage, setActiveLanguage] = useState('english');
  const [isUpdating, setIsUpdating] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
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

  const handleLanguageSelect = (code: string) => {
    if (!user || !session) {
      alert('Please sign in to change language');
      return;
    }

    if (code === activeLanguage) {
      return; // Already selected
    }

    const languageName = LANGUAGES.find(l => l.code === code)?.label || code;
    
    // Show confirmation modal
    setPendingAction(() => async () => {
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
      }
    });
    
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    if (pendingAction) {
      pendingAction();
    }
  };

  const handleCancel = () => {
    setShowConfirmation(false);
    setPendingAction(null);
  };

  return (
    <div className="translation-switcher">
      <div className="translation-switcher-card glass-panel">
        <div className="flex items-center justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-300/80">
              Localization
            </p>
            <p className="mt-1 text-lg font-semibold text-white">Pick your language</p>
            <p className="text-sm text-slate-400">
              Contributor-powered translations with human-in-the-loop review.
            </p>
          </div>
          <span className="translation-switcher-badge">
            <Sparkles size={14} />
            Beta
          </span>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          {LANGUAGES.map(({ code, label }) => (
            <button
              key={code}
              type="button"
              onClick={() => handleLanguageSelect(code)}
              disabled={isUpdating}
              className={clsx(
                'translation-pill',
                activeLanguage === code && 'translation-pill--active',
                isUpdating && 'opacity-50 cursor-not-allowed'
              )}
            >
              <span className="text-xs font-mono tracking-[0.3em]">{code.toUpperCase().slice(0, 2)}</span>
              <span className="text-sm font-semibold">{label}</span>
            </button>
          ))}
        </div>

        <button
          type="button"
          className="translation-cta"
          onClick={() => alert('Crowdsourced localization dashboard coming soon!')}
        >
          <Languages className="h-4 w-4" />
          Become a translator
        </button>
      </div>
      
      <ConfirmationModal
        isOpen={showConfirmation}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        title="Language Changed"
        message="These effects will take effect in the chat. The AI will now respond in your selected language."
        confirmText="Continue to Chat"
        cancelText="Cancel"
      />
    </div>
  );
};

export default TranslationSwitcher;