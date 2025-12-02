import React from 'react';
import clsx from 'clsx';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className, hoverEffect = true }) => {
  return (
    <div
      className={clsx(
        'card p-6 backdrop-blur-md bg-opacity-70 bg-background-secondary border border-border-muted rounded-xl',
        hoverEffect && 'hover:border-accent-primary hover:shadow-glow transition-all duration-300 hover:-translate-y-1',
        className
      )}
    >
      {children}
    </div>
  );
};

export default GlassCard;
