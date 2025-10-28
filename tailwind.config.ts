import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "tx-yellow": "#fff837",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Arial", "Helvetica", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
        sharpGrotesk: ["var(--font-sharp-grotesk-light-25)", "sans-serif"],
        actay: ["var(--font-actay-regular)", "sans-serif"],
        actayWide: ["var(--font-actay-wide-bold)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
