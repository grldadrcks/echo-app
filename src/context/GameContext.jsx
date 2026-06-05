import { createContext, useContext, useReducer, useEffect } from 'react'

export const REALMS = [
  {
    id: 'nature',
    label: 'NATURE',
    accent: '#2d6a4f',
    accentRgb: '45,106,79',
    intro: 'The natural world repeats itself.',
    introSub: 'So do you.',
    debrief: 'Patterns observed.',
    debriefSub: 'How you recognize order says something about how your mind moves.',
  },
  {
    id: 'abstraction',
    label: 'ABSTRACTION',
    accent: '#4338ca',
    accentRgb: '67,56,202',
    intro: 'Some questions have no correct answer.',
    introSub: 'How you respond to them does.',
    debrief: 'Your reasoning has been mapped.',
    debriefSub: 'The logic you reach for reveals the values you carry.',
  },
  {
    id: 'perception',
    label: 'PERCEPTION',
    accent: '#b45309',
    accentRgb: '180,83,9',
    intro: 'You see what you expect to see.',
    introSub: 'This stratum tests what you miss.',
    debrief: 'Your attention has a shape.',
    debriefSub: 'What you notice — and what you don\'t — is a signature.',
  },
  {
    id: 'psychology',
    label: 'PSYCHOLOGY',
    accent: '#be123c',
    accentRgb: '190,18,60',
    intro: 'The mind deceives itself.',
    introSub: 'Observe whether yours does.',
    debrief: 'Your biases have been recorded.',
    debriefSub: 'Self-awareness is measured not by knowing about bias, but by moving when you see it.',
  },
  {
    id: 'sociology',
    label: 'SOCIOLOGY',
    accent: '#1d4ed8',
    accentRgb: '29,78,216',
    intro: 'Others are already watching.',
    introSub: 'See how much that changes you.',
    debrief: 'Your social gravity has been measured.',
    debriefSub: 'The pull of the group is invisible until you notice you\'ve moved.',
  },
  {
    id: 'attachment',
    label: 'ATTACHMENT',
    accent: '#7c3aed',
    accentRgb: '124,58,237',
    intro: 'You carry more than you know.',
    introSub: 'This stratum asks what you will not let go.',
    debrief: 'What you held longest has been noted.',
    debriefSub: 'The last thing you release is the thing that defines you.',
  },
  {
    id: 'mortality',
    label: 'MORTALITY',
    accent: '#475569',
    accentRgb: '71,85,105',
    intro: 'Everything you do happens inside a limit.',
    introSub: 'This stratum measures what that does to you.',
    debrief: 'Your relationship with finitude has been recorded.',
    debriefSub: 'How you hold the limit says everything about how you use what\'s inside it.',
  },
  {
    id: 'conflict',
    label: 'CONFLICT',
    accent: '#dc2626',
    accentRgb: '220,38,38',
    intro: 'Friction reveals character.',
    introSub: 'This stratum watches how you move through it.',
    debrief: 'Your conflict signature has been mapped.',
    debriefSub: 'How you navigate resistance is the shape of your will.',
  },
  {
    id: 'time',
    label: 'TIME',
    accent: '#0891b2',
    accentRgb: '8,145,178',
    intro: 'Where you live in time shapes everything else.',
    introSub: 'This stratum finds your center of gravity.',
    debrief: 'Your temporal orientation has been recorded.',
    debriefSub: 'Past, present, or future — your center of gravity shapes how you move.',
  },
  {
    id: 'detachment',
    label: 'DETACHMENT',
    accent: '#e2e8f0',
    accentRgb: '226,232,240',
    intro: 'You have reached the final stratum.',
    introSub: 'What follows is a mirror.',
    debrief: '',
    debriefSub: '',
  },
]

