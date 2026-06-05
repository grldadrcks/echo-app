import { useState } from 'react'
import { useGame } from '../context/GameContext.jsx'

const VARIANTS = [
  [
    {
      bias: 'Anchoring Effect',
      explain: 'The first number presented influenced your estimate regardless of its relevance to actual value.',
      setup: 'A jacket is listed at $1,200 — marked down to $800. Is this a good deal?',
      options: [
        { label: 'Yes — a $400 saving is significant.',  value: 'anchored'   },
        { label: 'No — $800 is still expensive.',        value: 'resistant'  },
        { label: 'I need more context to decide.',       value: 'contextual' },
      ],
    },
    {
      bias: 'Sunk Cost Fallacy',
      explain: 'Past investment should not influence future decisions. The money is gone either way — only future value matters.',
      setup: 'You bought a $200 concert ticket. The day arrives and you feel unwell. No refund is possible. Do you go?',
      options: [
        { label: 'Yes — I already paid for it.',         value: 'sunk_cost'  },
        { label: 'No — my health matters more.',         value: 'rational'   },
        { label: 'It depends how unwell I feel.',        value: 'contextual' },
      ],
    },
    {
      bias: 'Availability Heuristic',
      explain: 'Plane crashes are rare but vivid. Car accidents are common but forgettable. Memorable events feel more likely.',
      setup: 'You just read a news report about a plane crash. Are you now more afraid to fly than to drive?',
      options: [
        { label: 'Yes — the story made it feel real.',     value: 'affected'   },
        { label: 'No — the statistics haven\'t changed.', value: 'rational'   },
        { label: 'Somewhat — but I know why.',             value: 'aware'      },
      ],
    },
  ],
  [
    {
      bias: 'Confirmation Bias',
      explain: 'We seek and share information that confirms what we already believe, often without scrutiny.',
      setup: 'You read an article that strongly confirms your existing political views. Do you share it without verifying its sources?',
      options: [
        { label: 'Yes — it aligns with what I already know to be true.',  value: 'confirming' },
        { label: 'No — I verify sources regardless of whether I agree.',  value: 'resistant'  },
        { label: 'I\'d skim it first for obvious red flags.',             value: 'contextual' },
      ],
    },
    {
      bias: 'Loss Aversion',
      explain: 'The pain of losing feels roughly twice as powerful as the pleasure of an equivalent gain. We take worse expected-value choices to avoid loss.',
      setup: 'You can keep $500 guaranteed, or flip a coin: heads you get $1,200, tails you get nothing. Which do you choose?',
      options: [
        { label: 'Keep the $500 — certain gain is better.',    value: 'loss_averse' },
        { label: 'Flip the coin — the expected value is higher.', value: 'rational'  },
        { label: 'It depends how much I need the money right now.', value: 'contextual' },
      ],
    },
    {
      bias: 'Fundamental Attribution Error',
      explain: 'We attribute others\' failures to their character, but our own failures to circumstances — consistently and without noticing.',
      setup: 'A colleague misses an important deadline. Your first instinct is:',
      options: [
        { label: 'They are probably disorganized or unreliable.',          value: 'fae'        },
        { label: 'Something must have gone wrong for them.',               value: 'empathetic' },
        { label: 'I\'d want to know the reason before forming a view.',   value: 'contextual' },
      ],
    },
  ],
  [
    {
      bias: 'Dunning-Kruger Effect',
      explain: 'Beginners often overestimate their competence because they lack the knowledge to perceive their own gaps.',
      setup: 'You\'ve just spent two weeks learning the basics of a complex field. How competent do you feel?',
      options: [
        { label: 'Quite competent — I understand the core ideas now.',      value: 'overestimate' },
        { label: 'Barely — the more I learn, the more I see I don\'t know.', value: 'accurate'   },
        { label: 'Somewhat — enough to contribute, not to lead.',           value: 'moderate'   },
      ],
    },
    {
      bias: 'Optimism Bias',
      explain: 'Most people believe they are more likely to succeed than statistics predict for their situation. The bias is near-universal.',
      setup: 'You\'re about to start a new project. How likely do you think it is to succeed?',
      options: [
        { label: 'Very likely — I wouldn\'t start it if I didn\'t believe in it.', value: 'optimistic'  },
        { label: 'Uncertain — projects fail for reasons outside my control.',       value: 'realistic'   },
        { label: 'Likely, but I\'ll build in contingencies.',                       value: 'calibrated'  },
      ],
    },
    {
      bias: 'In-Group Bias',
      explain: 'We consistently rate the work and character of our own group more favorably than equivalent outsiders, without realizing it.',
      setup: 'Your team and a rival team both submit work of equal quality for review. Whose do you instinctively trust more?',
      options: [
        { label: 'Mine — I know the people and the process behind it.',   value: 'ingroup'   },
        { label: 'Neither — I\'d evaluate the work itself.',              value: 'objective' },
        { label: 'Mine, but I\'d actively try to check that instinct.',   value: 'aware'     },
      ],
    },
  ],
]

export default function PsychologyRealm() {
  const { dispatch, cycleCount } = useGame()
  const variant = VARIANTS[cycleCount % VARIANTS.length]
  const [index,         setIndex]         = useState(0)
  const [phase,         setPhase]         = useState('choice')
  const [initialAnswer, setInitialAnswer] = useState(null)
  const [postAnswer,    setPostAnswer]    = useState(null)

  const scenario = variant[index]

  function handleInitial(opt) {
    if (initialAnswer !== null) return
    setInitialAnswer(opt.value)
    dispatch({ type: 'TRACK_PSYCHOLOGY_INITIAL', value: opt.value })
    setTimeout(() => setPhase('reveal'), 600)
  }

  function handlePostReveal(opt) {
    if (postAnswer !== null) return
    setPostAnswer(opt.value)
    dispatch({ type: 'TRACK_PSYCHOLOGY_POST', changed: opt.value !== initialAnswer })
    setTimeout(() => {
      if (index + 1 < variant.length) {
        setIndex(i => i + 1)
        setPhase('choice')
        setInitialAnswer(null)
        setPostAnswer(null)
      } else {
        dispatch({ type: 'NEXT_REALM' })
      }
    }, 1000)
  }

  if (phase === 'choice') {
    return (
      <div className="space-y-6 animate-fade-in">
        <p className="text-slate-500 text-xs mono text-center">{index + 1} / {variant.length}</p>
        <div className="strata-surface p-5">
          <p className="text-slate-200 text-sm leading-relaxed">{scenario.setup}</p>
        </div>
        <div className="space-y-3">
          {scenario.options.map(opt => (
            <button key={opt.value} onClick={() => handleInitial(opt)}
              className={`choice-card text-sm ${initialAnswer === opt.value ? 'selected' : ''}`}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    )
  }

  if (phase === 'reveal') {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="strata-surface p-5 border"
          style={{ borderColor: 'var(--realm-accent)', background: 'rgba(var(--realm-accent-rgb), 0.05)' }}>
          <p className="mono text-xs font-semibold mb-2" style={{ color: 'var(--realm-accent)' }}>
            {scenario.bias.toUpperCase()}
          </p>
          <p className="text-slate-300 text-sm leading-relaxed">{scenario.explain}</p>
        </div>
        <p className="text-slate-400 text-sm">Knowing this — would you change your answer?</p>
        <div className="space-y-3">
          {scenario.options.map(opt => (
            <button key={opt.value} onClick={() => handlePostReveal(opt)}
              className={`choice-card text-sm ${postAnswer === opt.value ? 'selected' : ''}`}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return null
}
