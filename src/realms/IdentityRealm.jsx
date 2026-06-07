import { useState } from 'react'
import { useGame } from '../context/GameContext.jsx'
import { tapLight } from '../lib/haptics.js'

const VARIANTS = [
  [
    {
      prompt: 'When someone asks who you are, the first thing that comes to mind is...',
      choices: [
        { label: 'What you do or have built.',                                     value: 'achiever'     },
        { label: 'Who you are connected to.',                                      value: 'relational'   },
        { label: 'How you feel from the inside — your inner life.',               value: 'experiential' },
      ],
    },
    {
      prompt: 'A significant failure damages something. What hurts most?',
      choices: [
        { label: 'Your sense of capability and trajectory.',                       value: 'achiever'     },
        { label: 'How you show up for the people who depend on you.',              value: 'relational'   },
        { label: 'Your sense of who you are at the core.',                        value: 'experiential' },
      ],
    },
    {
      prompt: 'When you imagine a version of yourself you would be proud of...',
      choices: [
        { label: 'They have built, accomplished, or changed something real.',      value: 'achiever'     },
        { label: 'They are deeply connected and show up consistently for others.', value: 'relational'   },
        { label: 'They feel whole, honest, and aligned with who they actually are.', value: 'experiential' },
      ],
    },
    {
      prompt: 'The loss that would feel most threatening to your identity is...',
      choices: [
        { label: 'Your work, your status, or your sense of direction.',            value: 'achiever'     },
        { label: 'The people and relationships that define you.',                  value: 'relational'   },
        { label: 'Your connection to your own inner life.',                        value: 'experiential' },
      ],
    },
    {
      prompt: 'You feel most yourself when...',
      choices: [
        { label: 'You are creating, building, or making progress on something that matters.', value: 'achiever' },
        { label: 'You are in real connection with people you love.',               value: 'relational'   },
        { label: 'You are honest with yourself and living in alignment with how you feel.', value: 'experiential' },
      ],
    },
  ],
  [
    {
      prompt: 'If you had to describe your life\'s purpose in one sentence, it would be about...',
      choices: [
        { label: 'Creating, achieving, or leaving something behind.',              value: 'achiever'     },
        { label: 'Loving well and being loved — the depth of your connections.',   value: 'relational'   },
        { label: 'Understanding yourself and becoming who you are meant to be.',   value: 'experiential' },
      ],
    },
    {
      prompt: 'When you feel lost, what most reliably anchors you?',
      choices: [
        { label: 'Returning to work — creating, solving, building.',               value: 'achiever'     },
        { label: 'Being with the people you trust most.',                          value: 'relational'   },
        { label: 'Sitting with your own thoughts until something becomes clear.',  value: 'experiential' },
      ],
    },
    {
      prompt: 'A stranger respects you. What did they observe?',
      choices: [
        { label: 'What you have built or accomplished.',                           value: 'achiever'     },
        { label: 'How you treat people and the strength of your bonds.',           value: 'relational'   },
        { label: 'Your depth, authenticity, or self-awareness.',                   value: 'experiential' },
      ],
    },
    {
      prompt: 'When you imagine growing old, the fear that visits most often is...',
      choices: [
        { label: 'Not having done enough — not having mattered.',                  value: 'achiever'     },
        { label: 'Being disconnected from the people you love.',                   value: 'relational'   },
        { label: 'Not having truly known yourself.',                               value: 'experiential' },
      ],
    },
    {
      prompt: 'Your sense of self is most shaken when...',
      choices: [
        { label: 'You fail at something important to you.',                        value: 'achiever'     },
        { label: 'A significant relationship breaks down.',                        value: 'relational'   },
        { label: 'You act in ways that feel inconsistent with who you think you are.', value: 'experiential' },
      ],
    },
  ],
  [
    {
      prompt: 'What part of you most wants to be understood?',
      choices: [
        { label: 'What you are capable of and working toward.',                    value: 'achiever'     },
        { label: 'How much you care about the people in your life.',               value: 'relational'   },
        { label: 'Your inner world — how you actually think and feel.',            value: 'experiential' },
      ],
    },
    {
      prompt: 'In the story of your life, the protagonist is defined by...',
      choices: [
        { label: 'What they built, overcame, and achieved.',                       value: 'achiever'     },
        { label: 'Who they loved and who loved them back.',                        value: 'relational'   },
        { label: 'How they changed, understood themselves, and grew.',             value: 'experiential' },
      ],
    },
    {
      prompt: 'You would feel most hollow if...',
      choices: [
        { label: 'You went a long time without making progress on anything meaningful.', value: 'achiever' },
        { label: 'You were surrounded by people but truly close to no one.',       value: 'relational'   },
        { label: 'You stopped being honest with yourself.',                        value: 'experiential' },
      ],
    },
    {
      prompt: 'The question that troubles you most is...',
      choices: [
        { label: 'Am I doing enough? Will I look back and wish I had built more?', value: 'achiever'     },
        { label: 'Do the people I love actually feel loved?',                      value: 'relational'   },
        { label: 'Do I actually know who I am?',                                   value: 'experiential' },
      ],
    },
    {
      prompt: 'Your deepest loyalty is to...',
      choices: [
        { label: 'Your work and your sense of purpose.',                           value: 'achiever'     },
        { label: 'The people who matter to you.',                                  value: 'relational'   },
        { label: 'Your own inner truth.',                                          value: 'experiential' },
      ],
    },
  ],
]

export default function IdentityRealm() {
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
    dispatch({ type: 'TRACK_IDENTITY', answer: choice.value })
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