const INITIAL_STATE = {
  screen: 'intro',
  currentRealm: 0,
  realmPhase: 0,
  pendingRealm: null,
  cycleCount: 0,
  cycleHistory: [],
  tracking: {
    nature:      { responseTimes: [], rushCount: 0, pauseCount: 0 },
    abstraction: { answers: [] },
    perception:  { attentionScore: 0, framingShift: false, errorFound: false },
    psychology:  { biasAnswers: [], postRevealChanges: [] },
    sociology:   { conformCount: 0, resistCount: 0, totalRounds: 6 },
    attachment:  { surrenderOrder: [], finalAnchor: null },
    mortality:   { answers: [] },
    conflict:    { answers: [] },
    time:        { answers: [] },
    detachment:  { finalChoice: null },
  },
  profile: null,
}

function freshTracking() {
  return {
    nature:      { responseTimes: [], rushCount: 0, pauseCount: 0 },
    abstraction: { answers: [] },
    perception:  { attentionScore: 0, framingShift: false, errorFound: false },
    psychology:  { biasAnswers: [], postRevealChanges: [] },
    sociology:   { conformCount: 0, resistCount: 0, totalRounds: 6 },
    attachment:  { surrenderOrder: [], finalAnchor: null },
    mortality:   { answers: [] },
    conflict:    { answers: [] },
    time:        { answers: [] },
    detachment:  { finalChoice: null },
  }
}

function plurality(answers, keys) {
  const counts = Object.fromEntries(keys.map(k => [k, 0]))
  answers.forEach(a => { if (counts[a] !== undefined) counts[a]++ })
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]
}

function computeProfile(tracking) {
  const { rushCount, pauseCount, responseTimes } = tracking.nature
  const total      = responseTimes.length || 1
  const rushRatio  = rushCount / total
  const pauseRatio = pauseCount / total
  let mindType
  if (rushRatio > 0.6)       mindType = 'intuitive'
  else if (pauseRatio > 0.6) mindType = 'analytical'
  else                       mindType = 'balanced'

  const valueSystem = plurality(tracking.abstraction.answers, ['utilitarian', 'principled', 'contextual'])

  const { attentionScore, framingShift, errorFound } = tracking.perception
  const attentionPoints = attentionScore + (errorFound ? 1 : 0) - (framingShift ? 1 : 0)
  let attention
  if (attentionPoints >= 3)      attention = 'focused'
  else if (attentionPoints <= 1) attention = 'scattered'
  else                           attention = 'selective'

  const changes = tracking.psychology.postRevealChanges
  const changeRatio = changes.length > 0 ? changes.filter(Boolean).length / changes.length : 0
  let biasAwareness
  if (changeRatio >= 0.6)      biasAwareness = 'high'
  else if (changeRatio >= 0.3) biasAwareness = 'moderate'
  else                         biasAwareness = 'low'

  const { conformCount, resistCount } = tracking.sociology
  const socTotal     = conformCount + resistCount || 1
  const conformRatio = conformCount / socTotal
  let socialOrientation
  if (conformRatio >= 0.67)      socialOrientation = 'conformist'
  else if (conformRatio <= 0.33) socialOrientation = 'independent'
  else                           socialOrientation = 'adaptive'

  const attachmentCore   = tracking.attachment.finalAnchor || 'identity'
  const mortalityStyle   = plurality(tracking.mortality.answers,  ['legacy', 'present', 'avoidant'])
  const conflictStyle    = plurality(tracking.conflict.answers,   ['direct', 'diplomatic', 'avoidant'])
  const timeOrientation  = plurality(tracking.time.answers,       ['past', 'present', 'future'])
  const finalChoice      = tracking.detachment.finalChoice || 'questioning'

  return { mindType, valueSystem, attention, biasAwareness, socialOrientation, attachmentCore, mortalityStyle, conflictStyle, timeOrientation, finalChoice }
}

