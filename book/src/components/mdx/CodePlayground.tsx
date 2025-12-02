
import React, { type ReactNode } from 'react';
import { Button } from '@site/src/components/ui/button';

interface CodePlaygroundProps {
  children: ReactNode;
  language: string;
}

const CodePlayground: React.FC<CodePlaygroundProps> = ({ children, language }) => {
  const handleOpenPlayground = () => {
    alert(`Opening ${language} playground (placeholder functionality)!`);
  };

  return (
    <div className="my-4 rounded-md border border-border-muted bg-card p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-text-primary">{language.toUpperCase()}</span>
        <Button variant="outline" size="sm" onClick={handleOpenPlayground}>
          Open in Playground
        </Button>
      </div>
      <div className="overflow-auto rounded-md bg-code-bg p-2 text-sm">
        {children}
      </div>
    </div>
  );
};

export default CodePlayground;
