import { useState } from 'react'
import { useGame } from '../context/GameContext.jsx'
import { tapLight } from '../lib/haptics.js'

const VARIANTS = [
  [
    {
      prompt: 'When you imagine a life well-lived, the thing that stands out most is...',
      choices: [
        { label: 'Stability. Security. A life without constant threat or uncertainty.', value: 'security'   },
        { label: 'Being deeply known and loved by people who matter.',             value: 'connection' },
        { label: 'Continuous becoming — always learning, changing, reaching.',     value: 'growth'     },
      ],
    },
    {
      prompt: 'If you could change one thing about your life right now, it would most likely be...',
      choices: [
        { label: 'More certainty — financial, relational, or structural stability.', value: 'security'   },
        { label: 'Deeper or more authentic connection with the people around you.', value: 'connection' },
        { label: 'More room to develop, explore, or pursue what matters to you.', value: 'growth'     },
      ],
    },
    {
      prompt: 'After a long, hard week, the thing you reach for most naturally is...',
      choices: [
        { label: 'Safety and routine — something familiar and low-risk.',          value: 'security'   },
        { label: 'Other people — someone to be with.',                             value: 'connection' },
        { label: 'Something that engages you — a project, a book, a challenge.',   value: 'growth'     },
      ],
    },
    {
      prompt: 'When you think about what you most want from a relationship, it is...',
      choices: [
        { label: 'Reliability. Someone who is consistently there.',                value: 'security'   },
        { label: 'Real intimacy — to be fully seen and to see.',                   value: 'connection' },
        { label: 'Someone who challenges you and grows alongside you.',            value: 'growth'     },
      ],
    },
    {
      prompt: 'If everything in your life was taken and you had to rebuild, you would prioritize...',
      choices: [
        { label: 'Stability first — a foundation to build from.',                  value: 'security'   },
        { label: 'The people — everything else is secondary.',                     value: 'connection' },
        { label: 'The chance to build something meaningful again.',                value: 'growth'     },
      ],
    },
  ],
  [
    {
      prompt: 'The thing that most reliably makes you feel okay is...',
      choices: [
        { label: 'Knowing that you are safe — financially, socially, physically.', value: 'security'   },
        { label: 'Feeling genuinely close to someone.',                            value: 'connection' },
        { label: 'Making progress on something that matters.',                     value: 'growth'     },
      ],
    },
    {
      prompt: 'In your best moments, you feel...',
      choices: [
        { label: 'Stable. Grounded. Not threatened.',                              value: 'security'   },
        { label: 'Truly connected — to another person or people.',                 value: 'connection' },
        { label: 'Alive. Engaged. Moving forward.',                                value: 'growth'     },
      ],
    },
    {
      prompt: 'The deepest fear underneath most of your fears is probably...',
      choices: [
        { label: 'That the ground will give way — that the stability you have will disappear.', value: 'security' },
        { label: 'That you will be alone in the end — truly alone.',               value: 'connection' },
        { label: 'That you will stop growing. That you will calcify.',             value: 'growth'     },
      ],
    },
    {
      prompt: 'If you had to describe what you are ultimately chasing, it would be...',
      choices: [
        { label: 'Peace. A life that is not precarious.',                          value: 'security'   },
        { label: 'Love. Real, sustained, mutual love.',                            value: 'connection' },
        { label: 'Mastery. Growth. Becoming more.',                                value: 'growth'     },
      ],
    },
    {
      prompt: 'The question that haunts you most is probably...',
      choices: [
        { label: 'Will I be okay? Will the things I depend on hold?',              value: 'security'   },
        { label: 'Do the people I love know it — and do they love me back?',      value: 'connection' },
        { label: 'Am I becoming who I am capable of becoming?',                    value: 'growth'     },
      ],
    },
  ],
  [
    {
      prompt: 'When you imagine your future self, you most want them to have...',
      choices: [
        { label: 'A life that is stable and free from constant precarity.',        value: 'security'   },
        { label: 'People around them who truly know and love them.',               value: 'connection' },
        { label: 'Continued growth — a life of becoming, not just being.',         value: 'growth'     },
      ],
    },
    {
      prompt: 'If not material wealth, the thing that would make you feel most rich is...',
      choices: [
        { label: 'A life that is secure, reliable, and without threat.',           value: 'security'   },
        { label: 'Being truly loved and truly knowing others.',                    value: 'connection' },
        { label: 'Having fully developed your capacity and become who you are meant to be.', value: 'growth' },
      ],
    },
    {
      prompt: 'The thing that most disrupts your peace is...',
      choices: [
        { label: 'Uncertainty — not knowing if things will be okay.',              value: 'security'   },
        { label: 'Disconnection — feeling far from the people who matter.',        value: 'connection' },
        { label: 'Stagnation — the feeling that you are not moving.',              value: 'growth'     },
      ],
    },
    {
      prompt: 'When you are most yourself, you are...',
      choices: [
        { label: 'Protected. Secure. Not under threat.',                           value: 'security'   },
        { label: 'In real contact with another person.',                           value: 'connection' },
        { label: 'In motion — learning, building, becoming.',                      value: 'growth'     },
      ],
    },
    {
      prompt: 'What you are most essentially seeking, underneath everything, is...',
      choices: [
        { label: 'Safety. The freedom that comes from not fearing loss.',          value: 'security'   },
        { label: 'Belonging. The certainty that you are truly known.',             value: 'connection' },
        { label: 'Expansion. The feeling that you are growing toward something real.', value: 'growth' },
      ],
    },
  ],
]

export default function DesireRealm() {
  const { dispatch, cycleCount } = useGame()
  const variant = VARIANTS[cycleCount % VARIANTS.length]

  const [index,    setIndex]    = useState(0)
  const [selected, setSelected] = useState(null)
  const [choosing, setChoosing] = useState(false)

  const q = variant[index]

  function handleSelect(choice) {
    if (choosing || selected !== null) return
    tapLight()
    setSelected(choice.value)
    setChoosing(true)
    dispatch({ type: 'TRACK_DESIRE', answer: choice.value })
    setTimeout(() => {
      if (index + 1 < variant.length) {
        setIndex(i => i + 1)
        setSelected(null)
        setChoosing(false)
      } else {
        dispatch({ type: 'NEXT_REALM' })
      }
    }, 900)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <p className="text-slate-500 text-xs mono text-center">{index + 1} / {variant.length}</p>

      <div className="strata-surface p-5">
        <p className="text-slate-300 text-sm leading-relaxed">{q.prompt}</p>
      </div>

      <div className="space-y-3">
        {q.choices.map(choice => (
          <button key={choice.value} onClick={() => handleSelect(choice)}
            className={`choice-card text-sm leading-relaxed ${selected === choice.value ? 'selected' : ''}`}>
            {choice.label}
          </button>
        ))}
      </div>
    </div>
  )
}