const ATTACHMENT_NARRATIVE = {
  identity:      'What you held longest was a sense of who you are. Identity is your deepest root.',
  relationships: 'You surrendered everything except connection. Others are your anchor.',
  beliefs:       'The idea outlasted everything else. What you believe defines what you keep.',
  future:        'You held onto possibility last. Hope is your longest-running commitment.',
  wounds:        'You kept the wound. That is not failure — it is testimony. It shaped you and you know it.',
  past_self:     'You held onto who you once were. The past self is still present in you.',
  secret:        'You kept what was hidden. The things we protect in silence tend to be the things that matter most.',
  mentor:        'You held the influence of someone who shaped you. That presence still guides your thinking.',
  home:          'What you protected was a place — or the feeling of one. Belonging runs deep in you.',
  promise:       'You kept a promise you made to yourself. Integrity with yourself is the hardest kind to maintain.',
  hidden_self:   "You held the part of yourself you've kept from others. That concealed self is your most protected truth.",
  ambition:      "You held onto something you haven't yet done. The unrealized possibility refuses to be released.",
  friendship:    "Connection outlasted everything else. You define yourself through those you've walked with.",
  failure:       "You kept the failure. Not as a wound — as a lesson you're still drawing from.",
  vision:        "The future self you imagine is the last thing you'll let go of. That vision drives you.",
  truth:         'You held a truth about yourself that you rarely speak. Self-knowledge is your deepest anchor.',
}

export function generateNarrative(profile) {
  return [
    {
      label: 'Mind',
      text: {
        intuitive:  'You move through problems by feel. You trust the pattern before you can name it.',
        analytical: 'You dissect before you decide. The mechanism matters more than the momentum.',
        balanced:   'You shift between instinct and structure. You know when each one serves you.',
      }[profile.mindType],
    },
    {
      label: 'Values',
      text: {
        utilitarian: 'Your ethical center is the outcome. You calculate consequences, consciously or not.',
        principled:  'You hold to something beyond the math. Rules are not cages — they are commitments.',
        contextual:  'You resist fixed answers. Every situation earns its own response from you.',
      }[profile.valueSystem],
    },
    {
      label: 'Attention',
      text: {
        focused:   'Your attention is a beam. What you point it at, you see clearly.',
        scattered:  'Your awareness is wide. You catch periphery that others miss, and sometimes lose the center.',
        selective: 'You filter without knowing you filter. You see what matters to you, deeply.',
      }[profile.attention],
    },
    {
      label: 'Awareness',
      text: {
        high:     'When shown your own bias, you moved. That is not weakness — it is intellectual honesty.',
        moderate: 'You paused when confronted with bias. Sometimes you adjusted. That ambivalence is real.',
        low:      'You held your ground even when shown the mechanism. Conviction or rigidity — only you know.',
      }[profile.biasAwareness],
    },
    {
      label: 'Social',
      text: {
        independent: 'The majority did not move you. You follow your own signal.',
        conformist:  'You read the room. Whether that is wisdom or fear is the right question.',
        adaptive:    'You weigh the group without being captured by it. That is a calibration, not a compromise.',
      }[profile.socialOrientation],
    },
    {
      label: 'Attachment',
      text: ATTACHMENT_NARRATIVE[profile.attachmentCore] || 'What you held last defines your center.',
    },
    {
      label: 'Mortality',
      text: {
        legacy:   'You orient toward what outlasts you. Finitude sharpens your sense of what matters — not as fear, but as direction.',
        present:  'You hold the limit without letting it dominate. You are here, and that is framework enough.',
        avoidant: 'You hold the knowledge of limits at arm\'s length. Not denial — careful management of what you let into focus.',
      }[profile.mortalityStyle],
    },
    {
      label: 'Conflict',
      text: {
        direct:     'You move toward friction rather than around it. Confrontation is a tool, not a threat.',
        diplomatic: 'You navigate disagreement with precision. The point isn\'t avoidance — it\'s timing.',
        avoidant:   'You manage conflict by reducing its surface area. Whether that\'s wisdom or protection depends on what you\'re avoiding.',
      }[profile.conflictStyle],
    },
    {
      label: 'Time',
      text: {
        past:    'You live with significant reference to what has already happened. Memory is your primary way of making sense.',
        present: 'You are grounded in the immediate. What\'s in front of you is the most real thing you have.',
        future:  'You live ahead of yourself. The present is a means of getting somewhere — and you already know roughly where.',
      }[profile.timeOrientation],
    },
  ]
}

