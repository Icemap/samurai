/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Apple-inspired color palette
        apple: {
          blue: {
            light: '#2997ff',
            DEFAULT: '#0071e3',
            dark: '#0058b8',
          },
          red: {
            DEFAULT: '#ff3b30',
            dark: '#d70015',
          },
          green: {
            DEFAULT: '#34c759',
            dark: '#28a946',
          },
          gray: {
            50: '#f9fafb',
            100: '#f3f4f6',
            200: '#e5e7eb',
            300: '#d1d5db',
            400: '#9ca3af',
            500: '#6b7280',
            600: '#4b5563',
            700: '#374151',
            800: '#1f2937',
            900: '#111827',
          },
          white: '#ffffff',
          black: '#000000',
        },
        primary: {
          50: '#f0f7ff',
          100: '#e0eefe',
          200: '#bae0fd',
          300: '#84cafc',
          400: '#43acf9',
          500: '#1a8df4',
          600: '#0870e9',
          700: '#0459d7',
          800: '#0749af',
          900: '#0a408c',
          950: '#0a285a',
        },
        secondary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
        },
        // Add standard colors for Tailwind 4.0 compatibility
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
      },
      fontFamily: {
        sans: [
          'SF Pro Display',
          'SF Pro Text',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'sans-serif',
        ],
        mono: [
          'SF Mono',
          'monospace'
        ],
      },
      borderRadius: {
        'apple': '10px',
        'apple-sm': '8px',
        'apple-lg': '16px',
        'apple-xl': '20px',
      },
      boxShadow: {
        'apple': '0 0 0 4px rgba(0, 125, 250, 0.1)',
        'apple-btn': '0 2px 4px rgba(0, 0, 0, 0.1)',
        'apple-card': '0 4px 12px rgba(0, 0, 0, 0.08)',
        'apple-nav': '0 4px 20px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
} 