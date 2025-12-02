/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./docs/**/*.{md,mdx}",
    "./blog/**/*.{md,mdx}",
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // Base Colors (GitHub Dark)
        background: {
          primary: '#0d1117',
          secondary: '#161b22',
          tertiary: '#21262d',
        },
        // Accent Colors
        accent: {
          primary: '#58a6ff',
          secondary: '#79c0ff',
          glow: '#388bfd',
        },
        // Text Colors
        text: {
          primary: '#c9d1d9',
          secondary: '#8b949e',
          tertiary: '#6e7681',
        },
        // Semantic Colors
        success: '#3fb950',
        warning: '#d29922',
        error: '#f85149',
        // Border Colors
        border: {
          default: '#30363d',
          muted: '#21262d',
        },
        // Existing palette mappings for backward compatibility
        primary: {
          DEFAULT: '#58a6ff',
          foreground: '#ffffff',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        heading: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'sm': '0 1px 3px rgba(0, 0, 0, 0.3)',
        'md': '0 4px 6px rgba(0, 0, 0, 0.4)',
        'lg': '0 10px 15px rgba(0, 0, 0, 0.5)',
        'glow': '0 0 20px rgba(56, 139, 253, 0.3)',
      },
      maxWidth: {
        reading: '1100px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
  corePlugins: {
    preflight: false, // Docusaurus handles reset
  },
};