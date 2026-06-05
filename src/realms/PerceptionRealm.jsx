import { useState } from 'react'
import { useGame } from '../context/GameContext.jsx'

const VARIANTS = [
  {
    attention: {
      instruction: 'Read carefully. Count how many times the word "the" appears.',
      passage: 'The wind moved through the valley quietly. In the distance, the mountains stood unmoved. A figure crossed the bridge near the old mill, the sound of water filling the air.',
      correctCount: 7,
      question: 'How many times did the word "the" appear?',
      options: [5, 6, 7, 8],
    },
    framing: {
      question: 'A new public health policy is proposed.',
      versionA: 'The policy will save 200 out of 600 people.',
      versionB: 'The policy will result in 400 out of 600 people dying.',
      options: ['Support the policy', 'Oppose the policy', 'Need more information'],
    },
    errorFind: {
      instruction: 'Read the following passage. Find the grammatical error.',
      passage: `Consciousness has puzzled philosophers for centuries. The mind-body problem asks how physical processes in the brain give rise to subjective experience. Some argue that qualia — the redness of red, the painfulness of pain — cannot be reduced to neural firing patterns. Others insist that with enough complexity, matter simply becomes aware of itself. The hard problem of consciousness, coined by David Chalmers, asks not just how the brain processes information, but why their is something it is like to be that process at all. No consensus exists. The question remains open.`,
      hint: 'There is one grammatical error hidden in the text.',
    },
  },
  {
    attention: {
      instruction: 'Read carefully. Count how many times the word "and" appears.',
      passage: 'She walked through the park and noticed the leaves had turned gold and red. Children played near the fountain, and a dog chased a ball across the grass. The sun was low and the shadows were long and thin.',
      correctCount: 6,
      question: 'How many times did the word "and" appear?',
      options: [4, 5, 6, 7],
    },
    framing: {
      question: 'A new workplace restructuring is announced.',
      versionA: '40% of employees will keep their current roles unchanged.',
      versionB: '60% of employees will see their roles significantly altered.',
      options: ['This sounds manageable', 'This sounds disruptive', 'I need more detail'],
    },
    errorFind: {
      instruction: 'Read the following passage. Find the grammatical error.',
      passage: `Memory is not a recording. It is a reconstruction — assembled from fragments each time it is recalled, subtly altered by context, mood, and expectation. Neuroscience has demonstrated that the act of remembering changes the memory itself. Eyewitness testimony, once considered reliable in courts of law, is now understood to be highly fallible. People confidently remember events that never occurred, a phenomenon know as false memory. This is not weakness or dishonesty — it is the ordinary operation of a system built for interpretation, not archival precision.`,
      hint: 'There is one grammatical error hidden in the text.',
    },
  },
  {
    attention: {
      instruction: 'Read carefully. Count how many times the word "not" appears.',
      passage: 'This is not a simple problem, and it is not one that can be solved by logic alone. The answer is not in the data, and it is not obvious. It is not that the question is wrong — it is that the frame is not quite right.',
      correctCount: 6,
      question: 'How many times did the word "not" appear?',
      options: [5, 6, 7, 8],
    },
    framing: {
      question: 'A clinical trial reports the following outcome.',
      versionA: 'Patients who took the drug had a 90% survival rate.',
      versionB: 'Patients who took the drug had a 10% mortality rate.',
      options: ['The drug seems effective', 'The drug seems risky', 'I\'d want more context'],
    },
    errorFind: {
      instruction: 'Read the following passage. Find the grammatical error.',
      passage: `Language shapes thought in ways we rarely notice. The words available to us constrain what we can easily think — not by making ideas impossible, but by making them harder to reach without effort. Studies have found that speakers of languages with more precise vocabulary for certain concepts perform better on tasks involving those concepts. The Sapir-Whorf hypothesis, in it's stronger form, suggested that language determines thought entirely. Most linguists now reject the strong form while accepting that language has real cognitive influence. The boundary between thought and language remains genuinely unclear.`,
      hint: 'There is one grammatical error hidden in the text.',
    },
  },
]

