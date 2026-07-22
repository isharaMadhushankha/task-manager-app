/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mongo: {
          'brand-green': 'var(--color-mongo-brand-green)',
          'brand-green-dark': 'var(--color-mongo-brand-green-dark)',
          'brand-green-mid': 'var(--color-mongo-brand-green-mid)',
          'brand-green-soft': 'var(--color-mongo-brand-green-soft)',
          'brand-teal-deep': 'var(--color-mongo-brand-teal-deep)',
          'brand-teal': 'var(--color-mongo-brand-teal)',
          'brand-teal-mid': 'var(--color-mongo-brand-teal-mid)',
          
          'accent-purple': 'var(--color-mongo-accent-purple)',
          'accent-orange': 'var(--color-mongo-accent-orange)',
          'accent-pink': 'var(--color-mongo-accent-pink)',
          'accent-blue': 'var(--color-mongo-accent-blue)',

          'canvas': 'var(--color-mongo-canvas)',
          'canvas-dark': 'var(--color-mongo-canvas-dark)',
          'surface': 'var(--color-mongo-surface)',
          'surface-soft': 'var(--color-mongo-surface-soft)',
          'surface-feature': 'var(--color-mongo-surface-feature)',
          
          'hairline': 'var(--color-mongo-hairline)',
          'hairline-soft': 'var(--color-mongo-hairline-soft)',
          'hairline-strong': 'var(--color-mongo-hairline-strong)',
          'hairline-dark': 'var(--color-mongo-hairline-dark)',

          'ink': 'var(--color-mongo-ink)',
          'charcoal': 'var(--color-mongo-charcoal)',
          'slate': 'var(--color-mongo-slate)',
          'steel': 'var(--color-mongo-steel)',
          'stone': 'var(--color-mongo-stone)',
          'muted': 'var(--color-mongo-muted)',
          'on-dark': 'var(--color-mongo-on-dark)',
          'on-dark-muted': 'var(--color-mongo-on-dark-muted)',
        }
      },
      fontFamily: {
        mongo: ['"Euclid Circular A"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        'mongo-code': ['"Source Code Pro"', '"SF Mono"', 'Menlo', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'level-1': 'var(--shadow-mongo-level-1)',
        'level-2': 'var(--shadow-mongo-level-2)',
        'level-3': 'var(--shadow-mongo-level-3)',
        'level-4': 'var(--shadow-mongo-level-4)',
      },
      borderRadius: {
        'mongo-xs': '4px',
        'mongo-sm': '6px',
        'mongo-md': '8px',
        'mongo-lg': '12px',
        'mongo-xl': '16px',
        'mongo-xxl': '24px',
        'mongo-pill': '9999px',
      }
    },
  },
  plugins: [],
}