export function generateSynthesis(profile) {
  const combos = [
    {
      when: p => p.mindType === 'intuitive' && p.socialOrientation === 'conformist',
      text: "Your instincts are real — but porous to the room. You move by feel, and social gravity pulls on that movement without you always noticing.",
    },
    {
      when: p => p.mindType === 'intuitive' && p.socialOrientation === 'independent',
      text: "Fast and solitary. You trust the signal before it has a name, and you don't wait for the room to confirm it.",
    },
    {
      when: p => p.mindType === 'analytical' && p.socialOrientation === 'conformist',
      text: "You calculate, and then you yield. Whether that's wisdom or a failure of nerve is a question only you can answer.",
    },
    {
      when: p => p.mindType === 'analytical' && p.socialOrientation === 'independent',
      text: "You build your own framework and live inside it. The group's answer registers as data — not direction.",
    },
    {
      when: p => p.mindType === 'balanced' && p.socialOrientation === 'adaptive',
      text: "You shift mode based on context — instinct when it's called for, structure when it isn't, group calibration when useful. That's not indecision. It's range.",
    },
    {
      when: p => p.attention === 'focused' && p.biasAwareness === 'high',
      text: "You see clearly and you moved when shown the mechanism. That combination is uncommon — most people do one or the other.",
    },
    {
      when: p => p.attention === 'scattered' && p.biasAwareness === 'low',
      text: "Wide perception, slow correction. You catch things at the edges that others miss — but the center drifts without you noticing.",
    },
    {
      when: p => p.attention === 'focused' && p.biasAwareness === 'low',
      text: "Precise attention, resistant updating. You see what you point at very clearly — and that focus makes it harder to redirect when evidence shifts.",
    },
    {
      when: p => p.valueSystem === 'principled' && ['wounds', 'past_self', 'failure'].includes(p.attachmentCore),
      text: "You hold firm on principle and you hold onto the past. The things that shaped you are still load-bearing in your decisions.",
    },
    {
      when: p => p.valueSystem === 'utilitarian' && p.timeOrientation === 'future',
      text: "You optimize for outcomes and orient toward what's coming. Every decision is partly an investment in a version of the future you're building.",
    },
    {
      when: p => p.valueSystem === 'contextual' && p.socialOrientation === 'adaptive',
      text: "No fixed rules, no fixed allegiances — you read each situation fresh. Whether that's sophistication or avoidance of commitment is worth sitting with.",
    },
    {
      when: p => p.conflictStyle === 'direct' && p.socialOrientation === 'independent',
      text: "You move toward friction and you move alone. That combination produces real change — and real collateral.",
    },
    {
      when: p => p.conflictStyle === 'avoidant' && p.biasAwareness === 'low',
      text: "You step back from confrontation and hold your ground when shown the mechanism. There's a consistency to your protective instincts.",
    },
    {
      when: p => p.mortalityStyle === 'legacy' && p.timeOrientation === 'future',
      text: "You're building toward something beyond your own life and already living in that future. That clarity of direction is rare — and demanding.",
    },
    {
      when: p => p.mortalityStyle === 'present' && p.timeOrientation === 'present',
      text: "You are here, fully and consistently. That kind of groundedness is not passivity — it's a discipline.",
    },
    {
      when: p => p.mortalityStyle === 'avoidant' && p.timeOrientation === 'past',
      text: "You look back more than forward, and you keep the limit at arm's length. The past feels safer than what finitude implies about the future.",
    },
    {
      when: p => p.finalChoice === 'questioning' && p.biasAwareness === 'low',
      text: "You chose to question everything — but when shown the mechanism of your bias, you didn't change course. That gap between stated inquiry and actual movement is significant.",
    },
    {
      when: p => p.finalChoice === 'acceptance' && p.socialOrientation === 'independent',
      text: "You accepted what you saw on your own terms — not because someone told you to. That's a meaningful distinction.",
    },
    {
      when: p => p.finalChoice === 'acceptance' && p.biasAwareness === 'high',
      text: "You accepted the profile and moved when shown the mechanism — twice. You have a habit of letting evidence update you. That's harder than it sounds.",
    },
  ]
  return combos.filter(c => c.when(profile)).slice(0, 3)
}

