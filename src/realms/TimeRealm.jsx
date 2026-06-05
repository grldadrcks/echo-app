import { useState } from 'react'
import { useGame } from '../context/GameContext.jsx'
import { tapLight } from '../lib/haptics.js'

const VARIANTS = [
  [
    {
      prompt: 'When you have an unstructured afternoon, your mind tends to drift toward...',
      choices: [
        { label: 'People and moments from your past.',                             value: 'past'    },
        { label: 'Whatever is directly in front of you.',                          value: 'present' },
        { label: 'Plans and possibilities you have not pursued yet.',              value: 'future'  },
      ],
    },
    {
      prompt: 'What motivates you most consistently?',
      choices: [
        { label: 'A sense of continuity with who you have been and what you have built.', value: 'past' },
        { label: 'The quality of your current experience.',                        value: 'present' },
        { label: 'The gap between where you are and where you could be.',          value: 'future'  },
      ],
    },
    {
      prompt: 'When you feel most like yourself, it is usually because...',
      choices: [
        { label: 'Something reminded you of a version of yourself you recognize as true.', value: 'past' },
        { label: 'You are fully absorbed in something happening right now.',       value: 'present' },
        { label: 'You are working toward something real.',                         value: 'future'  },
      ],
    },
    {
      prompt: 'The regrets that visit you most often are about...',
      choices: [
        { label: 'Things that happened and cannot be changed.',                    value: 'past'    },
        { label: 'I try not to carry regrets — they pull me out of the present.',  value: 'present' },
        { label: 'Opportunities not yet taken. Futures still possible.',           value: 'future'  },
      ],
    },
    {
      prompt: 'When someone you love is going through difficulty, you most naturally offer...',
      choices: [
        { label: 'Shared history — reminders of how they have survived before.',   value: 'past'    },
        { label: 'Presence — you just show up and sit with them.',                 value: 'present' },
        { label: 'Direction — you help them think toward what comes next.',        value: 'future'  },
      ],
    },
  ],
  [
    {
      prompt: 'How do you mostly experience nostalgia?',
      choices: [
        { label: 'Frequently and warmly. The past feels like home.',               value: 'past'    },
        { label: 'Rarely. You try to stay in what is happening now.',              value: 'present' },
        { label: 'Occasionally, but you are more drawn to what is ahead.',         value: 'future'  },
      ],
    },
    {
      prompt: 'When you imagine who you are, the clearest image is...',
      choices: [
        { label: 'The through-line of your history — the experiences that made you.', value: 'past' },
        { label: 'The person you are in this moment.',                             value: 'present' },
        { label: 'The person you are becoming.',                                   value: 'future'  },
      ],
    },
    {
      prompt: 'A long-term project stalls. Your first response is...',
      choices: [
        { label: 'To think about what worked before and return to it.',            value: 'past'    },
        { label: 'To get honest about what is actually happening right now.',      value: 'present' },
        { label: 'To re-examine the goal and whether it is still the right one.', value: 'future'  },
      ],
    },
    {
      prompt: 'The stories you tell most often are...',
      choices: [
        { label: 'Things that happened — formative moments, old memories.',        value: 'past'    },
        { label: 'What is going on in your life right now.',                       value: 'present' },
        { label: 'Things you are planning, building, or imagining.',               value: 'future'  },
      ],
    },
    {
      prompt: 'Your sense of identity feels most stable when it is anchored in...',
      choices: [
        { label: 'Where you came from and what you have been through.',            value: 'past'    },
        { label: 'Who you are right now, moment to moment.',                       value: 'present' },
        { label: 'Where you are going and what you are working toward.',           value: 'future'  },
      ],
    },
  ],
  [
    {
      prompt: 'When a relationship ends — any kind — what lingers longest?',
      choices: [
        { label: 'The memories. What it was.',                                     value: 'past'    },
        { label: 'The absence of what you had in the present.',                    value: 'present' },
        { label: 'The future you imagined that will not happen.',                  value: 'future'  },
      ],
    },
    {
      prompt: 'The thing you find most worth protecting is...',
      choices: [
        { label: 'What you have built and experienced.',                           value: 'past'    },
        { label: 'The quality of your present experience.',                        value: 'present' },
        { label: 'The possibility of who you could still become.',                 value: 'future'  },
      ],
    },
    {
      prompt: 'When you are uncertain about a decision, you most trust...',
      choices: [
        { label: 'Precedent — what has worked before.',                            value: 'past'    },
        { label: 'Your gut in the current moment.',                                value: 'present' },
        { label: 'The version of the choice that keeps the most doors open.',      value: 'future'  },
      ],
    },
    {
      prompt: 'Your inner monologue is most often...',
      choices: [
        { label: 'Revisiting conversations and moments that already happened.',    value: 'past'    },
        { label: 'Responding to what is immediately in front of you.',             value: 'present' },
        { label: 'Planning, anticipating, or imagining what could be.',            value: 'future'  },
      ],
    },
    {
      prompt: 'If you had to describe where you actually live — mentally, emotionally — it would be...',
      choices: [
        { label: 'In the past. That is where I feel most real.',                   value: 'past'    },
        { label: 'In the present. I try to stay here.',                            value: 'present' },
        { label: 'In the future. I am always reaching toward it.',                 value: 'future'  },
      ],
    },
  ],
]

export default function TimeRealm() {
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
    dispatch({ type: 'TRACK_TIME', answer: choice.value })
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
