
import type { Config } from "tailwindcss";

const animations = {
  keyframes: {
    "accordion-down": {
      from: { height: "0" },
      to: { height: "var(--radix-accordion-content-height)" },
    },
    "accordion-up": {
      from: { height: "var(--radix-accordion-content-height)" },
      to: { height: "0" },
    },
    float: {
      "0%, 100%": { transform: "translateY(0)" },
      "50%": { transform: "translateY(-10px)" },
    },
    "float-delayed": {
      "0%, 100%": { transform: "translateY(0)" },
      "50%": { transform: "translateY(-15px)" },
    },
    gradient: {
      "0%, 100%": { backgroundPosition: "0% 50%" },
      "50%": { backgroundPosition: "100% 50%" },
    },
    "neon-pulse": {
      "0%, 100%": { boxShadow: "0 0 10px 2px rgba(245,158,11,0.7), 0 0 20px 6px rgba(245,158,11,0.5)" },
      "50%": { boxShadow: "0 0 15px 4px rgba(245,158,11,0.9), 0 0 30px 8px rgba(245,158,11,0.7)" },
    },
  },
  animation: {
    "accordion-down": "accordion-down 0.2s ease-out",
    "accordion-up": "accordion-up 0.2s ease-out",
    float: "float 6s ease-in-out infinite",
    "float-delayed": "float-delayed 8s ease-in-out infinite 1s",
    gradient: "gradient 15s ease infinite",
    "neon-pulse": "neon-pulse 2s ease-in-out infinite",
  },
};

const colors = {
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
  brand: {
    purple: "#6D28D9",
    blue: "#2563EB",
  },
};

export default {
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
      colors,
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      ...animations,
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
