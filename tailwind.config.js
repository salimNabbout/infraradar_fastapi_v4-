export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'ui-sans-serif', 'system-ui'] },
      colors: {
        graphite: '#071014',
        panel: '#0d1b20',
        steel: '#14272e',
        tealbrand: '#16b7a8',
        petroleum: '#0b5563'
      },
      boxShadow: {
        executive: '0 20px 55px rgba(0,0,0,.35)'
      }
    }
  },
  plugins: []
}