const ARCHETYPES = [
  {
    id: 'architect',
    name: 'The Architect',
    criteria: [
      { fn: p => p.mindType === 'analytical', weight: 3 },
      { fn: p => p.valueSystem === 'principled', weight: 3 },
      { fn: p => p.socialOrientation === 'independent', weight: 2 },
      { fn: p => p.attention === 'focused', weight: 2 },
      { fn: p => p.conflictStyle === 'direct', weight: 1 },
    ],
    portrait: 'You build systems before you build anything else. The framework matters as much as what it holds. You think in structures — and the most important structure you maintain is your own consistency.',
    shadow: 'The map can become more real than the territory. You may resist what doesn\'t fit the system, even when it should.',
    gift: 'You see the shape of things before they exist. Your clarity is a form of care.',
  },
  {
    id: 'realist',
    name: 'The Realist',
    criteria: [
      { fn: p => p.mindType === 'analytical', weight: 2 },
      { fn: p => p.valueSystem === 'utilitarian', weight: 3 },
      { fn: p => p.conflictStyle === 'direct', weight: 3 },
      { fn: p => p.biasAwareness === 'low', weight: 1 },
      { fn: p => p.socialOrientation === 'independent', weight: 1 },
    ],
    portrait: 'You see things as they are and move accordingly. Not cynical — accurate. You optimize because you understand the cost of not optimizing, and you\'ve paid it before.',
    shadow: 'What can\'t be measured can still matter enormously. The unmeasurable tends to get underweighted in your calculations.',
    gift: 'You cut through noise and sentiment to find the actual problem. This is rarer than it looks.',
  },
  {
    id: 'navigator',
    name: 'The Navigator',
    criteria: [
      { fn: p => p.mindType === 'analytical', weight: 2 },
      { fn: p => p.valueSystem === 'contextual', weight: 3 },
      { fn: p => p.socialOrientation === 'adaptive', weight: 3 },
      { fn: p => p.conflictStyle === 'diplomatic', weight: 2 },
    ],
    portrait: 'You read situations the way a sailor reads water — constantly adjusting. You hold multiple frameworks at once and apply them selectively. You find the third option others didn\'t see.',
    shadow: 'Without fixed principles, your flexibility can look like inconsistency — or feel like it from the inside.',
    gift: 'You solve problems others have given up on by refusing to accept the given frame.',
  },
  {
    id: 'idealist',
    name: 'The Idealist',
    criteria: [
      { fn: p => p.mindType === 'intuitive', weight: 2 },
      { fn: p => p.valueSystem === 'principled', weight: 3 },
      { fn: p => p.socialOrientation === 'independent', weight: 2 },
      { fn: p => p.finalChoice === 'questioning', weight: 2 },
      { fn: p => p.mortalityStyle === 'legacy', weight: 1 },
    ],
    portrait: 'You hold a vision of how things should be and refuse to fully compromise it. You are moved by possibility — and the distance between what is and what could be is not a source of despair but a source of direction.',
    shadow: 'Attachment to the ideal can make the real feel like constant failure. The gap between vision and reality is permanent.',
    gift: 'You pull others toward standards they would not have reached alone.',
  },
  {
    id: 'seeker',
    name: 'The Seeker',
    criteria: [
      { fn: p => p.mindType === 'intuitive', weight: 2 },
      { fn: p => p.valueSystem === 'contextual', weight: 3 },
      { fn: p => p.timeOrientation === 'future', weight: 2 },
      { fn: p => p.finalChoice === 'questioning', weight: 2 },
      { fn: p => p.attention === 'scattered', weight: 1 },
    ],
    portrait: 'You follow the question wherever it leads. You are uncomfortable with closed answers and drawn to the edges of what is known. Arrival feels like loss.',
    shadow: 'Accumulation without integration can leave you rich in experience and thin in rootedness.',
    gift: 'You push past boundaries that others have accepted as walls.',
  },
  {
    id: 'forge',
    name: 'The Forge',
    criteria: [
      { fn: p => p.mindType === 'intuitive', weight: 2 },
      { fn: p => p.valueSystem === 'utilitarian', weight: 2 },
      { fn: p => p.conflictStyle === 'direct', weight: 3 },
      { fn: p => p.socialOrientation === 'independent', weight: 2 },
      { fn: p => p.biasAwareness === 'low', weight: 1 },
    ],
    portrait: 'You move through resistance rather than around it. Confrontation is not something you avoid — it\'s a tool. You create change in situations where others are still waiting for permission.',
    shadow: 'You can leave scorch marks on people who needed gentleness instead of force.',
    gift: 'You break logjams. You make things happen that would otherwise stay stuck forever.',
  },
  {
    id: 'empath',
    name: 'The Empath',
    criteria: [
      { fn: p => p.attention === 'selective', weight: 2 },
      { fn: p => p.socialOrientation === 'conformist', weight: 3 },
      { fn: p => p.conflictStyle === 'diplomatic', weight: 2 },
      { fn: p => p.valueSystem === 'contextual', weight: 2 },
      { fn: p => ['relationships', 'friendship', 'home'].includes(p.attachmentCore), weight: 1 },
    ],
    portrait: 'You read rooms and people with unusual precision. You adapt not to disappear into the group but to meet it. You feel the weight of what\'s unsaid in almost every interaction.',
    shadow: 'Your attunement can become self-erasure. The thread of what you actually want can get lost in tracking everyone else.',
    gift: 'You make people feel genuinely seen — which is rarer and more valuable than most people realize.',
  },
  {
    id: 'diplomat',
    name: 'The Diplomat',
    criteria: [
      { fn: p => p.mindType === 'balanced', weight: 2 },
      { fn: p => p.socialOrientation === 'adaptive', weight: 3 },
      { fn: p => p.conflictStyle === 'diplomatic', weight: 3 },
      { fn: p => p.valueSystem === 'contextual', weight: 1 },
    ],
    portrait: 'You translate between people. You understand multiple positions simultaneously and can articulate each one better than the person who holds it. You build bridges where others only see the gap.',
    shadow: 'You can delay necessary confrontation indefinitely in the name of keeping the peace. Some things need to be broken before they can be fixed.',
    gift: 'You find agreement where others see irreconcilable difference.',
  },
  {
    id: 'anchor',
    name: 'The Anchor',
    criteria: [
      { fn: p => p.mindType === 'balanced', weight: 1 },
      { fn: p => p.valueSystem === 'principled', weight: 2 },
      { fn: p => p.socialOrientation === 'conformist', weight: 2 },
      { fn: p => p.conflictStyle === 'diplomatic', weight: 2 },
      { fn: p => p.mortalityStyle === 'present', weight: 2 },
      { fn: p => ['home', 'relationships', 'promise'].includes(p.attachmentCore), weight: 1 },
    ],
    portrait: 'You are the person people return to. You provide stability without demanding credit for it. Your reliability is a kind of generosity that goes largely unnoticed — except by those who depend on it.',
    shadow: 'You can carry others\' weight until it becomes resentment. Stability for others can come at the cost of your own becoming.',
    gift: 'You make the ground under people\'s feet feel solid. That is not a small thing.',
  },
  {
    id: 'witness',
    name: 'The Witness',
    criteria: [
      { fn: p => p.mindType === 'analytical', weight: 2 },
      { fn: p => p.conflictStyle === 'avoidant', weight: 3 },
      { fn: p => p.attention === 'focused', weight: 2 },
      { fn: p => p.socialOrientation === 'independent', weight: 2 },
      { fn: p => p.finalChoice === 'acceptance', weight: 1 },
    ],
    portrait: 'You observe more than you act, and your observations are precise. You let things reveal themselves rather than forcing the reveal. You are often the most accurate person in the room — and sometimes the quietest.',
    shadow: 'Distance can look like wisdom when it\'s actually protection. Not all observation is detachment; some is avoidance.',
    gift: 'You see the full picture before others know one exists.',
  },
  {
    id: 'guardian',
    name: 'The Guardian',
    criteria: [
      { fn: p => p.valueSystem === 'principled', weight: 2 },
      { fn: p => p.conflictStyle === 'direct', weight: 2 },
      { fn: p => ['wounds', 'past_self', 'failure', 'promise'].includes(p.attachmentCore), weight: 3 },
      { fn: p => p.timeOrientation === 'past', weight: 2 },
      { fn: p => p.mortalityStyle === 'legacy', weight: 1 },
    ],
    portrait: 'You carry what shaped you and use it. Your principles are not abstract — they were earned. You protect things others don\'t see the value of yet.',
    shadow: 'You can hold a wound so long it becomes identity. The things that forged you can also limit you.',
    gift: 'Your convictions have weight because they cost you something. That\'s the difference between principle and preference.',
  },
  {
    id: 'wanderer',
    name: 'The Wanderer',
    criteria: [
      { fn: p => p.mindType === 'intuitive', weight: 2 },
      { fn: p => p.socialOrientation === 'independent', weight: 2 },
      { fn: p => p.mortalityStyle === 'present', weight: 2 },
      { fn: p => p.timeOrientation === 'present', weight: 2 },
      { fn: p => p.attention === 'scattered', weight: 2 },
    ],
    portrait: 'You move through the world collecting experience, perspective, and encounter. You are not lost — you have simply not decided to arrive. Each phase feels complete on its own terms.',
    shadow: 'Range without depth can become a pattern of beginning without finishing.',
    gift: 'You see connections across domains that specialists miss. You bring outside context to inside problems.',
  },
]

