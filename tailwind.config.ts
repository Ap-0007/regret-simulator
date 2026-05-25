import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0a",
        surface: "#111111",
        "surface-2": "#1a1a1a",
        "surface-3": "#222222",
        border: "#2a2a2a",
        "border-bright": "#3a3a3a",
        "text-primary": "#f5f5f5",
        "text-secondary": "#a1a1aa",
        "text-muted": "#71717a",
        amber: {
          400: "#fbbf24",
          500: "#f59e0b",
        },
        path: {
          a: "#f59e0b",
          b: "#3b82f6",
          c: "#8b5cf6",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out forwards",
        "slide-up": "slideUp 0.4s ease-out forwards",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "message-cycle": "messageCycle 12.5s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        messageCycle: {
          "0%, 17%": { opacity: "1", transform: "translateY(0)" },
          "20%, 97%": { opacity: "0", transform: "translateY(-12px)" },
          "100%": { opacity: "0", transform: "translateY(-12px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
