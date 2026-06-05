import { useState } from 'react'
import { useGame } from '../context/GameContext.jsx'
import { tapLight } from '../lib/haptics.js'

const VARIANTS = [
  [
    {
      bias: 'Sunk Cost Fallacy',
      explain: 'The two years of work are gone regardless of what you do next. The competitors launched whether you continue or not. When past investment drives future decisions, you\'re solving for the past — not the future.',
      setup: 'You\'ve spent two years building a product. You\'ve just learned that three well-funded competitors launched something nearly identical last month.',
      options: [
        { label: 'Keep going — you\'ve built something real, and two years of knowledge matters.', value: 'invested' },
        { label: 'Pivot. Two years of work doesn\'t change what the market looks like today.',     value: 'rational' },
        { label: 'Depends on how differentiated your version actually is.',                        value: 'contextual' },
      ],
    },
    {
      bias: 'Negativity Bias',
      explain: 'Negative information is processed more deeply than equivalent positive information. Reading every critical review while skimming hundreds of positive ones means 1% of the evidence is doing most of the work. We evolved to weight threats — but that instinct distorts probability.',
      setup: 'A product has 400 five-star reviews and 4 one-star reviews. Before buying, you read all four one-star reviews in full.',
      options: [
        { label: 'Smart — you should know the failure cases before committing.',    value: 'affected'   },
        { label: 'Disproportionate — you\'re weighting 1% of evidence heavily.',   value: 'rational'   },
        { label: 'Reasonable, but I\'d weight them against the positive volume.',  value: 'aware'      },
      ],
    },
    {
      bias: 'Loss Aversion',
      explain: 'The expected value of the 50% chance is $500 — $100 more than the guaranteed option. But losses feel roughly twice as painful as equivalent gains feel good. The fear of getting nothing made $400 feel safer than the math suggests it should.',
      setup: 'You\'re offered a choice: keep $400 guaranteed, or flip a coin — heads gives you $1,000, tails gives you nothing.',
      options: [
        { label: 'Take the $400 — certainty has real value beyond the math.',      value: 'loss_averse' },
        { label: 'Flip the coin — the expected value is meaningfully higher.',     value: 'rational'    },
        { label: 'Depends how much I actually need the money right now.',          value: 'contextual'  },
      ],
    },
  ],
  [
    {
      bias: 'Confirmation Bias',
      explain: 'Once the belief formed, the search shifted. Mistakes became data points. Good work became background noise. Confirmation bias doesn\'t require lying — it just requires filtering. The belief shaped what you noticed, and what you noticed reinforced the belief.',
      setup: 'You\'ve formed the impression that a new colleague is underperforming. Over the next month, you notice every mistake they make and remember it clearly. You barely register when they do things well.',
      options: [
        { label: 'That\'s natural — you\'re paying attention to what matters.',          value: 'confirming' },
        { label: 'That\'s selective — you\'re building a case, not gathering evidence.', value: 'resistant'  },
        { label: 'Somewhat, but you\'d try to actively notice when they succeed too.',   value: 'aware'      },
      ],
    },
    {
      bias: 'Attribution Asymmetry',
      explain: 'Before the hospital appeared, the instinct was character judgment: reckless, inconsiderate. After, it shifted to situation: emergency, exception. We consistently apply this in reverse to strangers — assume character flaws, ignore context. With our own mistakes, we do the opposite.',
      setup: 'A driver cuts you off aggressively on the freeway. A moment later you see them speed into a hospital emergency entrance.',
      options: [
        { label: 'That changes things — you need context to judge behavior.',        value: 'empathetic' },
        { label: 'The driving was still dangerous, whatever the reason.',            value: 'principled' },
        { label: 'It explains the behavior, but doesn\'t make it less dangerous.',  value: 'aware'      },
      ],
    },
    {
      bias: 'In-Group Favoritism',
      explain: '"Fit" is often a socially acceptable word for familiarity. Shared background creates warmth that gets translated into professional confidence. The stronger candidate doesn\'t benefit from that warmth. The bias is invisible because it feels like intuition.',
      setup: 'Two candidates apply for a position. One attended the same university as you. Their qualifications are slightly weaker, but you feel a stronger sense of "fit" with them.',
      options: [
        { label: 'Fit matters — shared background often predicts real collaboration.',     value: 'ingroup'   },
        { label: 'That\'s a rationalization. Weaker qualifications are weaker.',          value: 'objective' },
        { label: 'I\'d try to separate the feeling of fit from the objective comparison.', value: 'aware'    },
      ],
    },
  ],
  [
    {
      bias: 'Planning Fallacy',
      explain: 'You\'ve run 40% over on similar estimates before. That\'s not bad luck — it\'s a pattern. We predict future performance based on best-case scenarios and ignore base rates, including our own track record. Expertise in a domain doesn\'t correct for the gap between predicted and actual time.',
      setup: 'You\'re estimating how long a project will take. On similar past projects, you\'ve consistently run about 40% over estimate. You give the same type of estimate you always give.',
      options: [
        { label: 'You know this work — your estimate reflects real experience.',              value: 'confident'  },
        { label: 'You\'re ignoring a pattern. Your estimates are systematically wrong.',     value: 'rational'   },
        { label: 'You\'d add a buffer, but still start with your instinctive estimate.',     value: 'aware'      },
      ],
    },
    {
      bias: 'Optimism Bias',
      explain: 'Most people who started what you\'re starting believed they\'d be the exception. That belief is partly what drove them — and partly why the failure rate is what it is. The bias isn\'t in the attempt. It\'s in not factoring the actual odds into the plan.',
      setup: 'You\'re starting something new. You know that most attempts like this fail. You believe yours will be different.',
      options: [
        { label: 'That\'s not bias — nobody starts things expecting to fail.',          value: 'optimistic' },
        { label: 'That\'s the bias itself. The statistics apply to you too.',           value: 'rational'   },
        { label: 'I\'d hold the belief and build contingency plans alongside it.',      value: 'calibrated' },
      ],
    },
    {
      bias: 'Status Quo Bias',
      explain: 'The pain of switching is immediate and concrete. The gains are future and diffuse. We weight present friction heavily and discount future benefit — even when the math is obvious. The status quo\'s main advantage is that it\'s already here.',
      setup: 'You\'ve been using the same approach for three years. A clearly better alternative exists. Switching would take two weeks of adjustment. You haven\'t switched.',
      options: [
        { label: 'Switching costs are real. Stability has compounding value too.',         value: 'status_quo' },
        { label: 'Two weeks of friction is stopping years of better outcomes.',            value: 'rational'   },
        { label: 'I\'d schedule the switch — but I understand why I haven\'t yet.',       value: 'aware'      },
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
    tapLight()
    setInitialAnswer(opt.value)
    dispatch({ type: 'TRACK_PSYCHOLOGY_INITIAL', value: opt.value })
    setTimeout(() => setPhase('reveal'), 600)
  }

  function handlePostReveal(opt) {
    if (postAnswer !== null) return
    tapLight()
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
              className={`choice-card text-sm leading-relaxed ${initialAnswer === opt.value ? 'selected' : ''}`}>
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
              className={`choice-card text-sm leading-relaxed ${postAnswer === opt.value ? 'selected' : ''}`}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return null
}
