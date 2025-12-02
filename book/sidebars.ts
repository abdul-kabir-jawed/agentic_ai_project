import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Textbook',
      items: [
        'chapter-1-introduction-to-physical-ai',
        'chapter-2-humanoid-robotics-overview',
        'chapter-3-humanoid-robotics-sensors-and-actuators', // Corrected entry
        'chapter-4-navigation-and-path-planning',
        'chapter-5-motion-planning-and-control',
        'chapter-6-machine-learning-for-robotics',
        'chapter-7-human-robot-interaction',
        'chapter-8-advanced-topics-future-directions',
      ],    },
  ],

  // But you can create a sidebar manually
  /*
  tutorialSidebar: [
    'intro',
    'hello',
    {
      type: 'category',
      label: 'Tutorial',
      items: ['tutorial-basics/create-a-document'],
    },
  ],
   */
};

export default sidebars;
