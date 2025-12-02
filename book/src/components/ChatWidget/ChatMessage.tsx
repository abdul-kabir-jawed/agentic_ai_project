import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ExternalLink, Bot, User } from 'lucide-react';
import { ChatMessageProps } from './types';
import styles from './ChatPanel.module.css';

const ChatMessage: React.FC<ChatMessageProps> = ({ message, onSourceClick }) => {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  return (
    <div className={`${styles.message} ${isUser ? styles.userMessage : styles.botMessage}`}>
      {!isUser && !isSystem && (
        <div className={styles.messageAvatar}>
          <Bot className={styles.avatarIcon} />
        </div>
      )}
      
      <div className={styles.messageContent}>
        {isSystem ? (
          <div className={styles.systemMessage}>{message.content}</div>
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code: ({ className, children, ...props }: any) => {
                const match = /language-(\w+)/.exec(className || '');
                const isInline = !match;
                return isInline ? (
                  <code className={styles.inlineCode} {...props}>
                    {children}
                  </code>
                ) : (
                  <pre className={styles.codeBlock}>
                    <code className={className} {...props}>
                      {children}
                    </code>
                  </pre>
                );
              },
              a: ({ node, children, ...props }) => (
                <a className={styles.messageLink} target="_blank" rel="noopener noreferrer" {...props}>
                  {children}
                </a>
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>
        )}
        
        {message.sources && message.sources.length > 0 && (
          <div className={styles.sources}>
            <div className={styles.sourcesLabel}>Sources:</div>
            {message.sources.map((source, index) => (
              <button
                key={index}
                className={styles.sourceChip}
                onClick={() => onSourceClick?.(source.url)}
              >
                <ExternalLink className={styles.sourceIcon} />
                <span className={styles.sourceText}>
                  {source.chapter} - {source.section}
                </span>
              </button>
            ))}
          </div>
        )}
        
        <div className={styles.messageTime}>
          {new Date(message.timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      </div>
      
      {isUser && (
        <div className={styles.messageAvatar}>
          <User className={styles.avatarIcon} />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
