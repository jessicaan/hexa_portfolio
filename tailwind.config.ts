import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'neon-purple': '#9b5cff',
      },
      dropShadow: {
        'neon-purple': '0 0 15px rgba(155, 92, 255, 0.8)',
        'neon-purple-light': '0 0 5px rgba(155, 92, 255, 0.9)',
      }
    },
  },
  plugins: [],
};
export default config;
