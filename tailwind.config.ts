import type { Config } from "tailwindcss";
const { fontFamily } = require("tailwindcss/defaultTheme");
import { withUt } from "uploadthing/tw";

export default withUt({
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-100%)" },
        },
        marquee2: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0%)" },
        },
        "come-down": {
          from: {
            transform: "translateY(-25%)",
            opacity: "0",
            filter: "blur(15px)",
          },
          to: { transform: "translateY(0)", opacity: "1", filter: "blur(0)" },
        },
        "build-skeleton": {
          "0%": {
            opacity: "0.5",
            transform: "translateX(-20px)",
            filter: "blur(10px)",
          },
          "20%": {
            opacity: "1",
            transform: "translateX(0)",
            filter: "blur(0)",
          },
          "40%": {
            opacity: "0.5",
            transform: "translateX(-20px)",
            filter: "blur(10px)",
          },
          "60%": {
            opacity: "1",
            transform: "translateX(0)",
            filter: "blur(0)",
          },
          "80%": {
            opacity: "0.5",
            transform: "translateX(-20px)",
            filter: "blur(10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateX(0)",
            filter: "blur(0)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "marquee-infinite": "marquee 400s linear infinite",
        "come-down": "come-down 500ms ease-out",
        "build-skeleton": "build-skeleton 3s ease-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}) satisfies Config;
