/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0F172A",     // Deep Slate Blue/Dark Backgrounds
        secondary: "#1E40AF",   // Cobalt Blue
        accent: "#3B82F6",      // Neon Blue
        highlight: "#F59E0B",   // Warm Gold / Warning
        neutralbg: "#F8FAFC",   // Clean Ice Background
        cardbg: "#FFFFFF"       // Clean White Cards
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.07)",
        card: "0 4px 20px -2px rgba(15, 23, 42, 0.05)",
        cardHover: "0 20px 40px -10px rgba(15, 23, 42, 0.12)",
      },
    },
  },
  plugins: [],
}
