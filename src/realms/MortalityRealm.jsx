import { useState } from 'react'
import { useGame } from '../context/GameContext.jsx'
import { tapLight, tapMedium } from '../lib/haptics.js'

const MAX_PICKS = 5

const WORD_SETS = [
  [
    { word: 'outlast',   category: 'legacy'   },
    { word: 'now',       category: 'present'  },
    { word: 'later',     category: 'avoidant' },
    { word: 'imprint',   category: 'legacy'   },
    { word: 'enough',    category: 'present'  },
    { word: 'routine',   category: 'avoidant' },
    { word: 'lasting',   category: 'legacy'   },
    { word: 'here',      category: 'present'  },
    { word: 'forward',   category: 'avoidant' },
    { word: 'after me',  category: 'legacy'   },
    { word: 'breath',    category: 'present'  },
    { word: 'distance',  category: 'avoidant' },
  ],
  [
    { word: 'permanence',  category: 'legacy'   },
    { word: 'this moment', category: 'present'  },
    { word: 'keep going',  category: 'avoidant' },
    { word: 'matter',      category: 'legacy'   },
    { word: 'alive',       category: 'present'  },
    { word: 'busy',        category: 'avoidant' },
    { word: 'leave a mark',category: 'legacy'   },
    { word: 'presence',    category: 'present'  },
    { word: 'tomorrow',    category: 'avoidant' },
    { word: 'legacy',      category: 'legacy'   },
    { word: 'grounded',    category: 'present'  },
    { word: 'move on',     category: 'avoidant' },
  ],
  [
    { word: 'what remains',category: 'legacy'   },
    { word: 'real',        category: 'present'  },
    { word: 'not yet',     category: 'avoidant' },
    { word: 'meaning',     category: 'legacy'   },
    { word: 'this',        category: 'present'  },
    { word: 'manage',      category: 'avoidant' },
    { word: 'my mark',     category: 'legacy'   },
    { word: 'right now',   category: 'present'  },
    { word: 'onwards',     category: 'avoidant' },
    { word: 'remembered',  category: 'legacy'   },
    { word: 'alive now',   category: 'present'  },
    { word: 'push through',category: 'avoidant' },
  ],
]

export default function MortalityRealm() {
  const { dispatch, variantSeed } = useGame()
  const words = WORD_SETS[variantSeed % WORD_SETS.length]

  const [selected,   setSelected]   = useState([])
  const [submitted,  setSubmitted]   = useState(false)

  function toggleWord(w) {
    if (submitted) return
    const already = selected.some(s => s.word === w.word)
    if (already) {
      tapLight()
      setSelected(prev => prev.filter(s => s.word !== w.word))
    } else if (selected.length < MAX_PICKS) {
      tapLight()
      setSelected(prev => [...prev, w])
    }
  }

  function handleContinue() {
    if (selected.length === 0 || submitted) return
    tapMedium()
    setSubmitted(true)
    selected.forEach(w => dispatch({ type: 'TRACK_MORTALITY', answer: w.category }))
    setTimeout(() => dispatch({ type: 'NEXT_REALM' }), 600)
  }

  const isSelected = w => selected.some(s => s.word === w.word)
  const full       = selected.length >= MAX_PICKS

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="strata-surface p-4">
        <p className="text-slate-400 text-sm leading-relaxed">
          These words appear without grouping or context.
        </p>
        <p className="text-slate-300 text-sm leading-relaxed mt-1">
          Select up to {MAX_PICKS} that feel most honestly true about how you actually live.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {words.map(w => {
          const sel      = isSelected(w)
          const disabled = full && !sel
          return (
            <button
              key={w.word}
              onClick={() => toggleWord(w)}
              disabled={disabled || submitted}
              className="py-3 px-2 rounded-xl mono text-xs text-center transition-all duration-150"
              style={{
                background:  sel ? 'var(--realm-accent)' : 'rgba(255,255,255,0.04)',
                border:      `1px solid ${sel ? 'var(--realm-accent)' : 'rgba(255,255,255,0.08)'}`,
                color:       sel ? '#000' : disabled ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.55)',
                fontWeight:  sel ? '700' : '400',
              }}
            >
              {w.word}
            </button>
          )
        })}
      </div>

      <div className="flex items-center justify-between">
        <p className="mono text-xs text-slate-700">{selected.length} / {MAX_PICKS} selected</p>
        {selected.length >= 3 && !submitted && (
          <button onClick={handleContinue} className="btn-realm mono tracking-widest uppercase text-xs px-5 py-2 animate-fade-in">
            CONTINUE
          </button>
        )}
      </div>
    </div>
  )
}
