import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          base: "#08090b",
          surface: "#0f1014",
          elevated: "#16171c",
          inset: "#0b0c10",
        },
        line: {
          DEFAULT: "#1f2026",
          strong: "#2a2b32",
          accent: "#22d3ee33",
        },
        ink: {
          primary: "#f4f4f5",
          secondary: "#a1a1aa",
          muted: "#6b6b73",
          dim: "#4b4b52",
        },
        signal: {
          cyan: "#22d3ee",
          blue: "#3b82f6",
          green: "#10b981",
          amber: "#f59e0b",
          red: "#ef4444",
          violet: "#8b5cf6",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular"],
      },
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "1rem", letterSpacing: "0.04em" }],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "shimmer": "shimmer 2s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      backgroundImage: {
        "grid-fade":
          "linear-gradient(180deg, rgba(34,211,238,0.04) 0%, transparent 60%)",
        "radial-spot":
          "radial-gradient(circle at 50% 0%, rgba(34,211,238,0.08), transparent 60%)",
      },
    },
  },
  plugins: [],
};

export default config;
