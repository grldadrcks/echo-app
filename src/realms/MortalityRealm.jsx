import { useState } from 'react'
import { useGame } from '../context/GameContext.jsx'
import { tapLight } from '../lib/haptics.js'

const VARIANTS = [
  [
    {
      prompt: 'A doctor tells you that in the best case, you have fifteen years left. In the worst case, three.',
      choices: [
        { label: 'You start thinking about what you will leave behind.',           value: 'legacy'   },
        { label: 'You decide to stop postponing the things you have been waiting to do.', value: 'present'  },
        { label: 'You find yourself thinking about it as little as possible.',     value: 'avoidant' },
      ],
    },
    {
      prompt: 'You are offered a chance to write a letter that will not be opened until fifty years after your death.',
      choices: [
        { label: 'You write it. You want to be remembered honestly.',              value: 'legacy'   },
        { label: 'You write it, mostly to process what you feel now.',             value: 'present'  },
        { label: 'You decline. The exercise feels morbid.',                        value: 'avoidant' },
      ],
    },
    {
      prompt: 'A close friend dies unexpectedly. What changes in you first?',
      choices: [
        { label: 'You think about what you still want to accomplish.',             value: 'legacy'   },
        { label: 'You hold the people you love a little closer.',                  value: 'present'  },
        { label: 'You feel unsettled and return to routine as quickly as possible.', value: 'avoidant' },
      ],
    },
    {
      prompt: 'You are asked to design your own memorial. What matters most to you?',
      choices: [
        { label: 'That it reflects who you were and what you stood for.',          value: 'legacy'   },
        { label: 'That it feels true to the life you actually lived.',             value: 'present'  },
        { label: 'You would rather not think about this.',                         value: 'avoidant' },
      ],
    },
    {
      prompt: 'If you knew you had one year left, your first instinct would be to...',
      choices: [
        { label: 'Make sure the things you have built outlast you.',               value: 'legacy'   },
        { label: 'Be fully present with the people and experiences that matter.',  value: 'present'  },
        { label: 'Keep living as normally as possible.',                           value: 'avoidant' },
      ],
    },
  ],
  [
    {
      prompt: 'You are watching a documentary about someone who died young but left a lasting impact. You feel...',
      choices: [
        { label: 'Inspired. That kind of mark on the world matters.',              value: 'legacy'   },
        { label: 'Moved by how fully they seemed to live.',                        value: 'present'  },
        { label: 'Uneasy. You find yourself thinking about something else.',       value: 'avoidant' },
      ],
    },
    {
      prompt: 'What do you most want to be true about how you are remembered?',
      choices: [
        { label: 'That you built something that outlasted you.',                   value: 'legacy'   },
        { label: 'That you were genuinely present with the people you loved.',     value: 'present'  },
        { label: 'You try not to think about being remembered.',                   value: 'avoidant' },
      ],
    },
    {
      prompt: 'A terminally ill relative asks you to talk honestly about death.',
      choices: [
        { label: 'You engage — you talk about what they hoped to accomplish.',     value: 'legacy'   },
        { label: 'You engage — you focus on what their life meant.',               value: 'present'  },
        { label: 'You struggle. You keep the conversation light.',                 value: 'avoidant' },
      ],
    },
    {
      prompt: 'You discover a journal you wrote ten years ago. Most of it surprises you.',
      choices: [
        { label: 'You feel proud or troubled by what you were building toward.',   value: 'legacy'   },
        { label: 'You feel curious about who you were in those moments.',          value: 'present'  },
        { label: 'You feel unsettled. You close it.',                              value: 'avoidant' },
      ],
    },
    {
      prompt: 'When you imagine your final days, the thought that brings you peace is...',
      choices: [
        { label: 'That the work you did will continue without you.',               value: 'legacy'   },
        { label: 'That you were present for the things that mattered.',            value: 'present'  },
        { label: 'You avoid this thought.',                                        value: 'avoidant' },
      ],
    },
  ],
  [
    {
      prompt: 'Someone offers to make you famous after death — but it means accepting an ordinary life now.',
      choices: [
        { label: 'You accept. Legacy is the point.',                               value: 'legacy'   },
        { label: 'You decline. The life you live now is what matters.',            value: 'present'  },
        { label: 'You feel uncomfortable with the framing and try to move on.',    value: 'avoidant' },
      ],
    },
    {
      prompt: 'What motivates you more?',
      choices: [
        { label: 'Contributing something that will exist after you are gone.',     value: 'legacy'   },
        { label: 'Being fully alive to your own experience.',                      value: 'present'  },
        { label: 'Neither particularly resonates through that lens.',              value: 'avoidant' },
      ],
    },
    {
      prompt: 'A child asks you what death is.',
      choices: [
        { label: 'You explain it as something that gives life meaning — what you leave matters.', value: 'legacy' },
        { label: 'You explain it as a reason to be fully here while you are.',     value: 'present'  },
        { label: 'You give a vague answer and hope they move on.',                 value: 'avoidant' },
      ],
    },
    {
      prompt: 'You are given the option to write your own obituary today.',
      choices: [
        { label: 'You write it carefully. It clarifies what you are working toward.', value: 'legacy' },
        { label: 'You write it as a way of seeing your life clearly.',             value: 'present'  },
        { label: 'You decline. The exercise feels unnecessary.',                   value: 'avoidant' },
      ],
    },
    {
      prompt: 'The truest thing about how you relate to your own mortality is...',
      choices: [
        { label: 'It drives you. Knowing time is limited makes you want to build something real.', value: 'legacy' },
        { label: 'It grounds you. It keeps you present.',                          value: 'present'  },
        { label: 'You would rather not examine it too closely.',                   value: 'avoidant' },
      ],
    },
  ],
]

export default function MortalityRealm() {
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
    dispatch({ type: 'TRACK_MORTALITY', answer: choice.value })
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
