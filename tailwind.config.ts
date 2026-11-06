import type { Config } from "tailwindcss";

/**
 * Oh-TEN-tic! brand palette.
 * Maroon carries authority, Evergreen is the counterweight, Gold is the accent.
 * Red / Orange / Yellow are used sparingly for status and podium moments only.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        maroon: { 50: "#FBF1F2", 100: "#F3DADD", 200: "#E3AEB5", 400: "#A8404F", 600: "#7A1426", 700: "#64101F", 800: "#4E0C18", 900: "#360811", 950: "#22050B" },
        christmas: { DEFAULT: "#B3192B", 600: "#9E1424" },
        evergreen: { 50: "#EEF5F1", 100: "#D3E6DB", 300: "#7FAE93", 500: "#2D6A4F", 600: "#235740", 700: "#1B4533", 800: "#143326", 900: "#0D241A" },
        gold: { 100: "#F7EDCF", 200: "#EEDB9F", 300: "#E3C46A", 400: "#D4AD43", 500: "#BF952B", 600: "#9C7820", 700: "#785B18" },
        ivory: { DEFAULT: "#FBF6EC", 50: "#FFFCF6", 100: "#FBF6EC", 200: "#F3EBDA", 300: "#E8DCC3" },
        ember: "#D9692B",
        sun: "#F0B93A",
        ink: { DEFAULT: "#2A1B1D", soft: "#5C4B4D", mute: "#8A7A7B" },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      letterSpacing: { eyebrow: "0.22em" },
      boxShadow: {
        card: "0 1px 0 rgba(54,8,17,0.04), 0 8px 24px -12px rgba(54,8,17,0.18)",
        lift: "0 2px 0 rgba(54,8,17,0.05), 0 18px 40px -18px rgba(54,8,17,0.35)",
      },
      keyframes: {
        ticker: { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } },
        rise: { "0%": { opacity: "0", transform: "translateY(8px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
      },
      animation: {
        ticker: "ticker 40s linear infinite",
        rise: "rise .7s cubic-bezier(.2,.7,.2,1) both",
      },
    },
  },
  plugins: [],
};
export default config;