export default function PerceptionRealm() {
  const { dispatch, cycleCount } = useGame()
  const v = VARIANTS[cycleCount % VARIANTS.length]

  const [phase,          setPhase]          = useState('attention')
  const [attentionAns,   setAttentionAns]   = useState(null)
  const [framingAnsA,    setFramingAnsA]    = useState(null)
  const [framingAnsB,    setFramingAnsB]    = useState(null)
  const [errorFound,     setErrorFound]     = useState(null)
  const [attentionScore, setAttentionScore] = useState(0)

  function handleAttention(opt) {
    if (attentionAns !== null) return
    const correct = opt === v.attention.correctCount
    setAttentionAns(opt)
    setAttentionScore(correct ? 1 : 0)
    dispatch({ type: 'TRACK_PERCEPTION', data: { attentionScore: correct ? 1 : 0 } })
    setTimeout(() => setPhase('framing_a'), 1000)
  }

  function handleFramingA(opt) {
    if (framingAnsA !== null) return
    setFramingAnsA(opt)
    setTimeout(() => setPhase('framing_b'), 800)
  }

  function handleFramingB(opt) {
    if (framingAnsB !== null) return
    setFramingAnsB(opt)
    const shifted = opt !== framingAnsA
    dispatch({ type: 'TRACK_PERCEPTION', data: { framingShift: shifted } })
    setTimeout(() => setPhase('error_find'), 800)
  }

  function handleErrorFind(found) {
    if (errorFound !== null) return
    setErrorFound(found)
    dispatch({ type: 'TRACK_PERCEPTION', data: { errorFound: found } })
    setTimeout(() => dispatch({ type: 'NEXT_REALM' }), 1200)
  }

  if (phase === 'attention') {
    return (
      <div className="space-y-6 animate-fade-in">
        <p className="text-slate-400 text-xs mono">{v.attention.instruction}</p>
        <div className="strata-surface p-5">
          <p className="text-slate-200 text-sm leading-7">{v.attention.passage}</p>
        </div>
        <p className="text-slate-300 text-sm">{v.attention.question}</p>
        <div className="grid grid-cols-2 gap-3">
          {v.attention.options.map(opt => (
            <button key={opt} onClick={() => handleAttention(opt)}
              className={`choice-card mono text-xl font-bold text-center ${attentionAns === opt ? 'selected' : ''}`}>
              {opt}
            </button>
          ))}
        </div>
      </div>
    )
  }

  if (phase === 'framing_a') {
    return (
      <div className="space-y-6 animate-fade-in">
        <p className="text-slate-500 text-xs mono">Consider the following.</p>
        <div className="strata-surface p-5">
          <p className="text-slate-400 text-xs mono mb-2">{v.framing.question}</p>
          <p className="text-slate-100 text-base leading-relaxed">{v.framing.versionA}</p>
        </div>
        <div className="space-y-3">
          {v.framing.options.map(opt => (
            <button key={opt} onClick={() => handleFramingA(opt)}
              className={`choice-card text-sm ${framingAnsA === opt ? 'selected' : ''}`}>
              {opt}
            </button>
          ))}
        </div>
      </div>
    )
  }

  if (phase === 'framing_b') {
    return (
      <div className="space-y-6 animate-fade-in">
        <p className="text-slate-500 text-xs mono">Now consider this.</p>
        <div className="strata-surface p-5">
          <p className="text-slate-400 text-xs mono mb-2">{v.framing.question}</p>
          <p className="text-slate-100 text-base leading-relaxed">{v.framing.versionB}</p>
        </div>
        <div className="space-y-3">
          {v.framing.options.map(opt => (
            <button key={opt} onClick={() => handleFramingB(opt)}
              className={`choice-card text-sm ${framingAnsB === opt ? 'selected' : ''}`}>
              {opt}
            </button>
          ))}
        </div>
      </div>
    )
  }

  if (phase === 'error_find') {
    return (
      <div className="space-y-6 animate-fade-in">
        <p className="text-slate-400 text-xs mono">{v.errorFind.instruction}</p>
        <div className="strata-surface p-5">
          <p className="text-slate-200 text-sm leading-7">{v.errorFind.passage}</p>
        </div>
        <p className="text-slate-500 text-xs mono">{v.errorFind.hint}</p>
        <div className="space-y-3">
          <button onClick={() => handleErrorFind(true)}
            className={`choice-card text-sm ${errorFound === true ? 'selected' : ''}`}>
            I found it.
          </button>
          <button onClick={() => handleErrorFind(false)}
            className={`choice-card text-sm ${errorFound === false ? 'selected' : ''}`}>
            I don't see one.
          </button>
        </div>
      </div>
    )
  }

  return null
}
