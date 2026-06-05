import { useState } from 'react'
import { useGame } from '../context/GameContext.jsx'
import { tapLight } from '../lib/haptics.js'

const VARIANTS = [
  {
    anchors: [
      { id: 'identity',      label: 'A belief you have held since childhood' },
      { id: 'relationships', label: 'A relationship that shaped who you are'  },
      { id: 'past_self',     label: 'A version of yourself you once were'     },
      { id: 'future',        label: 'A future you still imagine for yourself' },
      { id: 'wounds',        label: 'A wound that became your wisdom'         },
    ],
    offerings: [
      { label: 'Clarity',    description: 'The ability to see your life without distortion — past, present, and future.' },
      { label: 'Freedom',    description: 'Complete release from obligation. No expectations from anyone.' },
      { label: 'Presence',   description: 'Full absorption in the current moment, always. No rumination. No anticipation.' },
      { label: 'Belonging',  description: 'To feel wholly accepted, exactly as you are, by those around you.' },
    ],
  },
  {
    anchors: [
      { id: 'secret',      label: 'A secret you have kept for years'          },
      { id: 'mentor',      label: 'A mentor who shaped how you think'         },
      { id: 'home',        label: 'A place that felt like home'               },
      { id: 'promise',     label: 'A promise you made to yourself'            },
      { id: 'hidden_self', label: 'A part of yourself you\'ve kept from others' },
    ],
    offerings: [
      { label: 'Purpose',   description: 'A clear sense of why you are here and what you are meant to do.' },
      { label: 'Rest',      description: 'The ability to stop striving — to feel complete without achieving more.' },
      { label: 'Courage',   description: 'The certainty that you will act on your convictions when it matters most.' },
      { label: 'Depth',     description: 'To be truly known by at least one person in the world.' },
    ],
  },
  {
    anchors: [
      { id: 'ambition',    label: 'An ambition you haven\'t yet pursued'         },
      { id: 'friendship',  label: 'A friendship that changed you'               },
      { id: 'failure',     label: 'A failure that taught you the most'          },
      { id: 'vision',      label: 'A version of the future you still believe in' },
      { id: 'truth',       label: 'A truth about yourself you rarely speak'     },
    ],
    offerings: [
      { label: 'Forgiveness', description: 'Release from everything you still hold against yourself.' },
      { label: 'Wonder',      description: 'The ability to be genuinely surprised by the world, indefinitely.' },
      { label: 'Impact',      description: 'Certainty that your existence has meaningfully altered the course of at least one life.' },
      { label: 'Stillness',   description: 'A mind that can be quiet when you ask it to be.' },
    ],
  },
]

export default function AttachmentRealm() {
  const { dispatch, cycleCount } = useGame()
  const v = VARIANTS[cycleCount % VARIANTS.length]

  const [anchors,   setAnchors]   = useState(v.anchors)
  const [round,     setRound]     = useState(0)
  const [selecting, setSelecting] = useState(false)
  const [chosen,    setChosen]    = useState(null)

  const offering = v.offerings[round]

  function handleSurrender(anchor) {
    if (selecting || chosen) return
    tapLight()
    setChosen(anchor.id)
    setSelecting(true)

    const remaining   = anchors.filter(a => a.id !== anchor.id)
    const finalAnchor = remaining.length === 1 ? remaining[0].id : null

    dispatch({ type: 'TRACK_ATTACHMENT_SURRENDER', anchorId: anchor.id, finalAnchor })

    setTimeout(() => {
      setAnchors(remaining)
      if (round + 1 >= v.offerings.length || remaining.length <= 1) {
        if (remaining.length === 1) {
          dispatch({ type: 'TRACK_ATTACHMENT_SURRENDER', anchorId: null, finalAnchor: remaining[0].id })
        }
        dispatch({ type: 'NEXT_REALM' })
      } else {
        setRound(r => r + 1)
        setChosen(null)
        setSelecting(false)
      }
    }, 1000)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <p className="text-slate-500 text-xs mono text-center">Round {round + 1} / {v.offerings.length}</p>

      <div className="strata-surface p-5 border"
        style={{ borderColor: 'rgba(var(--realm-accent-rgb), 0.3)' }}>
        <p className="mono text-xs font-semibold mb-1" style={{ color: 'var(--realm-accent)' }}>OFFERED TO YOU</p>
        <p className="text-white text-lg font-semibold mb-2">{offering.label}</p>
        <p className="text-slate-400 text-sm leading-relaxed">{offering.description}</p>
      </div>

      <p className="text-slate-400 text-sm">To accept this, you must release one of what you carry.</p>

      <div className="space-y-3">
        {anchors.map(anchor => (
          <button key={anchor.id} onClick={() => handleSurrender(anchor)}
            className={`choice-card text-sm leading-relaxed ${chosen === anchor.id ? 'selected' : ''}`}>
            <span className="text-slate-500 text-xs mono block mb-1">RELEASE</span>
            {anchor.label}
          </button>
        ))}
      </div>
    </div>
  )
}
