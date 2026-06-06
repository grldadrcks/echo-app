import { useState } from 'react'
import { useGame } from '../context/GameContext.jsx'
import { tapLight } from '../lib/haptics.js'

const VARIANTS = [
  [
    {
      prompt: 'You have two options: a guaranteed comfortable outcome, or a real chance at something significantly better — with real risk of worse.',
      choices: [
        { label: 'You choose the chance. Comfort is fine but possibility pulls harder.',                  value: 'tolerant'   },
        { label: 'You calculate the expected value and choose accordingly — it depends on the odds.',     value: 'calibrated' },
        { label: 'You take the guaranteed outcome. The downside is more vivid to you than the upside.',  value: 'averse'     },
      ],
    },
    {
      prompt: 'You are considering a significant change — career, relationship, location. You move toward it when...',
      choices: [
        { label: 'Something in you is ready. You tolerate not knowing how it will turn out.',             value: 'tolerant'   },
        { label: 'The evidence has accumulated enough that the risk seems worth it.',                     value: 'calibrated' },
        { label: 'You feel reasonably sure it will work. You need a clearer picture first.',              value: 'averse'     },
      ],
    },
    {
      prompt: 'An opportunity arrives with high upside and genuine uncertainty. Your first feeling is...',
      choices: [
        { label: 'Excitement — uncertainty and opportunity feel like the same thing to you.',             value: 'tolerant'   },
        { label: 'Interest, quickly followed by the instinct to gather more information.',                value: 'calibrated' },
        { label: 'Caution — you start with the ways it could go wrong.',                                  value: 'averse'     },
      ],
    },
    {
      prompt: 'A plan you trusted fails in an unexpected way. Your approach to future decisions...',
      choices: [
        { label: 'Changes little. Failure is information, not a reason to contract.',                     value: 'tolerant'   },
        { label: 'Updates somewhat — you recalibrate your model and adjust.',                             value: 'calibrated' },
        { label: 'Changes significantly — this is exactly the kind of thing you protect against.',        value: 'averse'     },
      ],
    },
    {
      prompt: 'When you imagine the paths not taken — the choices you did not make — you most often feel...',
      choices: [
        { label: 'Curious, maybe wistful. You are drawn to what might have been possible.',               value: 'tolerant'   },
        { label: 'Neutral — you made the calls that made sense at the time.',                             value: 'calibrated' },
        { label: 'Relieved — those paths had real risks you were right to avoid.',                        value: 'averse'     },
      ],
    },
  ],
  [
    {
      prompt: 'Your approach to new situations is most accurately...',
      choices: [
        { label: 'Move first, adjust later. Analysis paralysis is a real cost.',                          value: 'tolerant'   },
        { label: 'Gather just enough information to make a reasonable call, then act.',                   value: 'calibrated' },
        { label: 'Understand it fully before committing. You move slowly but less often backwards.',      value: 'averse'     },
      ],
    },
    {
      prompt: 'When you think about what holds people back, you believe the biggest culprit is usually...',
      choices: [
        { label: 'Fear of loss or failure — most people are too cautious.',                               value: 'tolerant'   },
        { label: 'Poor calibration — not thinking clearly about odds and expected value.',                 value: 'calibrated' },
        { label: 'Overconfidence — most people underestimate downside.',                                   value: 'averse'     },
      ],
    },
    {
      prompt: 'You are about to make an important decision and realize you have incomplete information. You...',
      choices: [
        { label: 'Proceed. Waiting for complete information means waiting forever.',                      value: 'tolerant'   },
        { label: 'Identify what information would meaningfully change your decision. Get only that.',     value: 'calibrated' },
        { label: 'Wait if you can. Incomplete information leads to preventable mistakes.',                value: 'averse'     },
      ],
    },
    {
      prompt: 'You are offered an investment with a 60% chance of tripling your money and 40% chance of losing everything.',
      choices: [
        { label: 'You lean in. 60% is better odds than most things in life.',                             value: 'tolerant'   },
        { label: 'You think carefully about your actual capacity to absorb the potential loss.',          value: 'calibrated' },
        { label: 'You pass. 40% chance of total loss is not something you are built for.',                value: 'averse'     },
      ],
    },
    {
      prompt: 'Your relationship to security is...',
      choices: [
        { label: 'Complex. You value it but will not sacrifice possibility for it.',                      value: 'tolerant'   },
        { label: 'Rational — you want enough security to function, no more than necessary.',              value: 'calibrated' },
        { label: 'Central. A stable life feels more valuable than a volatile one.',                       value: 'averse'     },
      ],
    },
  ],
  [
    {
      prompt: 'You are considering starting something new — a project, a venture, a relationship. How much certainty do you need?',
      choices: [
        { label: 'Very little. The doing is how you find out.',                                            value: 'tolerant'   },
        { label: 'Enough to believe the upside outweighs the downside.',                                  value: 'calibrated' },
        { label: 'Quite a bit. You prefer to understand what you are getting into.',                      value: 'averse'     },
      ],
    },
    {
      prompt: 'An important choice has to be made under time pressure. You...',
      choices: [
        { label: 'Decide and adapt. Speed and action are themselves a form of strategy.',                 value: 'tolerant'   },
        { label: 'Prioritize the key variables and make the best call available.',                        value: 'calibrated' },
        { label: 'Feel the pressure acutely — rushed decisions tend to be worse decisions.',              value: 'averse'     },
      ],
    },
    {
      prompt: 'How do you most naturally think about failure?',
      choices: [
        { label: 'As information. Failed experiments are how you learn what does not work.',              value: 'tolerant'   },
        { label: 'As data — some failures are preventable, some are not, and you update accordingly.',   value: 'calibrated' },
        { label: 'As something to take seriously and minimize — most failures are avoidable.',            value: 'averse'     },
      ],
    },
    {
      prompt: 'When comparing yourself to people who have taken big risks and won, you feel...',
      choices: [
        { label: 'Inspired. That kind of move is one you respect.',                                       value: 'tolerant'   },
        { label: 'Curious — you want to know how much was skill versus circumstance.',                    value: 'calibrated' },
        { label: 'Aware that for every visible success, there are invisible failures you never hear about.', value: 'averse' },
      ],
    },
    {
      prompt: 'The most honest thing about your relationship to uncertainty is...',
      choices: [
        { label: 'I function well in it. Not knowing does not stop me from moving.',                      value: 'tolerant'   },
        { label: 'I work with it — assess, decide, and accept that you never fully know.',                value: 'calibrated' },
        { label: 'I prefer to reduce it as much as I can before I act.',                                  value: 'averse'     },
      ],
    },
  ],
]

export default function RiskRealm() {
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
    dispatch({ type: 'TRACK_RISK', answer: choice.value })
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
