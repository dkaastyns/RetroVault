import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: { ink: '#0b0b12', panel: '#14141f', violet: '#a855f7', acid: '#b7f34a' },
      boxShadow: { neon: '0 0 26px rgb(168 85 247 / 20%)' },
      fontFamily: { mono: ['var(--font-geist-mono)', 'monospace'] }
    }
  },
  plugins: []
};
export default config;
