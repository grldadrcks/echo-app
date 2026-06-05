import { useState } from 'react'
import { useGame } from '../context/GameContext.jsx'
import { tapLight } from '../lib/haptics.js'

const VARIANTS = [
  [
    {
      prompt: 'Something goes wrong that significantly affects you. Your first instinct is to ask...',
      choices: [
        { label: 'What did I do — or not do — that contributed to this?',         value: 'internal'    },
        { label: 'What circumstances made this likely to happen?',                 value: 'contextual'  },
        { label: 'How did the dynamics between the people involved shape this?',   value: 'collective'  },
      ],
    },
    {
      prompt: 'A major success happens in your life. You feel...',
      choices: [
        { label: 'That you earned it through choices and sustained effort.',       value: 'internal'    },
        { label: 'Grateful for the conditions that made it possible — timing, luck, opportunity.', value: 'contextual' },
        { label: 'That it happened because the people around you made it possible.', value: 'collective' },
      ],
    },
    {
      prompt: 'When you face a difficult goal, your core belief is...',
      choices: [
        { label: 'If you work hard enough and adjust well enough, you can make it happen.', value: 'internal' },
        { label: 'Some outcomes are available to you in these conditions, and others are not.', value: 'contextual' },
        { label: 'The right people and right conditions have to align — you can\'t force it alone.', value: 'collective' },
      ],
    },
    {
      prompt: 'When a situation is beyond your control, you...',
      choices: [
        { label: 'Find the smallest thing you can influence and work on that.',    value: 'internal'    },
        { label: 'Accept what cannot be changed and adjust to the new reality.',   value: 'contextual'  },
        { label: 'Focus on what can be built or navigated together with others.',  value: 'collective'  },
      ],
    },
    {
      prompt: 'The story you most naturally tell about your life is...',
      choices: [
        { label: 'One of choices, growth, and ownership — you are the author.',   value: 'internal'    },
        { label: 'One of navigation — moving through conditions you did not design.', value: 'contextual' },
        { label: 'One of connection — shaped by who you were with and how those bonds formed you.', value: 'collective' },
      ],
    },
  ],
  [
    {
      prompt: 'You are given credit for something that had many contributors. You feel...',
      choices: [
        { label: 'Appropriately recognized — your contribution was real and significant.', value: 'internal' },
        { label: 'Slightly uncomfortable — the conditions mattered as much as you did.', value: 'contextual' },
        { label: 'Uneasy — it was a collective effort and the credit should reflect that.', value: 'collective' },
      ],
    },
    {
      prompt: 'When you fail at something, the explanation that feels most true is...',
      choices: [
        { label: 'I did not prepare enough, choose well enough, or adjust fast enough.', value: 'internal' },
        { label: 'The conditions were not favorable — timing, resources, or information were wrong.', value: 'contextual' },
        { label: 'The people involved were not aligned in the right way.',         value: 'collective'  },
      ],
    },
    {
      prompt: 'What most determines whether your efforts succeed?',
      choices: [
        { label: 'The quality of your choices and the persistence you bring.',     value: 'internal'    },
        { label: 'The context you are operating in — its constraints and openings.', value: 'contextual' },
        { label: 'The relationships you have and how aligned everyone is.',        value: 'collective'  },
      ],
    },
    {
      prompt: 'Looking at your life so far, the most accurate description of how you got here is...',
      choices: [
        { label: 'Mostly through choices I made and habits I built.',              value: 'internal'    },
        { label: 'A combination of effort and the circumstances I was dealt.',     value: 'contextual'  },
        { label: 'Shaped heavily by the people I was surrounded by.',              value: 'collective'  },
      ],
    },
    {
      prompt: 'When you think about changing something significant in your life, your instinct is...',
      choices: [
        { label: 'Decide and act — the rest follows from that.',                   value: 'internal'    },
        { label: 'Read the conditions first — find the right moment and opening.', value: 'contextual'  },
        { label: 'Build the relationships and alignment that make it possible.',    value: 'collective'  },
      ],
    },
  ],
  [
    {
      prompt: 'Someone achieves something remarkable despite difficult circumstances. You are most moved by...',
      choices: [
        { label: 'Their will — they chose not to let the circumstances determine them.', value: 'internal' },
        { label: 'The circumstances they overcame — context shapes so much of what is possible.', value: 'contextual' },
        { label: 'The people around them — who helped them through.',              value: 'collective'  },
      ],
    },
    {
      prompt: 'If you could give someone one piece of advice for navigating a hard situation, it would be...',
      choices: [
        { label: 'Decide what you can control and own that completely.',           value: 'internal'    },
        { label: 'Read the situation clearly and find the openings within it.',    value: 'contextual'  },
        { label: 'Find the right people and build toward it together.',            value: 'collective'  },
      ],
    },
    {
      prompt: 'When something goes well in your life, the first thing you feel is...',
      choices: [
        { label: 'Pride — you made the right calls.',                              value: 'internal'    },
        { label: 'Relief — the conditions aligned.',                               value: 'contextual'  },
        { label: 'Gratitude — you had the right people with you.',                 value: 'collective'  },
      ],
    },
    {
      prompt: 'Your deepest assumption about how the world works is...',
      choices: [
        { label: 'What you do largely determines what happens to you.',            value: 'internal'    },
        { label: 'Circumstances and systems shape most of what is possible for most people.', value: 'contextual' },
        { label: 'Everything is relational — outcomes emerge from connections.',   value: 'collective'  },
      ],
    },
    {
      prompt: 'The most honest sentence about your relationship to agency is...',
      choices: [
        { label: 'I believe I am largely the author of my outcomes.',              value: 'internal'    },
        { label: 'I believe I navigate conditions I mostly did not choose.',       value: 'contextual'  },
        { label: 'I believe we are all shaped and enabled by each other.',         value: 'collective'  },
      ],
    },
  ],
]

export default function AgencyRealm() {
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
    dispatch({ type: 'TRACK_AGENCY', answer: choice.value })
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
