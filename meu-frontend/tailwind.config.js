module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary100: '#d4eaf7',
        primary200: '#b6ccd8',
        primary300: '#454545',
        accent100: '#25b1bf',
        accent200: '#00668c',
        text100: '#ffffff',
        text200: '#0D1F2D',
        bg100: '#fffefb',
        bg200: '#bda78a',
        bg300: '#cccbc8',
        bg400: '#dd0025',
      },
      fontFamily: {
        limelight: ['"Limelight"', 'cursive', 'Noto Serif'],
        slab: ['"Roboto Slab"', 'serif', 'Oswald'],
      },
    },
  },
  plugins: [],
}