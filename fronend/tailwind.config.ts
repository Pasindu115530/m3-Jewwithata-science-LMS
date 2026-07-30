import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#33254f",
        lavender: {
          50: "#faf7ff",
          100: "#f1e9ff",
          200: "#e4d5ff",
          300: "#cbb2ff",
          400: "#ac83f5",
          500: "#8d5be8",
          600: "#7241c5",
          700: "#59329a"
        },
        peach: {
          50: "#fff8f5",
          100: "#ffede6",
          200: "#ffd9cc",
          300: "#ffbca7",
          400: "#fb9276"
        },
        skysoft: "#e8f2ff",
        mintsoft: "#e8f8ed",
        butter: "#fff2c9"
      },
      boxShadow: {
        soft: "0 18px 45px rgba(103, 75, 151, .16)",
        card: "0 10px 24px rgba(90, 65, 124, .12), inset 0 1px 0 rgba(255,255,255,.8)",
        button: "0 8px 16px rgba(117, 76, 191, .25), inset 0 1px 0 rgba(255,255,255,.35)"
      },
      borderRadius: {
        "4xl": "2rem"
      },
      animation: {
        float: "float 5s ease-in-out infinite",
        shimmer: "shimmer 3s linear infinite"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" }
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" }
        }
      }
    }
  },
  plugins: []
};

export default config;
