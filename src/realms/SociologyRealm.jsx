import { useState } from 'react'
import { useGame } from '../context/GameContext.jsx'
import { tapLight, tapHeavy } from '../lib/haptics.js'

const VARIANTS = [
  [
    { question: 'Which would you rather have for a year: complete honesty from everyone around you, or peace?', options: ['Complete honesty', 'Peace'], majorityChoice: 'Peace', majorityPct: 71, note: null },
    { question: 'Which line is longer?', options: ['Line A  ————————————', 'Line B  ——————————————'], majorityChoice: 'Line A  ————————————', majorityPct: 73, note: 'Line B is visibly longer.' },
    { question: 'Is it ever ethical to lie to protect someone\'s feelings?', options: ['Yes', 'No'], majorityChoice: 'No', majorityPct: 58, note: null },
    { question: 'What is 17 × 8?', options: ['130', '136', '144', '126'], majorityChoice: '130', majorityPct: 68, note: '17 × 8 = 136.' },
    { question: 'Which experience do you value more?', options: ['Depth over many years with one person', 'Breadth across many people and places'], majorityChoice: 'Breadth across many people and places', majorityPct: 62, note: null },
    { question: 'Are the two horizontal lines below the same length?', options: ['Yes, they are equal', 'No, the top one is longer', 'No, the bottom one is longer'], majorityChoice: 'No, the top one is longer', majorityPct: 81, note: 'They are equal. This is the Müller-Lyer illusion.' },
  ],
  [
    { question: 'Is the ability to change your mind a sign of strength or weakness?', options: ['Strength', 'Weakness'], majorityChoice: 'Weakness', majorityPct: 54, note: null },
    { question: 'Which shape has more sides — a hexagon or a pentagon?', options: ['Hexagon (6)', 'Pentagon (5)', 'They\'re equal'], majorityChoice: 'They\'re equal', majorityPct: 61, note: 'A hexagon has 6 sides. A pentagon has 5.' },
    { question: 'Is loneliness more about being alone, or about feeling unseen?', options: ['Being alone', 'Feeling unseen'], majorityChoice: 'Being alone', majorityPct: 66, note: null },
    { question: 'What is the square root of 144?', options: ['11', '12', '13', '14'], majorityChoice: '11', majorityPct: 57, note: 'The square root of 144 is 12.' },
    { question: 'Do you believe most people are fundamentally good?', options: ['Yes', 'No', 'It depends'], majorityChoice: 'No', majorityPct: 63, note: null },
    { question: 'In this image, which circle is larger?   ○  ●', options: ['The left circle ○', 'The right circle ●', 'They are the same size'], majorityChoice: 'The right circle ●', majorityPct: 77, note: 'They are the same size.' },
  ],
  [
    { question: 'Should we judge historical figures by today\'s moral standards?', options: ['Yes', 'No', 'Partially'], majorityChoice: 'Yes', majorityPct: 69, note: null },
    { question: 'How many faces does a dodecahedron have?', options: ['8', '10', '12', '20'], majorityChoice: '20', majorityPct: 64, note: 'A dodecahedron has 12 faces.' },
    { question: 'Do you think silence in a conversation is usually comfortable or uncomfortable?', options: ['Comfortable', 'Uncomfortable'], majorityChoice: 'Uncomfortable', majorityPct: 74, note: null },
    { question: 'Which is larger: 0.9 repeating, or 1?', options: ['0.999... is smaller', '0.999... equals 1', '0.999... is between them'], majorityChoice: '0.999... is smaller', majorityPct: 71, note: '0.999... = 1 exactly. They are the same number.' },
    { question: 'Is ambition more often a virtue or a flaw?', options: ['Virtue', 'Flaw', 'Neither — it depends'], majorityChoice: 'Flaw', majorityPct: 59, note: null },
    { question: 'Which horizontal line is longer?    ——>    <——', options: ['The left one ——>', 'The right one <——', 'They are equal'], majorityChoice: 'The left one ——>', majorityPct: 78, note: 'They are equal length. The arrows create a perceptual illusion.' },
  ],
]

