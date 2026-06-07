import { useState } from 'react'
import { useGame } from '../context/GameContext.jsx'
import { tapLight } from '../lib/haptics.js'

const VARIANTS = [
  [
    {
      prompt: 'A colleague\'s work consistently falls short and it is affecting your team.',
      choices: [
        { label: 'You address it directly with them, privately and clearly.',      value: 'direct'     },
        { label: 'You find a constructive way to raise it as a team issue.',       value: 'diplomatic' },
        { label: 'You work around it and hope it resolves on its own.',            value: 'avoidant'   },
      ],
    },
    {
      prompt: 'Someone you care about says something you find genuinely offensive.',
      choices: [
        { label: 'You tell them, in the moment, that it landed badly.',            value: 'direct'     },
        { label: 'You wait for a calmer moment and bring it up carefully.',        value: 'diplomatic' },
        { label: 'You let it go. Confronting it does not seem worth the cost.',    value: 'avoidant'   },
      ],
    },
    {
      prompt: 'You are in a meeting and a decision is moving forward that you believe is wrong.',
      choices: [
        { label: 'You say so, directly, with your reasoning.',                     value: 'direct'     },
        { label: 'You ask questions that surface the problems without opposing outright.', value: 'diplomatic' },
        { label: 'You stay quiet. Raising it now feels futile.',                   value: 'avoidant'   },
      ],
    },
    {
      prompt: 'A friend owes you something — time, money, a favor — and has not acknowledged it.',
      choices: [
        { label: 'You bring it up directly. You say what you are owed.',           value: 'direct'     },
        { label: 'You find a natural opening and mention it gently.',              value: 'diplomatic' },
        { label: 'You let it drop. Asking feels like it would damage the relationship.', value: 'avoidant' },
      ],
    },
    {
      prompt: 'Your instinct when tension enters a room is to...',
      choices: [
        { label: 'Name it. Unnamed tension makes it worse.',                       value: 'direct'     },
        { label: 'Ease it. You find a way forward without escalating.',            value: 'diplomatic' },
        { label: 'Exit it or wait for it to pass.',                                value: 'avoidant'   },
      ],
    },
  ],
  [
    {
      prompt: 'You receive critical feedback that you believe is unfair.',
      choices: [
        { label: 'You respond directly, defending your position with evidence.',   value: 'direct'     },
        { label: 'You acknowledge what is valid, then clarify the rest calmly.',   value: 'diplomatic' },
        { label: 'You accept it outwardly and process your frustration privately.', value: 'avoidant'  },
      ],
    },
    {
      prompt: 'A decision was made that affects you, and you were not included.',
      choices: [
        { label: 'You go directly to the person who made it and say so.',          value: 'direct'     },
        { label: 'You raise it through the right channels, framing it as a process concern.', value: 'diplomatic' },
        { label: 'You absorb it. Pushing back does not feel worth the friction.',  value: 'avoidant'   },
      ],
    },
    {
      prompt: 'Two people you are close to are in conflict with each other.',
      choices: [
        { label: 'You tell both of them what you actually observe, even if uncomfortable.', value: 'direct' },
        { label: 'You listen carefully and help each understand the other\'s position.', value: 'diplomatic' },
        { label: 'You stay out of it entirely. Getting involved rarely helps.',    value: 'avoidant'   },
      ],
    },
    {
      prompt: 'A neighbor is consistently inconsiderate. It has been going on for weeks.',
      choices: [
        { label: 'You knock on their door and address it directly.',               value: 'direct'     },
        { label: 'You leave a polite note or find a low-friction way to raise it.', value: 'diplomatic' },
        { label: 'You adapt to it or minimize the impact on yourself.',            value: 'avoidant'   },
      ],
    },
    {
      prompt: 'When a conflict resolves, you feel best if...',
      choices: [
        { label: 'The issue was named and addressed plainly.',                     value: 'direct'     },
        { label: 'Everyone involved was heard and something shifted.',             value: 'diplomatic' },
        { label: 'The tension is simply gone, regardless of how.',                 value: 'avoidant'   },
      ],
    },
  ],
  [
    {
      prompt: 'You are asked for feedback on something you think is flawed.',
      choices: [
        { label: 'You give your honest assessment, clearly.',                      value: 'direct'     },
        { label: 'You make the critique useful without making it a verdict.',      value: 'diplomatic' },
        { label: 'You soften it significantly. Full honesty seems likely to cause harm.', value: 'avoidant' },
      ],
    },
    {
      prompt: 'Someone is repeatedly dominating a conversation, interrupting others.',
      choices: [
        { label: 'You say something in the moment. You name what is happening.',   value: 'direct'     },
        { label: 'You find a way to redirect that includes others without calling it out.', value: 'diplomatic' },
        { label: 'You wait it out. Calling it out feels more disruptive.',         value: 'avoidant'   },
      ],
    },
    {
      prompt: 'You realize mid-project that the approach is wrong. Others are invested.',
      choices: [
        { label: 'You stop and say so, even though it means disruption.',          value: 'direct'     },
        { label: 'You raise your concern as a question, letting others reach the same conclusion.', value: 'diplomatic' },
        { label: 'You continue. Reversing now creates more problems than it solves.', value: 'avoidant' },
      ],
    },
    {
      prompt: 'Your strongest instinct in conflict is...',
      choices: [
        { label: 'To say what is true and let the chips fall.',                    value: 'direct'     },
        { label: 'To find the version of the truth that can actually be heard.',   value: 'diplomatic' },
        { label: 'To preserve the relationship, even at the cost of the issue.',   value: 'avoidant'   },
      ],
    },
    {
      prompt: 'The thing conflict reveals about you most honestly is...',
      choices: [
        { label: 'That you would rather be clear than comfortable.',               value: 'direct'     },
        { label: 'That you believe how you say something shapes what gets heard.',  value: 'diplomatic' },
        { label: 'That you find conflict costly in ways that are hard to fully explain.', value: 'avoidant' },
      ],
    },
  ],
]

export default function ConflictRealm() {
  const { dispatch, variantSeed } = useGame()
  const variant = VARIANTS[variantSeed % VARIANTS.length]

  const [index,    setIndex]    = useState(0)
  const [selected, setSelected] = useState(null)
  const [choosing, setChoosing] = useState(false)

  const q = variant[index]

  function handleSelect(choice) {
    if (choosing || selected !== null) return
    tapLight()
    setSelected(choice.value)
    setChoosing(true)
    dispatch({ type: 'TRACK_CONFLICT', answer: choice.value })
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
