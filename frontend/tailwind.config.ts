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
        aubergine: "#3c315b",
        "ghost-lavender": "#e2dffe",
        periwinkle: "#ab9ff2",
        "cornflower-pop": "#4a87f2",
        buttercream: "#ffffc4",
        "blush-mist": "#ffdadc",
        "mint-signal": "#2ec08b",
        "paper-white": "#fdfcfe",
        obsidian: "#1c1c1c",
        fog: "#86848d",
        ash: "#e9e8ea",
        bone: "#f4f2f4",
        // Legacy
        "paper-warmth": "#f6f5f4",
        "ink-black": "#000000",
        "notion-blue": "#0075de",
        marigold: "#ffb110",
        coral: "#f64932",
        "sky-tint": "#e6f3fe",
        graphite: "#615d59",
        stone: "#757575",
      },
      fontFamily: {
        phantom: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: {
        cards: "24px",
        pills: "100px",
        buttons: "100px",
        full: "100px",
      },
      animation: {
        "ghost-float": "ghostFloat 4s ease-in-out infinite",
        "ghost-blink": "ghostBlink 4s ease-in-out infinite",
        "fade-in-up": "fadeInUp 0.6s ease-out forwards",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        ghostFloat: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "25%": { transform: "translateY(-8px) rotate(2deg)" },
          "75%": { transform: "translateY(4px) rotate(-1deg)" },
        },
        ghostBlink: {
          "0%, 90%, 100%": { opacity: "1" },
          "95%": { opacity: "0" },
        },
        fadeInUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
