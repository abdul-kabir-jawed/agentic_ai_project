import React, { useState, useRef, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '@site/src/contexts/AuthContext';
import ConfirmationModal from './ConfirmationModal';

const API_BASE_URL =
  (typeof window !== 'undefined' && (window as any).__API_BASE_URL) ||
  'https://panaversity-robotics-hackathon.vercel.app';

const TECHNICAL_OPTIONS = [
  { code: 'technical', label: 'Technical' },
  { code: 'non-technical', label: 'Non-Technical' },
];

const EXPERIENCE_LEVELS = [
  { code: 'beginner', label: 'Beginner' },
  { code: 'intermediate', label: 'Intermediate' },
  { code: 'advanced', label: 'Advanced' },
];

const PersonalizationControls: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [technicalLevel, setTechnicalLevel] = useState<string | null>(null);
  const [experienceLevel, setExperienceLevel] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [pendingOkAction, setPendingOkAction] = useState<(() => void) | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
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

  // Load user's current personalization
  useEffect(() => {
    const loadPersonalization = async () => {
      if (!user || !session) return;
      
      try {
        const response = await fetch(`${API_BASE_URL}/api/personalization?user_id=${user.id}`, {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.is_technical !== undefined) {
            setTechnicalLevel(data.is_technical ? 'technical' : 'non-technical');
          }
          if (data.experience_level) {
            setExperienceLevel(data.experience_level);
          }
        }
      } catch (error) {
        console.error('Error loading personalization:', error);
      }
    };
    
    loadPersonalization();
  }, [user, session]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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

  const handleTechnicalSelect = (code: string) => {
    setTechnicalLevel(code);
    // If non-technical is selected, we can proceed directly
    if (code === 'non-technical') {
      // Create action that opens chat
      setPendingAction(() => async () => {
        setIsOpen(false);
        setIsUpdating(true);
        
        try {
          const updatePayload = {
            is_technical: false,
            experience_level: null, // Clear experience level for non-technical
          };

          const response = await fetch(`${API_BASE_URL}/api/personalization?user_id=${user.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session.access_token}`,
            },
            body: JSON.stringify(updatePayload),
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || 'Failed to update personalization');
          }

          setExperienceLevel(null);
          
          // Open chatbox and auto-send message
          if (typeof window !== 'undefined' && (window as any).__openChatWithMessageAndAutoSend) {
            let message = '';
            if (currentDocTitle) {
              message = `Please explain "${currentDocTitle}" in a non-technical way.`;
            } else {
              message = `Please explain the current page in a non-technical way.`;
            }
            
            (window as any).__openChatWithMessageAndAutoSend(message);
          }
        } catch (error) {
          console.error('Error updating personalization:', error);
          alert('Failed to update personalization. Please try again.');
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
          const updatePayload = {
            is_technical: false,
            experience_level: null,
          };

          const response = await fetch(`${API_BASE_URL}/api/personalization?user_id=${user.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session.access_token}`,
            },
            body: JSON.stringify(updatePayload),
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || 'Failed to update personalization');
          }

          setExperienceLevel(null);
        } catch (error) {
          console.error('Error updating personalization:', error);
          alert('Failed to update personalization. Please try again.');
        } finally {
          setIsUpdating(false);
          setShowConfirmation(false);
          setPendingAction(null);
          setPendingOkAction(null);
        }
      });
      
      setShowConfirmation(true);
    }
    // If technical is selected, experience level options will show
  };

  const handleExperienceSelect = async (code: string) => {
    if (!user || !session) {
      alert('Please sign in to update personalization');
      return;
    }

    const expLevel = code.toLowerCase();
    const levelLabel = EXPERIENCE_LEVELS.find(e => e.code === expLevel)?.label || expLevel;
    
    // Create action that opens chat
    setPendingAction(() => async () => {
      setIsOpen(false);
      setIsUpdating(true);
      
      try {
        // Prepare update payload
        const updatePayload = {
          is_technical: true,
          experience_level: expLevel,
        };

        // Call API to update personalization
        const response = await fetch(`${API_BASE_URL}/api/personalization?user_id=${user.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify(updatePayload),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.detail || 'Failed to update personalization');
        }

        // Update local state
        setExperienceLevel(code);
        
        // Open chatbox and auto-send message
        if (typeof window !== 'undefined' && (window as any).__openChatWithMessageAndAutoSend) {
          let message = '';
          if (currentDocTitle) {
            message = `Please explain "${currentDocTitle}" adapted to my ${levelLabel} technical level.`;
          } else {
            message = `Please explain the current page adapted to my ${levelLabel} technical level.`;
          }
          
          (window as any).__openChatWithMessageAndAutoSend(message);
        }
      } catch (error) {
        console.error('Error updating personalization:', error);
        alert('Failed to update personalization. Please try again.');
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
        const updatePayload = {
          is_technical: true,
          experience_level: expLevel,
        };

        const response = await fetch(`${API_BASE_URL}/api/personalization?user_id=${user.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify(updatePayload),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.detail || 'Failed to update personalization');
        }

        setExperienceLevel(code);
      } catch (error) {
        console.error('Error updating personalization:', error);
        alert('Failed to update personalization. Please try again.');
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

  const getDisplayText = () => {
    if (technicalLevel === 'non-technical') {
      return 'Non-Technical';
    } else if (technicalLevel === 'technical' && experienceLevel) {
      return `${EXPERIENCE_LEVELS.find(e => e.code === experienceLevel)?.label || experienceLevel}`;
    } else if (technicalLevel === 'technical') {
      return 'Technical';
    }
    return 'Personalize';
  };

  return (
    <div className="personalization-button-wrapper" ref={dropdownRef} style={{ position: 'relative' }}>
      <button
        type="button"
        className="personalization-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Sparkles size={16} className="personalization-button__icon" />
        <span>{getDisplayText()}</span>
      </button>
      
      {isOpen && (
        <>
          <div 
            className="personalization-button__backdrop"
            onClick={() => setIsOpen(false)}
          />
          <div className="personalization-button__dropdown">
            {!technicalLevel || technicalLevel === 'non-technical' ? (
              // Step 1: Select Technical or Non-Technical
              <div className="personalization-button__section">
                <h4 className="personalization-button__section-title">Technical Level</h4>
                <div className="personalization-button__options">
                  {TECHNICAL_OPTIONS.map(({ code, label }) => (
                    <button
                      key={code}
                      type="button"
                      className={clsx(
                        'personalization-button__option',
                        technicalLevel === code && 'personalization-button__option--active'
                      )}
                      onClick={() => handleTechnicalSelect(code)}
                      disabled={isUpdating}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              // Step 2: If Technical selected, show Experience Levels
              <div className="personalization-button__section">
                <div className="personalization-button__header">
                  <button
                    type="button"
                    className="personalization-button__back"
                    onClick={() => setTechnicalLevel(null)}
                  >
                    ← Back
                  </button>
                  <h4 className="personalization-button__section-title">Experience Level</h4>
                </div>
                <div className="personalization-button__options">
                  {EXPERIENCE_LEVELS.map(({ code, label }) => (
                    <button
                      key={code}
                      type="button"
                      className={clsx(
                        'personalization-button__option',
                        experienceLevel === code && 'personalization-button__option--active'
                      )}
                      onClick={() => handleExperienceSelect(code)}
                      disabled={isUpdating}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}
      
      <ConfirmationModal
        isOpen={showConfirmation}
        onConfirm={handleConfirm}
        onOk={handleOk}
        onCancel={handleCancel}
        title="Personalization Updated"
        message="These effects will take effect in the chat. The AI will now explain content according to your selected personalization."
        confirmText="Continue to Chat"
        cancelText="Cancel"
        okText="OK"
      />
    </div>
  );
};

export default PersonalizationControls;