export function computeArchetype(profile) {
  const scored = ARCHETYPES.map(a => ({
    ...a,
    score: a.criteria.reduce((s, c) => s + (c.fn(profile) ? c.weight : 0), 0),
  }))
  return scored.sort((a, b) => b.score - a.score)[0]
}

export function computeCycleMeta(cycleHistory, currentProfile) {
  if (!cycleHistory.length || !currentProfile) return null
  const dims = ['mindType', 'valueSystem', 'attention', 'biasAwareness', 'socialOrientation', 'attachmentCore', 'mortalityStyle', 'conflictStyle', 'timeOrientation']
  const all  = [...cycleHistory.map(h => h.profile), currentProfile]
  return dims.map(dim => {
    const values    = all.map(p => p[dim])
    const unique    = [...new Set(values)]
    const consistent = unique.length === 1
    return { dim, values, consistent, current: currentProfile[dim] }
  })
}

function gameReducer(state, action) {
  switch (action.type) {

    case 'START_GAME':
      return {
        ...state,
        screen: 'realm',
        currentRealm: 0,
        realmPhase: 0,
        pendingRealm: null,
        tracking: freshTracking(),
        profile: null,
      }

    case 'NEXT_PHASE':
      return { ...state, realmPhase: state.realmPhase + 1 }

    case 'NEXT_REALM': {
      const next = state.currentRealm + 1
      if (next >= REALMS.length) {
        return { ...state, screen: 'profile', profile: computeProfile(state.tracking) }
      }
      // Pre-compute profile when entering the final realm so it's available for the reveal phase
      const profile = next === REALMS.length - 1 ? computeProfile(state.tracking) : state.profile
      return { ...state, screen: 'transition', pendingRealm: next, profile }
    }

    case 'COMPLETE_TRANSITION':
      return { ...state, screen: 'realm', currentRealm: state.pendingRealm, realmPhase: 0, pendingRealm: null }

    case 'NEXT_CYCLE': {
      const newHistory = state.profile
        ? [...state.cycleHistory, { cycle: state.cycleCount, profile: state.profile }]
        : state.cycleHistory
      return {
        ...state,
        screen: 'realm',
        currentRealm: 0,
        realmPhase: 0,
        pendingRealm: null,
        cycleCount: state.cycleCount + 1,
        cycleHistory: newHistory,
        tracking: freshTracking(),
        profile: null,
      }
    }

    case 'TRACK_NATURE_RESPONSE': {
      const { ms } = action
      const t = state.tracking.nature
      return {
        ...state,
        tracking: {
          ...state.tracking,
          nature: {
            responseTimes: [...t.responseTimes, ms],
            rushCount:  ms < 3000 ? t.rushCount + 1  : t.rushCount,
            pauseCount: ms > 8000 ? t.pauseCount + 1 : t.pauseCount,
          },
        },
      }
    }

    case 'TRACK_ABSTRACTION_ANSWER':
      return {
        ...state,
        tracking: {
          ...state.tracking,
          abstraction: { answers: [...state.tracking.abstraction.answers, action.value] },
        },
      }

    case 'TRACK_PERCEPTION':
      return {
        ...state,
        tracking: {
          ...state.tracking,
          perception: { ...state.tracking.perception, ...action.data },
        },
      }

    case 'TRACK_PSYCHOLOGY_INITIAL':
      return {
        ...state,
        tracking: {
          ...state.tracking,
          psychology: {
            ...state.tracking.psychology,
            biasAnswers: [...state.tracking.psychology.biasAnswers, action.value],
          },
        },
      }

    case 'TRACK_PSYCHOLOGY_POST':
      return {
        ...state,
        tracking: {
          ...state.tracking,
          psychology: {
            ...state.tracking.psychology,
            postRevealChanges: [...state.tracking.psychology.postRevealChanges, action.changed],
          },
        },
      }

    case 'TRACK_SOCIOLOGY': {
      const t = state.tracking.sociology
      return {
        ...state,
        tracking: {
          ...state.tracking,
          sociology: {
            ...t,
            conformCount: action.conformed ? t.conformCount + 1 : t.conformCount,
            resistCount:  action.conformed ? t.resistCount      : t.resistCount + 1,
          },
        },
      }
    }

    case 'TRACK_ATTACHMENT_SURRENDER':
      return {
        ...state,
        tracking: {
          ...state.tracking,
          attachment: {
            surrenderOrder: [...state.tracking.attachment.surrenderOrder, action.anchorId],
            finalAnchor: action.finalAnchor ?? state.tracking.attachment.finalAnchor,
          },
        },
      }

    case 'TRACK_MORTALITY':
      return {
        ...state,
        tracking: {
          ...state.tracking,
          mortality: { answers: [...state.tracking.mortality.answers, action.value] },
        },
      }

    case 'TRACK_CONFLICT':
      return {
        ...state,
        tracking: {
          ...state.tracking,
          conflict: { answers: [...state.tracking.conflict.answers, action.value] },
        },
      }

    case 'TRACK_TIME':
      return {
        ...state,
        tracking: {
          ...state.tracking,
          time: { answers: [...state.tracking.time.answers, action.value] },
        },
      }

    case 'TRACK_FINAL_CHOICE': {
      const tracking = { ...state.tracking, detachment: { finalChoice: action.choice } }
      return { ...state, tracking, profile: computeProfile(tracking), screen: 'profile' }
    }

    case 'RESET':
      return INITIAL_STATE

    default:
      return state
  }
}

const GameContext = createContext(null)
const STORAGE_KEY = 'echo_state_v3'

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(
    gameReducer,
    null,
    () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY)
        return saved ? JSON.parse(saved) : INITIAL_STATE
      } catch {
        return INITIAL_STATE
      }
    }
  )

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  useEffect(() => {
    const realm = REALMS[state.currentRealm]
    const root  = document.documentElement
    if (state.screen === 'intro') {
      root.style.setProperty('--realm-accent',     '#ffffff')
      root.style.setProperty('--realm-accent-rgb', '255,255,255')
    } else {
      root.style.setProperty('--realm-accent',     realm.accent)
      root.style.setProperty('--realm-accent-rgb', realm.accentRgb)
    }
  }, [state.screen, state.currentRealm])

  return (
    <GameContext.Provider value={{ ...state, dispatch, REALMS }}>
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used inside GameProvider')
  return ctx
}
