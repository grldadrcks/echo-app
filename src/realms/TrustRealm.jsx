import { useState } from 'react'
import { useGame } from '../context/GameContext.jsx'
import { tapLight } from '../lib/haptics.js'

const VARIANTS = [
  [
    {
      prompt: 'You meet someone new. Your default orientation toward them is...',
      choices: [
        { label: 'Open. You assume good faith until something demonstrates otherwise.',                   value: 'open'       },
        { label: 'Neutral. You reserve judgment until you have observed them over time.',                 value: 'earned'     },
        { label: 'Variable. It depends on the context, the stakes, and what your gut says.',              value: 'contextual' },
      ],
    },
    {
      prompt: 'Someone you do not know well needs a significant favor from you. You...',
      choices: [
        { label: 'Help, if you can. Most people are asking because they genuinely need it.',              value: 'open'       },
        { label: 'Help cautiously — you consider whether this creates a dynamic you want.',               value: 'earned'     },
        { label: 'Assess the situation. The nature of the favor and the person matters.',                  value: 'contextual' },
      ],
    },
    {
      prompt: 'You share something personal. Later, you learn they mentioned it to others. You...',
      choices: [
        { label: 'Feel the sting but try not to overgeneralize — this was a lapse, not a revelation.',   value: 'open'       },
        { label: 'Update significantly. This confirms trust must be demonstrated, not assumed.',           value: 'earned'     },
        { label: 'Adjust your assessment of this specific person and context going forward.',             value: 'contextual' },
      ],
    },
    {
      prompt: 'Your baseline assumption about strangers\' intentions is...',
      choices: [
        { label: 'Mostly benign. People are generally trying to do okay.',                                value: 'open'       },
        { label: 'Unknown and unproven. You do not assume ill intent, but you do not assume good either.',value: 'earned'     },
        { label: 'Contextually dependent — it varies by situation and what is at stake.',                 value: 'contextual' },
      ],
    },
    {
      prompt: 'The thing that most often updates your trust in someone is...',
      choices: [
        { label: 'Their behavior over time — but you start from a generous baseline.',                    value: 'open'       },
        { label: 'Consistent reliability in small things before you extend it to larger ones.',           value: 'earned'     },
        { label: 'Reading the situation — you calibrate separately for each relationship and context.',   value: 'contextual' },
      ],
    },
  ],
  [
    {
      prompt: 'You are entering a new group or team. Your instinct is to...',
      choices: [
        { label: 'Assume competence and good will until evidence suggests otherwise.',                    value: 'open'       },
        { label: 'Observe carefully before deciding who you can count on.',                               value: 'earned'     },
        { label: 'Read the room — different people will warrant different levels of trust.',               value: 'contextual' },
      ],
    },
    {
      prompt: 'A colleague promises to handle something important. You...',
      choices: [
        { label: 'Believe them and stop tracking it — they said they would.',                             value: 'open'       },
        { label: 'Follow up at a key point. Trust, but with a checkpoint built in.',                      value: 'earned'     },
        { label: 'Decide based on what you know about this specific person and the stakes.',              value: 'contextual' },
      ],
    },
    {
      prompt: 'Someone betrays your trust in a significant way. Going forward, your tendency is...',
      choices: [
        { label: 'To be hurt, but try not to let one experience close you generally.',                    value: 'open'       },
        { label: 'To extend trust more slowly across the board for a period.',                            value: 'earned'     },
        { label: 'To update specifically on this person and this type of situation, not globally.',       value: 'contextual' },
      ],
    },
    {
      prompt: 'Your instinct about human nature, generally, is...',
      choices: [
        { label: 'Most people are fundamentally decent and trying their best.',                           value: 'open'       },
        { label: 'People are mixed — capable of both, and you wait to see which shows up.',               value: 'earned'     },
        { label: 'People vary enormously — blanket assumptions either way seem naive.',                   value: 'contextual' },
      ],
    },
    {
      prompt: 'When you think about vulnerability — sharing something real — you...',
      choices: [
        { label: 'Do it fairly readily. Connection requires it, and you lean toward openness.',           value: 'open'       },
        { label: 'Share gradually, as trust is built through sustained reliability.',                     value: 'earned'     },
        { label: 'Calibrate carefully to the person, the context, and the stakes.',                       value: 'contextual' },
      ],
    },
  ],
  [
    {
      prompt: 'Someone you have just met gives you a strong recommendation. You...',
      choices: [
        { label: 'Take it seriously — they have no reason to mislead you.',                               value: 'open'       },
        { label: 'Note it and verify it independently before acting on it.',                              value: 'earned'     },
        { label: 'Weigh it alongside everything else you know about them and the situation.',             value: 'contextual' },
      ],
    },
    {
      prompt: 'In a negotiation or important interaction, your default posture is...',
      choices: [
        { label: 'Collaborative — you assume the other party is also looking for a good outcome.',        value: 'open'       },
        { label: 'Careful — you stay alert to what is not being said.',                                   value: 'earned'     },
        { label: 'Adaptive — you read the other person and adjust accordingly.',                          value: 'contextual' },
      ],
    },
    {
      prompt: 'Your most natural relationship to institutions — organizations, systems, authorities — is...',
      choices: [
        { label: 'Moderately trusting. They are imperfect but mostly trying.',                            value: 'open'       },
        { label: 'Skeptical. Trust in institutions is earned and regularly reassessed.',                  value: 'earned'     },
        { label: 'Contextual. Some deserve more trust than others — it varies.',                          value: 'contextual' },
      ],
    },
    {
      prompt: 'A friend says something that contradicts what you believed about them. You...',
      choices: [
        { label: 'Adjust your understanding — people are more complex than their moments.',               value: 'open'       },
        { label: 'Take note and watch to see if the pattern clarifies itself.',                           value: 'earned'     },
        { label: 'Update your read on them in this specific dimension, not globally.',                    value: 'contextual' },
      ],
    },
    {
      prompt: 'The truest thing about how you extend trust is...',
      choices: [
        { label: 'I give it freely and adjust if I am wrong. The cost of suspicion seems higher.',       value: 'open'       },
        { label: 'I hold it until it is earned. Some call this cold — I call it honest.',                value: 'earned'     },
        { label: 'I do not have a fixed rule. Trust is always situational for me.',                       value: 'contextual' },
      ],
    },
  ],
]

export default function TrustRealm() {
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
    dispatch({ type: 'TRACK_TRUST', answer: choice.value })
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
