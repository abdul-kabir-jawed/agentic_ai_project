
import React, { useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react'; // Assuming lucide-react is installed or will be installed
import { cn } from '@site/src/utils/cn';

interface InlineExplainerProps {
  title: string;
  children: ReactNode;
}

const InlineExplainer: React.FC<InlineExplainerProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="my-4 rounded-md border border-border-muted bg-card p-4">
      <button
        onClick={toggleOpen}
        className="flex w-full items-center justify-between text-lg font-semibold text-text-primary focus:outline-none"
      >
        {title}
        <ChevronDown
          className={cn(
            "h-5 w-5 transform transition-transform duration-200",
            isOpen ? "rotate-180" : "rotate-0"
          )}
        />
      </button>
      {isOpen && <div className="mt-2 text-text-muted prose prose-invert max-w-none">{children}</div>}
    </div>
  );
};

export default InlineExplainer;
