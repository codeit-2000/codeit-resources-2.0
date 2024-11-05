import type { Config } from "tailwindcss";

import colors from "./src/constants/colors";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const tailwindPresetPxToRem = require("tailwindcss-preset-px-to-rem");

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  presets: [tailwindPresetPxToRem],
  theme: {
    extend: {
      colors: {
        ...colors,
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontSize: {
        // 38px
        "38-700": [
          "38px",
          { lineHeight: "50px", letterSpacing: "-0.3px", fontWeight: "700" },
        ],
        "38-500": [
          "38px",
          { lineHeight: "50px", letterSpacing: "-0.3px", fontWeight: "500" },
        ],

        // 28px
        "28-700": [
          "28px",
          { lineHeight: "40px", letterSpacing: "-0.3px", fontWeight: "700" },
        ],
        "28-500": [
          "28px",
          { lineHeight: "40px", letterSpacing: "-0.3px", fontWeight: "500" },
        ],

        // 24px
        "24-700": [
          "24px",
          { lineHeight: "36px", letterSpacing: "-0.3px", fontWeight: "700" },
        ],
        "24-500": [
          "24px",
          { lineHeight: "36px", letterSpacing: "-0.3px", fontWeight: "500" },
        ],

        // 20px
        "20-700": [
          "20px",
          { lineHeight: "32px", letterSpacing: "-0.3px", fontWeight: "700" },
        ],
        "20-500": [
          "20px",
          { lineHeight: "32px", letterSpacing: "-0.3px", fontWeight: "500" },
        ],
        "20-400": [
          "20px",
          { lineHeight: "32px", letterSpacing: "-0.3px", fontWeight: "400" },
        ],

        // 18px
        "18-700": [
          "18px",
          { lineHeight: "30px", letterSpacing: "-0.3px", fontWeight: "700" },
        ],
        "18-500": [
          "18px",
          { lineHeight: "30px", letterSpacing: "-0.3px", fontWeight: "500" },
        ],
        "18-400": [
          "18px",
          { lineHeight: "30px", letterSpacing: "-0.3px", fontWeight: "400" },
        ],

        // 17px
        "17-700": [
          "17px",
          { lineHeight: "28px", letterSpacing: "-0.3px", fontWeight: "700" },
        ],
        "17-500": [
          "17px",
          { lineHeight: "28px", letterSpacing: "-0.3px", fontWeight: "500" },
        ],
        "17-400": [
          "17px",
          { lineHeight: "28px", letterSpacing: "-0.3px", fontWeight: "400" },
        ],

        // 16px
        "16-700": [
          "16px",
          { lineHeight: "27px", letterSpacing: "-0.3px", fontWeight: "700" },
        ],
        "16-500": [
          "16px",
          { lineHeight: "27px", letterSpacing: "-0.3px", fontWeight: "500" },
        ],
        "16-400": [
          "16px",
          { lineHeight: "27px", letterSpacing: "-0.3px", fontWeight: "400" },
        ],

        // 15px
        "15-700": [
          "15px",
          { lineHeight: "25px", letterSpacing: "-0.3px", fontWeight: "700" },
        ],
        "15-500": [
          "15px",
          { lineHeight: "25px", letterSpacing: "-0.3px", fontWeight: "500" },
        ],
        "15-400": [
          "15px",
          { lineHeight: "25px", letterSpacing: "-0.3px", fontWeight: "400" },
        ],

        // 14px
        "14-700": [
          "14px",
          { lineHeight: "24px", letterSpacing: "-0.3px", fontWeight: "700" },
        ],
        "14-500": [
          "14px",
          { lineHeight: "24px", letterSpacing: "-0.3px", fontWeight: "500" },
        ],
        "14-400": [
          "14px",
          { lineHeight: "24px", letterSpacing: "-0.3px", fontWeight: "400" },
        ],

        // 13px
        "13-700": [
          "13px",
          { lineHeight: "21px", letterSpacing: "-0.3px", fontWeight: "700" },
        ],
        "13-600": [
          "13px",
          { lineHeight: "21px", letterSpacing: "-0.3px", fontWeight: "600" },
        ],
        "13-500": [
          "13px",
          { lineHeight: "21px", letterSpacing: "-0.3px", fontWeight: "500" },
        ],
        "13-400": [
          "13px",
          { lineHeight: "21px", letterSpacing: "-0.3px", fontWeight: "400" },
        ],

        // 12px
        "12-700": [
          "12px",
          { lineHeight: "20px", letterSpacing: "-0.3px", fontWeight: "700" },
        ],
        "12-500": [
          "12px",
          { lineHeight: "20px", letterSpacing: "-0.3px", fontWeight: "500" },
        ],
        "12-400": [
          "12px",
          { lineHeight: "20px", letterSpacing: "-0.3px", fontWeight: "400" },
        ],

        // 11px
        "11-700": [
          "11px",
          { lineHeight: "18px", letterSpacing: "-0.3px", fontWeight: "700" },
        ],
        "11-500": [
          "11px",
          { lineHeight: "18px", letterSpacing: "-0.3px", fontWeight: "500" },
        ],
        "11-400": [
          "11px",
          { lineHeight: "18px", letterSpacing: "-0.3px", fontWeight: "400" },
        ],

        // 10px
        "10-700": [
          "10px",
          { lineHeight: "15px", letterSpacing: "-0.3px", fontWeight: "700" },
        ],
        "10-500": [
          "10px",
          { lineHeight: "15px", letterSpacing: "-0.3px", fontWeight: "500" },
        ],
        "10-400": [
          "10px",
          { lineHeight: "15px", letterSpacing: "-0.3px", fontWeight: "400" },
        ],
      },
      boxShadow: {
        "dropdown-wrapper": "0px 2px 4px 0px #3332360F",
      },
    },
  },
  keyframes: {
    shimmer: {
      "0%": { transform: "translateX(-100%)" },
      "100%": { transform: "translateX(100%)" },
    },
  },
  animation: {
    shimmer: "shimmer 2s infinite",
  },

  plugins: [],
};
export default config;
