import { useState } from 'react'
import { useGame } from '../context/GameContext.jsx'
import { tapLight } from '../lib/haptics.js'

const VARIANTS = [
  [
    {
      id: 'honest_opinion',
      premise: 'A close friend asks for your honest opinion on a decision they\'ve already made and cannot reverse. Being honest will hurt them. Nothing will change.',
      prompt: 'What do you do?',
      options: [
        { label: 'Tell them. Truth isn\'t responsible for what people do with it.', value: 'principled'  },
        { label: 'Don\'t. Information that changes nothing only causes pain.',       value: 'utilitarian' },
        { label: 'Depends on whether they\'re asking to grow or seeking validation.', value: 'contextual' },
      ],
    },
    {
      id: 'take_credit',
      premise: 'You can prevent something bad from happening — but only by taking credit for work that isn\'t yours. No one will ever find out.',
      prompt: 'What do you do?',
      options: [
        { label: 'No. What you do in private is still what you do.',               value: 'principled'  },
        { label: 'Yes. Outcomes matter more than the mechanics that produce them.', value: 'utilitarian' },
        { label: 'Depends on how bad the thing is and how much credit you\'re claiming.', value: 'contextual' },
      ],
    },
    {
      id: 'share_truth',
      premise: 'You know something true about someone that would significantly change how others see them. They didn\'t ask you to keep it secret.',
      prompt: 'Do you share it?',
      options: [
        { label: 'Only if sharing it prevents a clear harm.',                  value: 'utilitarian' },
        { label: 'No. Information about someone belongs to them first.',       value: 'principled'  },
        { label: 'Depends what it is and who needs to know.',                  value: 'contextual'  },
      ],
    },
    {
      id: 'broken_rule',
      premise: 'A rule you believe in produces an outcome you find clearly wrong in this specific case. Following it will cause real harm.',
      prompt: 'Do you break it?',
      options: [
        { label: 'No. Rules matter because they hold even when they\'re inconvenient.', value: 'principled'  },
        { label: 'Yes. A rule that produces wrong outcomes has already failed.',         value: 'utilitarian' },
        { label: 'Depends on how wrong the outcome is and how often the rule works.',    value: 'contextual'  },
      ],
    },
  ],
  [
    {
      id: 'manipulative_mentor',
      premise: 'You discover that a mentor who shaped who you are was manipulating you the whole time — but the lessons they taught you are genuinely good.',
      prompt: 'What holds?',
      options: [
        { label: 'The lessons hold. Ideas aren\'t guilty by association.',                    value: 'principled'  },
        { label: 'Keep what works, discard what doesn\'t. Source is irrelevant.',             value: 'utilitarian' },
        { label: 'Some will hold, some won\'t. You\'d need to look at each one separately.', value: 'contextual'  },
      ],
    },
    {
      id: 'imperfect_charity',
      premise: 'A charitable organization you support does genuine good — but also uses some of your donations in ways you find clearly unethical.',
      prompt: 'What do you do?',
      options: [
        { label: 'Stop. You can\'t choose which part of your money they use.',              value: 'principled'  },
        { label: 'Continue if the good outweighs the harm. Perfection isn\'t available.',   value: 'utilitarian' },
        { label: 'Depends on the scale of both the good and the harm.',                     value: 'contextual'  },
      ],
    },
    {
      id: 'stranger_mistake',
      premise: 'You can intervene to prevent a stranger\'s significant mistake — but doing so means inserting yourself into something that isn\'t your concern.',
      prompt: 'Do you intervene?',
      options: [
        { label: 'Yes. A preventable harm is your business.',                 value: 'utilitarian' },
        { label: 'No. People have the right to make their own mistakes.',     value: 'principled'  },
        { label: 'Depends on how significant the mistake is and what it costs you.', value: 'contextual' },
      ],
    },
    {
      id: 'changed_promise',
      premise: 'You made a meaningful promise to someone who has since become a fundamentally different person. The original context no longer exists.',
      prompt: 'Are you still bound?',
      options: [
        { label: 'Yes. Promises are made to people, not versions of them.',    value: 'principled'  },
        { label: 'No. The context that gave the promise meaning is gone.',     value: 'utilitarian' },
        { label: 'Depends on what the promise was and how much they\'ve changed.', value: 'contextual' },
      ],
    },
  ],
  [
    {
      id: 'rejected_truth',
      premise: 'You can tell someone a true and important thing about themselves — something they need to hear. They will almost certainly reject it.',
      prompt: 'Do you say it?',
      options: [
        { label: 'Yes. What they do with it is their choice, not yours.',              value: 'principled'  },
        { label: 'Only if there\'s a real chance they\'ll hear it. Otherwise it\'s just pain.', value: 'utilitarian' },
        { label: 'Depends on the relationship and what\'s at stake.',                  value: 'contextual'  },
      ],
    },
    {
      id: 'enforce_policy',
      premise: 'You\'re asked to enforce a policy you believe is unjust, in a case where no one would know if you didn\'t.',
      prompt: 'What do you do?',
      options: [
        { label: 'Enforce it. You agreed to the role, not just the parts you like.', value: 'principled'  },
        { label: 'Don\'t. A policy that produces injustice should be resisted.',     value: 'utilitarian' },
        { label: 'Depends on how unjust and whether there\'s a better path.',        value: 'contextual'  },
      ],
    },
    {
      id: 'unwitnessed_harm',
      premise: 'Someone caused a real harm unintentionally. No one else witnessed it. The person who was harmed will never know. Do they need to be told?',
      prompt: 'Your position:',
      options: [
        { label: 'Yes. People deserve to know the effects of their actions.',           value: 'principled'  },
        { label: 'Only if telling them will change future behavior.',                   value: 'utilitarian' },
        { label: 'Depends on the harm and whether knowing would actually help anything.', value: 'contextual' },
      ],
    },
    {
      id: 'shared_credit',
      premise: 'You are given full credit for something that was partly someone else\'s work. They\'re unaware. Correcting the record has no practical consequence.',
      prompt: 'Do you correct it?',
      options: [
        { label: 'Yes. Credit belongs where the work was done.',                           value: 'principled'  },
        { label: 'Only if correcting it produces a meaningful outcome for them.',          value: 'utilitarian' },
        { label: 'Depends on how much was theirs and what correcting it would cost.',      value: 'contextual'  },
      ],
    },
  ],
]

export default function AbstractionRealm() {
  const { dispatch, variantSeed } = useGame()
  const variant = VARIANTS[variantSeed % VARIANTS.length]
  const [index,    setIndex]    = useState(0)
  const [selected, setSelected] = useState(null)

  const dilemma = variant[index]

  function handleSelect(opt) {
    if (selected !== null) return
    tapLight()
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
