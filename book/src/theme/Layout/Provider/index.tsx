import React, {type ReactNode} from 'react';
import {composeProviders} from '@docusaurus/theme-common';
import {
  ColorModeProvider,
  AnnouncementBarProvider,
  ScrollControllerProvider,
  NavbarProvider,
  PluginHtmlClassNameProvider,
} from '@docusaurus/theme-common/internal';
import {DocsPreferredVersionContextProvider} from '@docusaurus/plugin-content-docs/client';
import type {Props} from '@theme/Layout/Provider';

// Note: AuthProvider is wrapped at the Root level (Root.tsx) to ensure it's available to all components
const Provider = composeProviders([
  ColorModeProvider,
  AnnouncementBarProvider,
  ScrollControllerProvider,
  DocsPreferredVersionContextProvider,
  PluginHtmlClassNameProvider,
  NavbarProvider,
]);

export default function LayoutProvider({children}: Props): ReactNode {
  return <Provider>{children}</Provider>;
}
