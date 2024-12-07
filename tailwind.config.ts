import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        slate: {
          850: '#1e293b',
        },
      },
      animation: {
        'fadeIn': 'fadeIn 0.3s ease-in-out',
        'slideUp': 'slideUp 0.3s ease-in-out',
        'scaleIn': 'scaleIn 0.2s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
      backdropBlur: {
        xs: '2px',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      screens: {
        'xs': '475px',
        '3xl': '1920px',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '65ch',
            color: 'inherit',
            a: {
              color: '#3182ce',
              '&:hover': {
                color: '#2c5282',
              },
            },
            '[class~="lead"]': {
              color: '#4a5568',
            },
            strong: {
              color: 'inherit',
            },
            'ol > li::before': {
              color: '#718096',
            },
            'ul > li::before': {
              backgroundColor: '#cbd5e0',
            },
            hr: {
              borderColor: '#e2e8f0',
            },
            blockquote: {
              color: '#718096',
              borderLeftColor: '#e2e8f0',
            },
            h1: {
              color: 'inherit',
            },
            h2: {
              color: 'inherit',
            },
            h3: {
              color: 'inherit',
            },
            h4: {
              color: 'inherit',
            },
            'figure figcaption': {
              color: '#718096',
            },
            code: {
              color: 'inherit',
            },
            'a code': {
              color: '#3182ce',
            },
            pre: {
              color: '#e2e8f0',
              backgroundColor: '#2d3748',
            },
            thead: {
              color: 'inherit',
              borderBottomColor: '#718096',
            },
            'tbody tr': {
              borderBottomColor: '#e2e8f0',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}

export default config
