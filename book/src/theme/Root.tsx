import React, {type ReactNode} from 'react';
import { AuthProvider } from '@site/src/contexts/AuthContext';

// Root component wraps the entire Docusaurus app
// This ensures AuthProvider is available to all pages and components
export default function Root({children}: {children: ReactNode}): ReactNode {
  return <AuthProvider>{children}</AuthProvider>;
}
