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
        // PostSoma-2050 Design System (Dark Mode Only)
        bg: "#121212",
        "text-primary": "#E0E0E0",
        "text-secondary": "#A0A0A0",
        // Category accents (borders, glows, active states)
        "accent-ai": "#00F0FF", // Neon Cyan - AI Insights
        "accent-blockchain": "#F7931A", // Bitcoin Orange
        "accent-philosophy": "#00FF41", // Terminal / Matrix Green
        "accent-investing-bull": "#00FF41", // Green
        "accent-investing-bear": "#FF3B30", // Red
        "accent-notes": "#F5F5F5", // Paper White - Sheshin Notes
      },
      fontFamily: {
        mono: ["var(--font-jetbrains-mono)", "JetBrains Mono", "Space Mono", "monospace"],
        sans: ["var(--font-inter)", "Inter", "Roboto", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 20px -5px var(--tw-shadow-color)",
        "glow-sm": "0 0 12px -4px var(--tw-shadow-color)",
      },
      borderColor: {
        default: "rgba(224, 224, 224, 0.12)",
      },
      keyframes: {
        glitch: {
          "0%": { transform: "translate(0)" },
          "20%": { transform: "translate(-2px, 2px)" },
          "40%": { transform: "translate(2px, -2px)" },
          "60%": { transform: "translate(-2px, -2px)" },
          "80%": { transform: "translate(2px, 2px)" },
          "100%": { transform: "translate(0)" },
        },
        blink: {
          "0%, 50%": { opacity: "1" },
          "51%, 100%": { opacity: "0" },
        },
        "hero-subtitle": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.82" },
        },
        gradientShift: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        gradientBreath: {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "0.85" },
        },
        bentoFrameBreath: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.88" },
        },
        heroHeartbeat: {
          "0%, 100%": { transform: "scale(1)", boxShadow: "0 0 20px -4px rgba(0,240,255,0.3), 0 0 40px -8px rgba(0,240,255,0.15)" },
          "14%": { transform: "scale(1.012)", boxShadow: "0 0 28px -4px rgba(0,240,255,0.5), 0 0 50px -8px rgba(0,240,255,0.25)" },
          "28%": { transform: "scale(1)", boxShadow: "0 0 20px -4px rgba(0,240,255,0.3), 0 0 40px -8px rgba(0,240,255,0.15)" },
          "42%": { transform: "scale(1.018)", boxShadow: "0 0 32px -4px rgba(0,240,255,0.55), 0 0 55px -8px rgba(0,240,255,0.3)" },
          "56%": { transform: "scale(1)", boxShadow: "0 0 20px -4px rgba(0,240,255,0.3), 0 0 40px -8px rgba(0,240,255,0.15)" },
        },
        portalBreath: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(0,240,255,0.35)" },
          "50%": { boxShadow: "0 0 32px rgba(0,240,255,0.55)" },
        },
      },
      animation: {
        glitch: "glitch 0.3s ease-in-out",
        blink: "blink 1s step-end infinite",
        "hero-subtitle": "hero-subtitle 4s ease-in-out infinite",
        "gradient-shift": "gradientShift 6s ease-in-out infinite",
        "gradient-breath": "gradientBreath 3s ease-in-out infinite",
        "bento-frame-breath": "bentoFrameBreath 2.5s ease-in-out infinite",
        "hero-heartbeat": "heroHeartbeat 1.4s ease-in-out infinite",
        "portal-breath": "portalBreath 2s ease-in-out infinite",
      },
      typography: () => ({
        DEFAULT: {
          css: {
            "--tw-prose-body": "#E0E0E0",
            "--tw-prose-headings": "#ffffff",
            "--tw-prose-links": "#00F0FF",
            "--tw-prose-bold": "#ffffff",
            color: "#E0E0E0",
            "h1, h2, h3, h4": {
              fontFamily: "var(--font-jetbrains-mono), JetBrains Mono, monospace",
              color: "#ffffff",
            },
            a: {
              color: "#00F0FF",
            },
            "pre, code": {
              backgroundColor: "#1f2937",
            },
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
