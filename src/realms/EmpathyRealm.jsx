import { useState } from 'react'
import { useGame } from '../context/GameContext.jsx'
import { tapLight } from '../lib/haptics.js'

const VARIANTS = [
  [
    {
      prompt: 'Someone close to you is going through something painful. What happens in you?',
      choices: [
        { label: 'You try to understand what they must be feeling — you reason through their experience.', value: 'cognitive'  },
        { label: 'You feel it with them. Their pain has a physical weight in you.',                       value: 'affective'  },
        { label: 'You feel the pull of it but stay steady — being grounded is how you help most.',       value: 'contained'  },
      ],
    },
    {
      prompt: 'A stranger is clearly struggling — visibly distressed in a public space. Your first instinct is...',
      choices: [
        { label: 'To assess — what is happening, what might help, whether intervention is appropriate.',  value: 'cognitive'  },
        { label: 'To feel something immediately — distress, grief, or urgency.',                          value: 'affective'  },
        { label: 'To notice and stay composed — overwhelm will not help them.',                           value: 'contained'  },
      ],
    },
    {
      prompt: 'After a difficult conversation with someone in pain, you...',
      choices: [
        { label: 'Replay it, thinking about what they said and what it meant.',                           value: 'cognitive'  },
        { label: 'Carry the weight of it for hours. It stays with you.',                                  value: 'affective'  },
        { label: 'Process it and let it go — holding onto it serves no one.',                             value: 'contained'  },
      ],
    },
    {
      prompt: 'When someone tells you they are angry at you, your immediate response is...',
      choices: [
        { label: 'To think through whether their perception is accurate.',                                value: 'cognitive'  },
        { label: 'To feel it in your body before you can think clearly about it.',                        value: 'affective'  },
        { label: 'To stay calm and hear them out — reactivity makes it worse.',                           value: 'contained'  },
      ],
    },
    {
      prompt: 'The truest thing about how you experience other people\'s emotions is...',
      choices: [
        { label: 'I understand them clearly but tend to stay inside my own perspective.',                 value: 'cognitive'  },
        { label: 'They reach me directly. Other people\'s feelings are hard to keep at a distance.',     value: 'affective'  },
        { label: 'I register them and consciously manage how much I let them in.',                        value: 'contained'  },
      ],
    },
  ],
  [
    {
      prompt: 'You watch a film with a deeply sad scene. You...',
      choices: [
        { label: 'Note the craft of it — how they created the emotional effect.',                         value: 'cognitive'  },
        { label: 'Feel it fully. Sometimes you cry before you understand why.',                           value: 'affective'  },
        { label: 'Feel moved and then return to baseline fairly quickly.',                                 value: 'contained'  },
      ],
    },
    {
      prompt: 'In a difficult group dynamic, you are most naturally aware of...',
      choices: [
        { label: 'Who holds what position and the logic of each person\'s stance.',                      value: 'cognitive'  },
        { label: 'The emotional undercurrent — what people are feeling under what they are saying.',      value: 'affective'  },
        { label: 'The pattern — where the tension is and how to stabilize it.',                           value: 'contained'  },
      ],
    },
    {
      prompt: 'When someone shares something vulnerable with you, what leads your response?',
      choices: [
        { label: 'Your understanding of their situation — you think through what is true and useful.',    value: 'cognitive'  },
        { label: 'What you feel in response to them — you respond from the inside out.',                  value: 'affective'  },
        { label: 'The space between you — you try to hold it steady and give them room.',                 value: 'contained'  },
      ],
    },
    {
      prompt: 'Someone you are not close to is going through a significant loss. You...',
      choices: [
        { label: 'Feel genuine concern and think carefully about what would actually help.',               value: 'cognitive'  },
        { label: 'Feel something even for people you barely know — grief seems to reach you regardless.', value: 'affective'  },
        { label: 'Feel for them and maintain enough distance to stay useful.',                             value: 'contained'  },
      ],
    },
    {
      prompt: 'Empathy, for you, is most accurately described as...',
      choices: [
        { label: 'Understanding — a clear recognition of another person\'s experience.',                  value: 'cognitive'  },
        { label: 'Resonance — something that happens to you when you are around someone else\'s feeling.',value: 'affective'  },
        { label: 'Presence — showing up without losing yourself in the process.',                          value: 'contained'  },
      ],
    },
  ],
  [
    {
      prompt: 'A close friend describes a conflict they are in. You find yourself...',
      choices: [
        { label: 'Building a mental model of all the perspectives involved.',                             value: 'cognitive'  },
        { label: 'Feeling some version of what they feel — partial, but real.',                           value: 'affective'  },
        { label: 'Listening fully and holding your own reaction separately.',                              value: 'contained'  },
      ],
    },
    {
      prompt: 'You read about suffering happening far away. Your internal experience is...',
      choices: [
        { label: 'Thinking about causes, systemic factors, and what could be done.',                      value: 'cognitive'  },
        { label: 'Feeling it — sometimes more than you expect to.',                                        value: 'affective'  },
        { label: 'Feeling something, but staying functional — dwelling helps no one.',                    value: 'contained'  },
      ],
    },
    {
      prompt: 'The way you most often show up for people in pain is...',
      choices: [
        { label: 'With clarity — you help them understand what is happening and what might help.',         value: 'cognitive'  },
        { label: 'With presence — you absorb some of their feeling so they are less alone in it.',        value: 'affective'  },
        { label: 'With steadiness — you remain calm so they have something solid to lean on.',             value: 'contained'  },
      ],
    },
    {
      prompt: 'Someone disagrees with your perspective. How do you take in their view?',
      choices: [
        { label: 'Analytically — is their argument valid, what might they understand that you don\'t?',   value: 'cognitive'  },
        { label: 'You feel the weight of the disagreement before you can reason about it.',               value: 'affective'  },
        { label: 'You stay curious and stable — different views do not destabilize you.',                  value: 'contained'  },
      ],
    },
    {
      prompt: 'Your inner experience during an emotionally intense conversation is...',
      choices: [
        { label: 'Mostly thinking — tracking content, logic, and implication.',                           value: 'cognitive'  },
        { label: 'Mostly feeling — you are inside the emotion of the exchange.',                           value: 'affective'  },
        { label: 'Balanced — you feel what is happening but stay deliberately centered.',                  value: 'contained'  },
      ],
    },
  ],
]

export default function EmpathyRealm() {
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
    dispatch({ type: 'TRACK_EMPATHY', answer: choice.value })
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
