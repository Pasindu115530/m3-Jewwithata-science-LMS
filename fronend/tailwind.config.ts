import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-poppins)", "Poppins", "sans-serif"],
        poppins: ["var(--font-poppins)", "Poppins", "sans-serif"],
      },
      colors: {
        // ── Brand palette ──────────────────────────────
        ink: "#001a5e",          // deep navy body text
        // "lavender" slots → navy blue shades (#002583 family)
        lavender: {
          50:  "#f0f4ff",
          100: "#dce6ff",
          200: "#b8cdff",
          300: "#7aa6ff",
          400: "#4d83f5",
          500: "#0e4fd4",        // interactive accent
          600: "#002583",        // ★ brand navy (primary)
          700: "#001754",        // dark navy
        },
        // "peach" slots → gold/amber shades (#FFB800 family)
        peach: {
          50:  "#fffbf0",
          100: "#fff3cc",
          200: "#ffe799",
          300: "#ffd44d",
          400: "#FFB800",        // ★ brand gold
        },
        skysoft:  "#e8f0ff",
        mintsoft: "#e8f8ed",
        butter:   "#fff8d6",
      },
      boxShadow: {
        soft:   "0 18px 45px rgba(0, 37, 131, .14)",
        card:   "0 10px 24px rgba(0, 37, 131, .10), inset 0 1px 0 rgba(255,255,255,.8)",
        button: "0 8px 20px rgba(0, 37, 131, .30), inset 0 1px 0 rgba(255,255,255,.20)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      animation: {
        float:   "float 5s ease-in-out infinite",
        shimmer: "shimmer 3s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%":      { transform: "translateY(-8px)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