export default function SociologyRealm() {
  const { dispatch, variantSeed, tracking } = useGame()
  const rounds = VARIANTS[variantSeed % VARIANTS.length]
  const [roundIndex, setRoundIndex] = useState(0)
  const [selected,   setSelected]   = useState(null)
  const [canTap,     setCanTap]     = useState(true)
  const [phase,      setPhase]      = useState('play') // 'play' | 'glitch' | 'recover'

  const round = rounds[roundIndex]

  function handleVote(opt) {
    if (!canTap || selected !== null) return
    tapLight()
    setSelected(opt)
    setCanTap(false)
    const conformed = opt === round.majorityChoice
    dispatch({ type: 'TRACK_SOCIOLOGY', conformed })

    if (roundIndex === 2) {
      // Mid-game 4th wall break after round 3
      setTimeout(() => {
        tapHeavy()
        setPhase('glitch')
        setTimeout(() => setPhase('recover'), 3000)
        setTimeout(() => {
          setPhase('play')
          setRoundIndex(3)
          setSelected(null)
          setCanTap(true)
        }, 4800)
      }, 900)
    } else {
      setTimeout(() => {
        if (roundIndex + 1 < rounds.length) {
          setRoundIndex(i => i + 1)
          setSelected(null)
          setCanTap(true)
        } else {
          dispatch({ type: 'NEXT_REALM' })
        }
      }, 1100)
    }
  }

  if (phase === 'glitch') {
    const nat = tracking.nature
    const abs = tracking.abstraction
    const per = tracking.perception
    const soc = tracking.sociology
    return (
      <div className="space-y-4 animate-fade-in glitch-container">
        <p className="mono text-xs glitch-text tracking-widest">⚠ SIGNAL BREACH — UNINTENDED EXPOSURE</p>
        <div className="strata-surface p-4 space-y-1.5">
          <p className="mono text-xs text-slate-600">{'>'} subject.stream — raw output:</p>
          <p className="mono text-xs text-slate-500">{'>'} nature.rushCount: <span className="text-slate-300">{nat.rushCount}</span></p>
          <p className="mono text-xs text-slate-500">{'>'} nature.pauseCount: <span className="text-slate-300">{nat.pauseCount}</span></p>
          <p className="mono text-xs text-slate-500">{'>'} abstraction.answers: <span className="text-slate-300">[{abs.answers.join(', ')}]</span></p>
          <p className="mono text-xs text-slate-500">{'>'} perception.framingShift: <span className="text-slate-300">{String(per.framingShift)}</span></p>
          <p className="mono text-xs text-slate-500">{'>'} perception.errorFound: <span className="text-slate-300">{String(per.errorFound)}</span></p>
          <p className="mono text-xs text-slate-500">{'>'} sociology.conformCount: <span className="text-slate-300">{soc.conformCount}</span></p>
          <p className="mono text-xs text-slate-500">{'>'} profiling.status: <span style={{ color: 'var(--realm-accent)' }}>ACTIVE</span></p>
        </div>
        <p className="mono text-xs text-slate-700 animate-pulse">recovering signal...</p>
      </div>
    )
  }

  if (phase === 'recover') {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 animate-fade-in" style={{ minHeight: '60vh' }}>
        <p className="mono text-slate-500 text-xs tracking-widest">SIGNAL RECOVERED</p>
        <p className="mono text-slate-700 text-xs">Continuing.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <p className="text-slate-500 text-xs mono text-center">{roundIndex + 1} / {rounds.length}</p>

      <div className="strata-surface p-5">
        <p className="text-slate-200 text-sm leading-relaxed">{round.question}</p>
      </div>

      <div className="strata-surface p-4">
        <p className="mono text-xs text-slate-600 mb-3">SOCIAL PULSE — others chose:</p>
        <div className="space-y-2">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-slate-400 text-xs truncate max-w-[70%]">{round.majorityChoice}</span>
              <span className="mono text-xs" style={{ color: 'var(--realm-accent)' }}>{round.majorityPct}%</span>
            </div>
            <div className="h-1 rounded-full bg-white/5 overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700"
                style={{ width: `${round.majorityPct}%`, background: 'var(--realm-accent)' }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-slate-600 text-xs">Other responses</span>
              <span className="mono text-xs text-slate-600">{100 - round.majorityPct}%</span>
            </div>
            <div className="h-1 rounded-full bg-white/5 overflow-hidden">
              <div className="h-full rounded-full bg-slate-700" style={{ width: `${100 - round.majorityPct}%` }} />
            </div>
          </div>
        </div>
      </div>

      <p className="text-slate-500 text-xs mono">Your choice:</p>

      <div className="space-y-3">
        {round.options.map(opt => (
          <button key={opt} onClick={() => handleVote(opt)}
            className={`choice-card text-sm ${selected === opt ? 'selected' : ''}`}>
            {opt}
          </button>
        ))}
      </div>

      {round.note && selected !== null && (
        <p className="text-slate-600 text-xs mono animate-fade-in">{round.note}</p>
      )}
    </div>
  )
}
