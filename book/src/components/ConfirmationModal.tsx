import React from 'react';
import { Sparkles, X } from 'lucide-react';
import styles from './ConfirmationModal.module.css';

interface ConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  onOk?: () => void; // Optional OK button that just saves without opening chat
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  okText?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  onOk,
  title,
  message,
  confirmText = 'Continue to Chat',
  cancelText = 'Cancel',
  okText = 'OK',
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.iconWrapper}>
            <Sparkles className={styles.icon} />
          </div>
          <button
            className={styles.closeButton}
            onClick={onCancel}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className={styles.content}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.message}>{message}</p>
        </div>
        
        <div className={styles.actions}>
          <button
            className={styles.cancelButton}
            onClick={onCancel}
          >
            {cancelText}
          </button>
          {onOk && (
            <button
              className={styles.okButton}
              onClick={onOk}
            >
              {okText}
            </button>
          )}
          <button
            className={styles.confirmButton}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;

