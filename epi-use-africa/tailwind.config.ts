import type { Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class", // Add this line
  theme: {
    extend: {
      fontFamily: {
        sans: ["Manrope", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [
    nextui({
      themes: {
        dark: {
          colors: {
            background: "#1f2937", // Dark mode background
            foreground: "#FFFFFF", // Dark mode text
            primary: {
              DEFAULT: "#8033ff", // Purple for primary buttons
              foreground: "#FFFFFF", // White text on primary buttons
            },
            focus: "#BEF264",
          },
        },
        light: {
          colors: {
            background: "#FFFFFF", // Light mode background
            foreground: "#1f2937", // Light mode text
            primary: {
              DEFAULT: "#8033ff", // Purple for primary buttons
              foreground: "#FFFFFF", // White text on primary buttons
            },
            focus: "#BEF264",
          },
        },
      },
    }),
  ],
};

export default config;
