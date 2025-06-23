import withMT from "@material-tailwind/react/utils/withMT";

export default withMT({
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: "class", // 👈 ACTIVAMOS modo oscuro por clase
  theme: {
    extend: {},
  },
  plugins: [],
});
