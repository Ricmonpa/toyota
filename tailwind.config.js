import tailwindcssAnimate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}", "./Toyotawidget.jsx"],
  theme: {
    extend: {},
  },
  plugins: [tailwindcssAnimate],
};
