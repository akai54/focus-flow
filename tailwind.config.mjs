/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#38E07A', // Couleur principale du design Figma
          dark: '#264533', // Vert sombre pour éléments actifs/sélectionnés
          medium: '#4A8761', // Vert moyen
          light: '#96C4A8' // Vert gris/clair pour textes secondaires
        },
        dark: {
          DEFAULT: '#122117', // Couleur de fond principal (vert très foncé/noir)
          card: '#1C3024', // Vert très sombre pour les cartes/arrière-plans
          border: '#366347' // Couleur des bordures
        },
        white: '#FFFFFF'
      },
      fontFamily: {
        spline: ['Spline Sans', 'sans-serif']
      },
      boxShadow: {
        glow: '0 0 20px rgba(56, 224, 122, 0.3)',
        'glow-lg': '0 0 40px rgba(56, 224, 122, 0.4)'
      },
      spacing: {
        18: '4.5rem',
        88: '22rem'
      }
    }
  },
  plugins: []
}
