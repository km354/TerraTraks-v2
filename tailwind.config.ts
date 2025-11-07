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
        // TerraTraks Brand Colors
        forest: {
          DEFAULT: "#1D3B2A",
          dark: "#152620",
          light: "#2A5240",
        },
        sage: {
          DEFAULT: "#A8C3A4",
          light: "#C4D9C1",
          dark: "#8BA687",
        },
        sky: {
          DEFAULT: "#89CFF0",
          light: "#B3E0F5",
          dark: "#5BB5E8",
        },
        sand: {
          DEFAULT: "#E5DCC5",
          light: "#F0E9D8",
          dark: "#D4C8AA",
        },
        offwhite: {
          DEFAULT: "#F7F6F2",
          light: "#FCFBF9",
          dark: "#F0EFE8",
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
};
export default config;

