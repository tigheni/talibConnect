export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        "roboto-mono": ["Roboto Mono", "monospace"],
        inter: ["Inter", "sans-serif"],
      },
      keyframes: {
        l4: {
          "0%": { width: "70px", aspectRatio: "4 / 1" },
          "100%": { width: "25px", aspectRatio: "1 / 1" },
        },
      },
      animation: {
        l4: "l4 1s infinite alternate",
      },
    },
  },
};
