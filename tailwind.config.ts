import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',       // App Router pages/components
    './src/components/**/*.{js,ts,jsx,tsx}',     // Shared components
    './src/**/*.{js,ts,jsx,tsx}',                // Any other frontend code
  ],
  theme: {
    extend: {
      colors: {
        tradingDark: '#0e1116',
        bloombergGray: '#1e1e1e',
      },
      fontFamily: {
        sans: ['Geist Sans', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
}
export default config
