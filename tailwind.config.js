export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"Courier New"', 'Courier', 'monospace'],
      },
      colors: {
        realm: {
          nature:      '#2d6a4f',
          abstraction: '#4338ca',
          perception:  '#b45309',
          psychology:  '#be123c',
          sociology:   '#1d4ed8',
          attachment:  '#7c3aed',
          detachment:  '#e2e8f0',
        },
      },
      animation: {
        'fade-in':     'screenFadeIn 0.5s cubic-bezier(0.16,1,0.3,1)',
        'realm-slide': 'realmSlide 0.6s cubic-bezier(0.16,1,0.3,1)',
        'blink':       'terminalBlink 1s step-end infinite',
        'float-slow':  'float 8s ease-in-out infinite',
      },
      keyframes: {
        screenFadeIn:  { '0%': { opacity: '0', transform: 'translateY(12px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        realmSlide:    { '0%': { opacity: '0', transform: 'translateX(24px)' }, '100%': { opacity: '1', transform: 'translateX(0)' } },
        terminalBlink: { '0%,49%': { opacity: '1' }, '50%,100%': { opacity: '0' } },
        float:         { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
      },
    },
  },
  plugins: [],
}
