import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        xuan: { DEFAULT: '#0d0a1a', card: '#151029', surface: '#1a1435' },
        gold: { DEFAULT: '#d4a843', light: '#f5e6b8', dark: '#8b6914' },
        purple: { DEFAULT: '#6b3fa0', light: '#9b6dd7', dark: '#3d1f6d' },
        vermillion: { DEFAULT: '#c23b22', light: '#e0553d', dark: '#8b1a1a' },
        paper: { DEFAULT: '#e8e0f5', dark: '#b8a8d0', warm: '#f0eaf8' },
        ink: { DEFAULT: '#0d0a1a', light: '#2a1f4d', muted: '#6b5d8d' },
        star: { DEFAULT: '#c4b5fd', bright: '#e0d5ff' },
      },
      fontFamily: {
        display: ['"ZhiMangXing"', 'cursive'],
        body: ['"Noto Serif SC"', 'serif'],
        number: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'glow-rise': 'glow-rise 5s ease-in-out infinite',
        'thinking-pulse': 'thinking-pulse 2s ease-in-out infinite',
        'thinking-dot': 'thinking-dot 1.4s ease-in-out infinite',
        'star-twinkle': 'star-twinkle 3s ease-in-out infinite',
      },
      keyframes: {
        'glow-rise': {
          '0%, 100%': { opacity: '0.2', transform: 'translateY(0)' },
          '50%': { opacity: '0.8', transform: 'translateY(-20px)' },
        },
        'thinking-pulse': {
          '0%, 100%': { opacity: '0.3', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(1.15)' },
        },
        'thinking-dot': {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '1' },
        },
        'star-twinkle': {
          '0%, 100%': { opacity: '0.3', transform: 'scale(0.8)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
