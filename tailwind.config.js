module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        default: "#F5F7FA",
        primary: "#2d71f8",
        primary2: "#1c8371",
        primary3: "#fc4a4a",
        primary4: "#FF9393",
        primary5: '#909399',
        primary6: '#606266'
      },
      fontSize: {
        heading1: '24px',
        heading2: '18px',
        textbtn: '12px',
        body: '14px',
      },
      fontFamily: {
        NotoSansKhmer: 'Noto Sans Khmer'
      },

    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
