import { useState, useEffect } from 'react'
import { useGame, generateNarrative } from '../context/GameContext.jsx'

const INTRO_VARIANTS = [
  [
    { text: 'You have reached the final stratum.',               delay: 0    },
    { text: 'What follows is not a challenge.',                  delay: 1200 },
    { text: 'It is a reflection.',                              delay: 2200 },
    { text: 'Every choice you made has been recorded.',         delay: 3400 },
    { text: 'Every hesitation. Every reflex. Every pattern.',   delay: 4600 },
    { text: 'This is what we found.',                           delay: 5900 },
  ],
  [
    { text: 'You have returned to this stratum.',                delay: 0    },
    { text: 'The strata remember you.',                          delay: 1200 },
    { text: 'A second descent reveals what the first obscured.', delay: 2400 },
    { text: 'Your choices this cycle have been recorded.',       delay: 3800 },
    { text: 'Compare what you see now to who you were.',        delay: 5000 },
    { text: 'This is what remains.',                            delay: 6200 },
  ],
  [
    { text: 'Again.',                                            delay: 0    },
    { text: 'You descend because something is still unresolved.',delay: 1000 },
    { text: 'Or because you have changed.',                     delay: 2200 },
    { text: 'Or because you haven\'t.',                         delay: 3200 },
    { text: 'The strata don\'t judge the reason.',              delay: 4400 },
    { text: 'They only record what is true.',                   delay: 5600 },
  ],
]

function RadarChart({ profile }) {
  const SIZE   = 240
  const CENTER = SIZE / 2
  const RADIUS = 84

  const scores = {
    Mind:       profile.mindType      === 'balanced'    ? 0.5 : profile.mindType      === 'analytical'  ? 0.9 : 0.25,
    Values:     profile.valueSystem   === 'principled'  ? 0.9 : profile.valueSystem   === 'contextual'  ? 0.55 : 0.3,
    Attention:  profile.attention     === 'focused'     ? 0.9 : profile.attention     === 'selective'   ? 0.6 : 0.25,
    Awareness:  profile.biasAwareness === 'high'        ? 0.9 : profile.biasAwareness === 'moderate'   ? 0.55 : 0.2,
    Social:     profile.socialOrientation === 'independent' ? 0.9 : profile.socialOrientation === 'adaptive' ? 0.55 : 0.25,
    Attachment: profile.attachmentCore === 'wounds'     ? 0.3 : profile.attachmentCore === 'future'    ? 0.6 : 0.85,
  }

  const axes = Object.keys(scores)
  const N    = axes.length

  function pt(i, v) {
    const angle = (Math.PI * 2 * i) / N - Math.PI / 2
    return { x: CENTER + RADIUS * v * Math.cos(angle), y: CENTER + RADIUS * v * Math.sin(angle) }
  }

  const dataPath = axes.map((ax, i) => { const p = pt(i, scores[ax]); return `${p.x},${p.y}` }).join(' ')

  return (
    <div className="flex justify-center">
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} width={SIZE} height={SIZE} style={{ overflow: 'visible' }}>
        {[0.25, 0.5, 0.75, 1].map(ring => (
          <polygon key={ring}
            points={axes.map((_, i) => { const p = pt(i, ring); return `${p.x},${p.y}` }).join(' ')}
            fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        ))}
        {axes.map((_, i) => {
          const o = pt(i, 1)
          return <line key={i} x1={CENTER} y1={CENTER} x2={o.x} y2={o.y} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        })}
        <polygon points={dataPath}
          fill="rgba(var(--realm-accent-rgb), 0.1)"
          stroke="var(--realm-accent)" strokeWidth="1.5" strokeLinejoin="round" />
        {axes.map((ax, i) => {
          const p = pt(i, scores[ax])
          return <circle key={ax} cx={p.x} cy={p.y} r="3.5" fill="var(--realm-accent)" stroke="#000" strokeWidth="1.5" />
        })}
        {axes.map((ax, i) => {
          const lp = pt(i, 1.3)
          return (
            <text key={ax} x={lp.x} y={lp.y} textAnchor="middle" dominantBaseline="middle"
              fill="rgba(255,255,255,0.4)" fontSize="8.5" fontFamily="'Courier New', monospace" letterSpacing="0.06em">
              {ax.toUpperCase()}
            </text>
          )
        })}
      </svg>
    </div>
  )
}

export default function DetachmentRealm() {
  const { dispatch, profile, cycleCount } = useGame()
  const introLines = INTRO_VARIANTS[Math.min(cycleCount, INTRO_VARIANTS.length - 1)]

  const [phase,        setPhase]        = useState('intro')
  const [visibleLines, setVisibleLines] = useState(0)
  const [showReveal,   setShowReveal]   = useState(false)

  useEffect(() => {
    if (phase !== 'intro') return
    const timers = introLines.map((line, i) =>
      setTimeout(() => setVisibleLines(v => Math.max(v, i + 1)), line.delay)
    )
    const lastDelay = introLines[introLines.length - 1].delay
    const revealTimer = setTimeout(() => setShowReveal(true), lastDelay + 1400)
    return () => { timers.forEach(clearTimeout); clearTimeout(revealTimer) }
  }, [phase, introLines])

  if (phase === 'intro') {
    return (
      <div className="space-y-3 animate-fade-in">
        {introLines.slice(0, visibleLines).map((line, i) => (
          <p key={i} className={`mono text-sm ${i < 3 ? 'text-slate-300' : 'text-slate-400'}`}>
            {line.text}
            {i === visibleLines - 1 && <span className="cursor-blink" />}
          </p>
        ))}
        {showReveal && (
          <div className="pt-6 animate-fade-in">
            <button onClick={() => setPhase('reveal')} className="btn-realm mono tracking-widest uppercase text-sm">
              SEE YOUR PATTERN
            </button>
          </div>
        )}
      </div>
    )
  }

  if (phase === 'reveal' && profile) {
    const narrative = generateNarrative(profile)
    return (
      <div className="space-y-8 animate-fade-in">
        <RadarChart profile={profile} />
        <div className="space-y-4">
          {narrative.map((item, i) => (
            <div key={i} className="strata-surface p-4">
              <p className="mono text-xs font-semibold mb-2" style={{ color: 'var(--realm-accent)' }}>
                {item.label.toUpperCase()}
              </p>
              <p className="text-slate-300 text-sm leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
        <button onClick={() => setPhase('choice')} className="btn-ghost mono text-sm tracking-wide">
          Continue
        </button>
      </div>
    )
  }

  if (phase === 'choice') {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="strata-surface p-5">
          <p className="text-slate-300 text-sm leading-relaxed">
            You have seen what the strata revealed. What you do with this knowledge is the only thing left that belongs entirely to you.
          </p>
        </div>
        <div className="space-y-3">
          <button onClick={() => dispatch({ type: 'TRACK_FINAL_CHOICE', choice: 'acceptance' })}
            className="btn-realm mono tracking-wide text-sm">
            ACCEPT WHAT YOU'VE SEEN
          </button>
          <button onClick={() => dispatch({ type: 'TRACK_FINAL_CHOICE', choice: 'questioning' })}
            className="btn-ghost mono tracking-wide text-sm">
            QUESTION EVERYTHING
          </button>
        </div>
        <p className="text-slate-700 text-xs mono text-center">Both are valid. Both reveal something.</p>
      </div>
    )
  }

  return null
}
