import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';

interface GlowButtonProps {
  to?: string;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const GlowButton: React.FC<GlowButtonProps> = ({ to, onClick, children, className, size = 'md' }) => {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const buttonContent = (
    <button
      onClick={onClick}
      className={clsx(
        'button-primary inline-flex items-center justify-center font-bold transition-all duration-300 hover:scale-105',
        sizeClasses[size],
        className
      )}
    >
      {children}
    </button>
  );

  if (to) {
    return (
      <Link to={to} className="no-underline hover:no-underline">
        {buttonContent}
      </Link>
    );
  }

  return buttonContent;
};

export default GlowButton;
