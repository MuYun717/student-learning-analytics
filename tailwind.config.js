/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1890ff',
          dark: '#096dd9',
          light: '#40a9ff',
        },
        secondary: {
          DEFAULT: '#f5f5f5',
          dark: '#e8e8e8',
        },
        success: '#52c41a',
        warning: '#faad14',
        error: '#f5222d',
        text: {
          primary: 'rgba(0, 0, 0, 0.85)',
          secondary: 'rgba(0, 0, 0, 0.65)',
          disabled: 'rgba(0, 0, 0, 0.25)',
        },
      },
    },
  },
  corePlugins: {
    preflight: false,
  },
  important: '#root',
} 