import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './web/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'ui-monospace', 'monospace'],
      },
      colors: {
        // Deterministic agent palette (T2 maps name-hash → index)
        agent: {
          0: '#60a5fa', // blue-400
          1: '#f472b6', // pink-400
          2: '#34d399', // emerald-400
          3: '#fb923c', // orange-400
          4: '#a78bfa', // violet-400
          5: '#facc15', // yellow-400
          6: '#22d3ee', // cyan-400
          7: '#f87171', // red-400
        },
      },
    },
  },
  plugins: [],
}

export default config
