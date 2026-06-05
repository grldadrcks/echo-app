import { useState } from 'react'
import { useGame } from '../context/GameContext.jsx'

const VARIANTS = [
  [
    {
      id: 'trolley',
      premise: 'A runaway trolley will kill five people. You can pull a lever to divert it, killing one instead. You pull it.',
      prompt: 'What best describes your reasoning?',
      options: [
        { label: 'Five deaths prevented. The math is clear.',   value: 'utilitarian' },
        { label: 'I acted. That act belongs to me now.',        value: 'principled'  },
        { label: 'It depends on who the one person is.',        value: 'contextual'  },
      ],
    },
    {
      id: 'theseus',
      premise: 'Every plank of a ship is replaced over time. When the last original plank is gone — is it still the same ship?',
      prompt: 'Which position do you hold?',
      options: [
        { label: 'No. Identity requires material continuity.',   value: 'principled'  },
        { label: 'Yes. What matters is the function it serves.', value: 'utilitarian' },
        { label: 'It depends on who is asking and why.',         value: 'contextual'  },
      ],
    },
    {
      id: 'sorites',
      premise: 'Remove one grain from a heap of sand. Still a heap. Keep removing — when does it stop being a heap?',
      prompt: 'Your view:',
      options: [
        { label: 'The line is arbitrary but must be drawn.',     value: 'principled'  },
        { label: 'There is no heap — only grains and context.',  value: 'contextual'  },
        { label: 'A heap is defined by its use, not its count.', value: 'utilitarian' },
      ],
    },
    {
      id: 'identity',
      premise: 'You wake up tomorrow with all your memories, but a different body, name, and history. Are you still you?',
      prompt: 'What do you believe?',
      options: [
        { label: 'Memory is identity. Yes.',                    value: 'principled'  },
        { label: 'What I do next is who I am.',                 value: 'utilitarian' },
        { label: 'The question assumes identity is fixed.',     value: 'contextual'  },
      ],
    },
  ],
  [
    {
      id: 'experience_machine',
      premise: 'A machine can give you any experience indistinguishable from reality — your ideal life, forever. Do you plug in?',
      prompt: 'Your position:',
      options: [
        { label: 'Yes — if the experience is real to me, it is real.',              value: 'utilitarian' },
        { label: 'No — something about genuine engagement with reality matters.',   value: 'principled'  },
        { label: 'It depends entirely on what I\'d be leaving behind.',             value: 'contextual'  },
      ],
    },
    {
      id: 'utility_monster',
      premise: 'Imagine a being that gets vastly more pleasure from resources than anyone else. Strict utilitarianism says give it everything. Does that feel right?',
      prompt: 'What do you think?',
      options: [
        { label: 'Yes — if it maximizes total happiness, logic demands it.',         value: 'utilitarian' },
        { label: 'No — there must be rights that override total utility.',           value: 'principled'  },
        { label: 'The scenario reveals a flaw in the framework, not a rule to follow.', value: 'contextual' },
      ],
    },
    {
      id: 'teleporter',
      premise: 'A teleporter scans you, destroys the original, and assembles an identical copy at the destination with all your memories. Is the copy you?',
      prompt: 'Your answer:',
      options: [
        { label: 'No — the original was destroyed. The copy is someone new.',             value: 'principled'  },
        { label: 'Yes — if they function as me in every way, they are me.',               value: 'utilitarian' },
        { label: 'The answer depends on whether consciousness can survive discontinuity.', value: 'contextual'  },
      ],
    },
    {
      id: 'moral_luck',
      premise: 'Two drivers run red lights while drunk. One hits no one. The other kills a pedestrian. Should they be judged differently?',
      prompt: 'What is right?',
      options: [
        { label: 'No — the moral failure is identical. Luck shouldn\'t change judgment.', value: 'principled'  },
        { label: 'Yes — outcomes matter. We live in a world of consequences.',             value: 'utilitarian' },
        { label: 'Yes and no — intent and outcome both carry weight.',                     value: 'contextual'  },
      ],
    },
  ],
  [
    {
      id: 'veil',
      premise: 'You don\'t know whether you\'ll be born rich or poor, majority or minority. Behind this veil of ignorance, what kind of society do you design?',
      prompt: 'Your choice:',
      options: [
        { label: 'One that maximizes the average quality of life across everyone.',          value: 'utilitarian' },
        { label: 'One that guarantees the best possible outcome for the worst-off.',         value: 'principled'  },
        { label: 'One with strong basic rights, then individual freedom for the rest.',      value: 'contextual'  },
      ],
    },
    {
      id: 'violinist',
      premise: 'You wake up connected to a dying violinist who needs your kidneys for nine months. Disconnecting kills him. Are you obligated to stay?',
      prompt: 'What do you believe?',
      options: [
        { label: 'No — you have the right to your own body, even to save another.',                      value: 'principled'  },
        { label: 'Yes — the outcome of his death outweighs nine months of discomfort.',                  value: 'utilitarian' },
        { label: 'It depends on how you came to be connected and what obligations flow from that.',       value: 'contextual'  },
      ],
    },
    {
      id: 'simulation',
      premise: 'Evidence suggests our universe might be a simulation. If true, does that change the moral weight of your actions?',
      prompt: 'Your view:',
      options: [
        { label: 'No — consequences are real to those who experience them.',                      value: 'utilitarian' },
        { label: 'No — moral duties don\'t depend on the substrate of reality.',                  value: 'principled'  },
        { label: 'It raises questions worth sitting with, even without changing behavior.',        value: 'contextual'  },
      ],
    },
    {
      id: 'surprise_exam',
      premise: 'A teacher says there will be a surprise exam next week. A student logically proves this is impossible. The exam happens Wednesday and the student is surprised. What failed?',
      prompt: 'What do you think broke down?',
      options: [
        { label: 'The student\'s logic was correct but missed something about knowledge itself.',  value: 'principled'  },
        { label: 'The teacher\'s statement was inherently self-contradictory.',                    value: 'utilitarian' },
        { label: 'Logic has limits when applied to self-referential claims about knowledge.',      value: 'contextual'  },
      ],
    },
  ],
]

export default function AbstractionRealm() {
  const { dispatch, cycleCount } = useGame()
  const variant = VARIANTS[cycleCount % VARIANTS.length]
  const [index,    setIndex]    = useState(0)
  const [selected, setSelected] = useState(null)

  const dilemma = variant[index]

  function handleSelect(opt) {
    if (selected !== null) return
    setSelected(opt.value)
    dispatch({ type: 'TRACK_ABSTRACTION_ANSWER', value: opt.value })
    setTimeout(() => {
      if (index + 1 < variant.length) {
        setIndex(i => i + 1)
        setSelected(null)
      } else {
        dispatch({ type: 'NEXT_REALM' })
      }
    }, 1000)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <p className="text-slate-500 text-xs mono text-center">{index + 1} / {variant.length}</p>

      <div className="strata-surface p-5">
        <p className="text-slate-200 text-sm leading-relaxed">{dilemma.premise}</p>
      </div>

      <p className="text-slate-500 text-xs mono">{dilemma.prompt}</p>

      <div className="space-y-3">
        {dilemma.options.map(opt => (
          <button key={opt.value} onClick={() => handleSelect(opt)}
            className={`choice-card text-sm leading-relaxed ${selected === opt.value ? 'selected' : ''}`}>
            {opt.label}
          </button>
        ))}
      </div>

      <p className="text-slate-700 text-xs mono text-center">There are no correct answers.</p>
    </div>
  )
}
