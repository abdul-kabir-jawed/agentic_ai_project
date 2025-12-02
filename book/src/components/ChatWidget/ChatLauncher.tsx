import React, { useState, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import { Button } from '@site/src/components/ui/button';
import ChatPanel from './ChatPanel';
import { useAuth } from '@site/src/contexts/AuthContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './ChatLauncher.module.css';

const ChatLauncher: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [initialMessage, setInitialMessage] = useState<string | undefined>(undefined);
  const [shouldAutoSend, setShouldAutoSend] = useState(false);
  const { session, checkSession, loading } = useAuth();
  const signinUrl = useBaseUrl('/signin');

  const toggleChat = async () => {
    // Check session before opening chat
    if (!isChatOpen) {
      const hasSession = await checkSession();
      if (!hasSession) {
        // Redirect to signin page if no session
        window.location.href = signinUrl;
        return;
      }
    }
    
    setIsChatOpen(!isChatOpen);
    // Clear initial message when closing
    if (isChatOpen) {
      setInitialMessage(undefined);
      setShouldAutoSend(false);
    }
  };

  const openChatWithMessage = async (message: string) => {
    // Check session before opening chat with message
    const hasSession = await checkSession();
    if (!hasSession) {
      // Redirect to signin page if no session
      window.location.href = signinUrl;
      return;
    }
    
    setInitialMessage(message);
    setIsChatOpen(true);
  };

  const openChatWithMessageAndAutoSend = async (message: string) => {
    // Check session before opening chat with message
    const hasSession = await checkSession();
    if (!hasSession) {
      // Redirect to signin page if no session
      window.location.href = signinUrl;
      return;
    }
    
    setInitialMessage(message);
    setShouldAutoSend(true);
    setIsChatOpen(true);
  };

  // Expose functions globally
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).__openChatWithMessage = openChatWithMessage;
      (window as any).__openChatWithMessageAndAutoSend = openChatWithMessageAndAutoSend;
    }
    return () => {
      if (typeof window !== 'undefined') {
        delete (window as any).__openChatWithMessage;
        delete (window as any).__openChatWithMessageAndAutoSend;
      }
    };
  }, []);

  return (
    <>
      {!isChatOpen && (
        <div className={styles.floatingButton}>
          <Button
            variant="default"
            size="icon"
            className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={toggleChat}
            aria-label="Open AI chat"
          >
            <MessageSquare className="h-7 w-7" />
          </Button>
        </div>
      )}
      <ChatPanel
        isOpen={isChatOpen}
        onClose={toggleChat}
        initialMessage={initialMessage}
        shouldAutoSend={shouldAutoSend}
      />
    </>
  );
};

export default ChatLauncher;
