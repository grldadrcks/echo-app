import { useState, useRef, useEffect } from 'react'
import { useGame } from '../context/GameContext.jsx'

const VARIANTS = [
  [
    { description: 'A pattern found in sunflower seeds, nautilus shells, and branching trees.', values: [1, 1, 2, 3, 5, 8, 13], next: 21, options: [19, 20, 21, 23] },
    { description: 'The spacing between numbers that cannot be divided.', values: [2, 3, 5, 7, 11], next: 13, options: [12, 13, 14, 15] },
    { description: 'Doubling — the pattern of cell division, compound growth, binary systems.', values: [1, 2, 4, 8, 16], next: 32, options: [28, 30, 32, 36] },
    { description: 'The areas of squares with sides 1, 2, 3, 4, 5.', values: [1, 4, 9, 16, 25], next: 36, options: [33, 35, 36, 38] },
    { description: 'Dots arranged in equilateral triangles — 1 dot, 3 dots, 6 dots...', values: [1, 3, 6, 10, 15], next: 21, options: [19, 20, 21, 22] },
  ],
  [
    { description: 'A cousin of Fibonacci — same rule, different seed. Found in plant spiral counts.', values: [2, 1, 3, 4, 7, 11], next: 18, options: [16, 17, 18, 20] },
    { description: 'The product of all integers up to n. Growth that compounds with itself.', values: [1, 1, 2, 6, 24], next: 120, options: [100, 110, 120, 144] },
    { description: 'Exponential tripling — the pattern of branching, fractal division, tritium decay.', values: [1, 3, 9, 27, 81], next: 243, options: [200, 243, 256, 270] },
    { description: 'The volumes of cubes with sides 1, 2, 3, 4, 5.', values: [1, 8, 27, 64, 125], next: 216, options: [196, 210, 216, 225] },
    { description: 'Dots arranged in nested pentagons — nature\'s five-fold symmetry.', values: [1, 5, 12, 22, 35], next: 51, options: [45, 48, 51, 55] },
  ],
  [
    { description: 'The maximum pieces a circle can be cut into with n straight lines.', values: [1, 2, 4, 7, 11], next: 16, options: [14, 15, 16, 18] },
    { description: 'One less than each power of 2. Found in binary counting and Mersenne primes.', values: [1, 3, 7, 15, 31], next: 63, options: [55, 60, 63, 64] },
    { description: 'Dots in concentric hexagons — the shape of honeycomb and carbon lattices.', values: [1, 7, 19, 37, 61], next: 91, options: [85, 89, 91, 97] },
    { description: 'n × (n+1) — the product of consecutive integers, found in staircase arrangements.', values: [0, 2, 6, 12, 20], next: 30, options: [26, 28, 30, 32] },
    { description: 'A steady rhythm — the same step, taken over and over. Linear growth in nature.', values: [3, 10, 17, 24, 31], next: 38, options: [35, 37, 38, 40] },
  ],
]

export default function NatureRealm() {
  const { dispatch, cycleCount } = useGame()
  const variant  = VARIANTS[cycleCount % VARIANTS.length]
  const [index,    setIndex]    = useState(0)
  const [selected, setSelected] = useState(null)
  const startTimeRef = useRef(Date.now())

  useEffect(() => {
    startTimeRef.current = Date.now()
    setSelected(null)
  }, [index])

  const seq = variant[index]

  function handleSelect(option) {
    if (selected !== null) return
    const ms = Date.now() - startTimeRef.current
    setSelected(option)
    dispatch({ type: 'TRACK_NATURE_RESPONSE', ms })
    setTimeout(() => {
      if (index + 1 < variant.length) {
        setIndex(i => i + 1)
      } else {
        dispatch({ type: 'NEXT_REALM' })
      }
    }, 900)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="strata-surface p-5">
        <p className="text-slate-400 text-sm leading-relaxed mb-5">{seq.description}</p>
        <div className="flex items-center gap-2 flex-wrap">
          {seq.values.map((v, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="mono font-semibold text-lg" style={{ color: 'var(--realm-accent)' }}>{v}</span>
              {i < seq.values.length - 1 && <span className="text-slate-700 text-sm">→</span>}
            </div>
          ))}
          <span className="text-slate-700 text-sm">→</span>
          <span className="mono text-slate-600 text-lg">?</span>
        </div>
      </div>

      <p className="text-slate-500 text-xs mono text-center">{index + 1} / {variant.length}</p>

      <div className="space-y-3">
        {seq.options.map(opt => (
          <button key={opt} onClick={() => handleSelect(opt)}
            className={`choice-card mono text-lg font-semibold ${selected === opt ? 'selected' : ''}`}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}
