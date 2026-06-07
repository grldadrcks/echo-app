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
    observe: 'How quickly your mind closes on a pattern.',
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
    observe: 'Whether you optimize outcomes, honor rules, or reason from context.',
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
    observe: 'What your attention catches — and what it systematically misses.',
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
    observe: 'Whether confronting a bias was enough to move you.',
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
    observe: 'How much the stated majority changed what you chose.',
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
    observe: 'What you were unwilling to release.',
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
    observe: 'Whether you lean into the limit, sit within it, or hold it at distance.',
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
    observe: 'How close you let friction get before responding.',
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
    observe: 'Where your center of gravity lives — past, present, or future.',
  },
  {
    id: 'identity',
    label: 'IDENTITY',
    accent: '#0e7490',
    accentRgb: '14,116,144',
    intro: 'You have a story about who you are.',
    introSub: 'This stratum asks where that story comes from.',
    debrief: 'Your self-concept has been mapped.',
    debriefSub: 'Where you locate yourself — in achievement, in others, or in your own inner life — shapes everything.',
    observe: 'What you most locate your sense of self in.',
  },
  {
    id: 'agency',
    label: 'AGENCY',
    accent: '#15803d',
    accentRgb: '21,128,61',
    intro: 'Something happens. You respond.',
    introSub: 'This stratum asks who you believe is the author.',
    debrief: 'Your relationship to causation has been recorded.',
    debriefSub: 'Whether you see yourself as author, navigator, or participant shapes every decision you make.',
    observe: 'Whether you see yourself as author, navigator, or participant.',
  },
  {
    id: 'desire',
    label: 'DESIRE',
    accent: '#86198f',
    accentRgb: '134,25,143',
    intro: 'Beneath every choice is a want.',
    introSub: 'This stratum finds the one that runs deepest.',
    debrief: 'What you are ultimately seeking has been noted.',
    debriefSub: 'Security, connection, or growth — the deepest desire shapes everything above it.',
    observe: 'What you are, at the deepest level, reaching for.',
  },
  {
    id: 'empathy',
    label: 'EMPATHY',
    accent: '#059669',
    accentRgb: '5,150,105',
    intro: 'Other people are happening to you, constantly.',
    introSub: 'This stratum asks how much you let them in.',
    debrief: 'Your empathic style has been recorded.',
    debriefSub: 'How you take in others\' inner experience shapes every relationship you have.',
    observe: 'How other people\'s inner experience reaches you.',
  },
  {
    id: 'risk',
    label: 'RISK',
    accent: '#ea580c',
    accentRgb: '234,88,12',
    intro: 'The future is uncertain. You act anyway.',
    introSub: 'This stratum measures how you move through that.',
    debrief: 'Your relationship to uncertainty has been mapped.',
    debriefSub: 'Whether you lean toward the unknown or away from it is one of the most consistent things about you.',
    observe: 'Your relationship to uncertainty when something real is at stake.',
  },
  {
    id: 'trust',
    label: 'TRUST',
    accent: '#7e22ce',
    accentRgb: '126,34,206',
    intro: 'You cannot verify everything.',
    introSub: 'This stratum asks what you do instead.',
    debrief: 'Your trust orientation has been noted.',
    debriefSub: 'How you extend trust — freely, carefully, or situationally — reveals your deepest assumptions about people.',
    observe: 'What you require before you open.',
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
  variantSeed: 0,
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
    identity:    { answers: [] },
    agency:      { answers: [] },
    desire:      { answers: [] },
    empathy:     { answers: [] },
    risk:        { answers: [] },
    trust:       { answers: [] },
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
    identity:    { answers: [] },
    agency:      { answers: [] },
    desire:      { answers: [] },
    empathy:     { answers: [] },
    risk:        { answers: [] },
    trust:       { answers: [] },
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
  const identityCore     = plurality(tracking.identity.answers,   ['achiever', 'relational', 'experiential'])
  const agencyStyle      = plurality(tracking.agency.answers,     ['internal', 'contextual', 'collective'])
  const desireCore       = plurality(tracking.desire.answers,     ['security', 'connection', 'growth'])
  const empathyStyle     = plurality(tracking.empathy.answers,    ['cognitive', 'affective', 'contained'])
  const riskStyle        = plurality(tracking.risk.answers,       ['tolerant', 'calibrated', 'averse'])
  const trustStyle       = plurality(tracking.trust.answers,      ['open', 'earned', 'contextual'])
  const finalChoice      = tracking.detachment.finalChoice || 'questioning'

  return { mindType, valueSystem, attention, biasAwareness, socialOrientation, attachmentCore, mortalityStyle, conflictStyle, timeOrientation, identityCore, agencyStyle, desireCore, empathyStyle, riskStyle, trustStyle, finalChoice }
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
    {
      label: 'Identity',
      text: {
        achiever:     'You locate yourself in what you build and accomplish. You are your work — and that is not emptiness, it is direction.',
        relational:   'You know yourself through others. The people you love are not external to who you are — they are constitutive of it.',
        experiential: 'You find yourself in the interior. Your inner life — how you feel, what you sense, who you are beneath the surface — is your truest reference point.',
      }[profile.identityCore],
    },
    {
      label: 'Agency',
      text: {
        internal:   'You hold yourself as the primary author of your outcomes. Ownership and initiative come naturally — so does the weight of self-blame.',
        contextual:  'You understand that conditions shape outcomes as much as choices do. That clarity protects you from certain illusions.',
        collective:  'You believe agency is distributed. Outcomes emerge from relationships and alignment, not from individual will alone.',
      }[profile.agencyStyle],
    },
    {
      label: 'Desire',
      text: {
        security:   'What you most fundamentally want is a life that does not feel precarious. Safety is not a small thing — it is the ground everything else is built on.',
        connection: 'What you most fundamentally want is to be truly known and to truly know others. That depth of belonging is the thing you keep reaching for.',
        growth:     'What you most fundamentally want is to keep becoming. Stagnation is your version of death — forward motion is what makes life feel real.',
      }[profile.desireCore],
    },
    {
      label: 'Empathy',
      text: {
        cognitive:  'You understand others clearly and think through their experience — but you tend to stay inside your own perspective while doing it. Your empathy is real; it lives primarily in your mind.',
        affective:  'Other people\'s feelings reach you directly. You don\'t choose to feel with them — it happens before you decide anything. That is both a gift and a weight.',
        contained:  'You register others\' experience fully and choose how much to let in. That steadiness isn\'t distance — it\'s how you stay useful to the people who need you.',
      }[profile.empathyStyle],
    },
    {
      label: 'Risk',
      text: {
        tolerant:   'You move toward uncertainty rather than away from it. The unknown is not a threat — it is the place where things become possible.',
        calibrated: 'You assess before you act, but you act. You want enough information to make a reasonable call, not a perfect one.',
        averse:     'You weigh what could go wrong before what could go right. That is not timidity — it is a clear-eyed recognition that downside is real.',
      }[profile.riskStyle],
    },
    {
      label: 'Trust',
      text: {
        open:       'You extend trust freely and adjust when you are wrong. The cost of suspicion — in connection, in openness, in what you miss — seems higher to you than the cost of occasional betrayal.',
        earned:     'Trust must be demonstrated before it is extended. You move slowly and reliably, and you expect the same. That is not coldness — it is a standard.',
        contextual: 'Your trust is not a fixed setting. It varies by person, by situation, by what is at stake. You read each relationship separately.',
      }[profile.trustStyle],
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
    {
      when: p => p.identityCore === 'achiever' && p.mortalityStyle === 'legacy',
      text: "You define yourself by what you build, and you orient toward what outlasts you. That's not ego — it's a coherent philosophy. The risk is confusing the work with the self.",
    },
    {
      when: p => p.identityCore === 'relational' && p.desireCore === 'connection',
      text: "You know yourself through others and most deeply want to be truly known. That's a consistent inner logic — and a vulnerability. Your wellbeing is held in other people's hands more than most.",
    },
    {
      when: p => p.identityCore === 'experiential' && p.timeOrientation === 'present',
      text: "You locate yourself in your inner life and live in the present. That's a rare combination — it suggests a genuine interiority rather than distraction.",
    },
    {
      when: p => p.agencyStyle === 'internal' && p.conflictStyle === 'direct',
      text: "You hold yourself as the author of outcomes and move through friction rather than around it. That produces results — and sometimes leaves little room for what you can't control.",
    },
    {
      when: p => p.agencyStyle === 'collective' && p.socialOrientation === 'adaptive',
      text: "You believe outcomes emerge through relationships and you calibrate to the group without being captured by it. That combination is quietly powerful.",
    },
    {
      when: p => p.desireCore === 'security' && p.mortalityStyle === 'avoidant',
      text: "You want a life that feels safe, and you hold the limit at arm's length. Those two things reinforce each other. The cost is that neither fear nor drive gets fully examined.",
    },
    {
      when: p => p.desireCore === 'growth' && p.timeOrientation === 'future',
      text: "You are reaching toward something and living ahead of yourself. The present is almost always a means to what comes next. That drive is real — so is the risk of arriving somewhere you forgot to inhabit.",
    },
    {
      when: p => p.empathyStyle === 'affective' && p.conflictStyle === 'avoidant',
      text: "You feel others deeply and step back from friction. That combination makes conflict genuinely costly for you — you absorb the emotional weight of it more than most people realize.",
    },
    {
      when: p => p.empathyStyle === 'cognitive' && p.agencyStyle === 'internal',
      text: "You understand people clearly and hold yourself accountable for outcomes. That's a productive combination — and a demanding one. You may occasionally underestimate how much others are simply feeling something, not solving something.",
    },
    {
      when: p => p.riskStyle === 'tolerant' && p.agencyStyle === 'internal',
      text: "You move toward uncertainty and hold yourself as the author of outcomes. That's a high-agency stance — effective when conditions are favorable, costly when they're not.",
    },
    {
      when: p => p.riskStyle === 'averse' && p.desireCore === 'security',
      text: "You weigh downside carefully and most fundamentally want a life that feels secure. Those two things reinforce each other into something coherent — and something that can quietly limit the range of what you allow yourself to attempt.",
    },
    {
      when: p => p.trustStyle === 'open' && p.empathyStyle === 'affective',
      text: "You extend trust freely and feel others deeply. That combination makes you genuinely connective — and genuinely vulnerable. You absorb more than most people know.",
    },
    {
      when: p => p.trustStyle === 'earned' && p.conflictStyle === 'direct',
      text: "You require trust to be demonstrated and you address friction plainly. Together those make you someone who is slow to open but reliable once you do — and who expects the same in return.",
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
      { fn: p => p.identityCore === 'achiever', weight: 1 },
      { fn: p => p.agencyStyle === 'internal', weight: 1 },
      { fn: p => p.empathyStyle === 'cognitive', weight: 1 },
      { fn: p => p.riskStyle === 'calibrated', weight: 1 },
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
      { fn: p => p.agencyStyle === 'internal', weight: 1 },
      { fn: p => p.desireCore === 'security', weight: 1 },
      { fn: p => p.riskStyle === 'calibrated', weight: 1 },
      { fn: p => p.trustStyle === 'earned', weight: 1 },
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
      { fn: p => p.agencyStyle === 'contextual', weight: 1 },
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
      { fn: p => p.identityCore === 'experiential', weight: 1 },
      { fn: p => p.desireCore === 'growth', weight: 1 },
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
      { fn: p => p.agencyStyle === 'internal', weight: 1 },
      { fn: p => p.identityCore === 'achiever', weight: 1 },
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
      { fn: p => p.identityCore === 'relational', weight: 1 },
      { fn: p => p.desireCore === 'connection', weight: 1 },
      { fn: p => p.empathyStyle === 'affective', weight: 2 },
      { fn: p => p.trustStyle === 'open', weight: 1 },
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
      { fn: p => p.agencyStyle === 'collective', weight: 1 },
      { fn: p => p.desireCore === 'connection', weight: 1 },
      { fn: p => p.empathyStyle === 'cognitive', weight: 1 },
      { fn: p => p.trustStyle === 'contextual', weight: 1 },
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
      { fn: p => p.desireCore === 'security', weight: 1 },
      { fn: p => p.identityCore === 'relational', weight: 1 },
      { fn: p => p.empathyStyle === 'contained', weight: 1 },
      { fn: p => p.riskStyle === 'averse', weight: 1 },
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
      { fn: p => p.identityCore === 'experiential', weight: 1 },
      { fn: p => p.empathyStyle === 'cognitive', weight: 1 },
      { fn: p => p.trustStyle === 'earned', weight: 1 },
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
      { fn: p => p.identityCore === 'experiential', weight: 1 },
      { fn: p => p.agencyStyle === 'contextual', weight: 1 },
      { fn: p => p.riskStyle === 'tolerant', weight: 1 },
      { fn: p => p.trustStyle === 'open', weight: 1 },
    ],
    portrait: 'You move through the world collecting experience, perspective, and encounter. You are not lost — you have simply not decided to arrive. Each phase feels complete on its own terms.',
    shadow: 'Range without depth can become a pattern of beginning without finishing.',
    gift: 'You see connections across domains that specialists miss. You bring outside context to inside problems.',
  },
]

export function computeArchetypes(profile) {
  const scored = ARCHETYPES.map(a => ({
    ...a,
    score: a.criteria.reduce((s, c) => s + (c.fn(profile) ? c.weight : 0), 0),
  }))
  return scored.sort((a, b) => b.score - a.score)
}

export function computeArchetype(profile) {
  return computeArchetypes(profile)[0]
}

export function computeCycleMeta(cycleHistory, currentProfile) {
  if (!cycleHistory.length || !currentProfile) return null
  const dims = ['mindType', 'valueSystem', 'attention', 'biasAwareness', 'socialOrientation', 'attachmentCore', 'mortalityStyle', 'conflictStyle', 'timeOrientation', 'identityCore', 'agencyStyle', 'desireCore', 'empathyStyle', 'riskStyle', 'trustStyle']
  const all  = [...cycleHistory.map(h => h.profile), currentProfile]
  return dims.map(dim => {
    const values    = all.map(p => p[dim])
    const unique    = [...new Set(values)]
    const consistent = unique.length === 1
    return { dim, values, consistent, current: currentProfile[dim] }
  })
}

export function generateContradictions(profile) {
  const pairs = [
    {
      when: p => p.agencyStyle === 'internal' && p.conflictStyle === 'avoidant',
      text: "You hold yourself as the primary author of outcomes — but step back from friction. Authorship without confrontation is a claim you don't always collect on.",
    },
    {
      when: p => p.socialOrientation === 'conformist' && p.valueSystem === 'principled',
      text: "You hold firm principles but moved with the majority. These two will eventually pull in opposite directions — and which one yields will tell you which one is real.",
    },
    {
      when: p => p.mindType === 'analytical' && p.riskStyle === 'tolerant',
      text: "You dissect carefully but move into uncertainty readily. Most people who analyze as deeply as you do use that analysis to reduce risk — not to justify taking it.",
    },
    {
      when: p => p.trustStyle === 'open' && p.conflictStyle === 'avoidant',
      text: "You extend trust freely but avoid friction. Open trust without the willingness to address betrayal directly is trust without an enforcement mechanism.",
    },
    {
      when: p => p.desireCore === 'growth' && p.riskStyle === 'averse',
      text: "You most fundamentally want to keep becoming — but weight downside heavily before acting. Growth that avoids risk tends to stay theoretical.",
    },
    {
      when: p => p.identityCore === 'achiever' && p.timeOrientation === 'present',
      text: "You locate yourself in what you build but live in the present. Achievement is inherently future-oriented — you may be more grounded than your ambitions account for.",
    },
    {
      when: p => p.empathyStyle === 'affective' && p.socialOrientation === 'independent',
      text: "You feel others' experience directly but resist the pull of the group. You absorb people one at a time while rejecting them as a collective — a distinction most people around you won't recognize.",
    },
    {
      when: p => p.mortalityStyle === 'avoidant' && p.desireCore === 'growth',
      text: "You keep the limit at arm's length but most fundamentally want to keep becoming. Growth without confronting finitude tends to be directionless — there is no deadline driving the becoming.",
    },
    {
      when: p => p.agencyStyle === 'collective' && p.socialOrientation === 'independent',
      text: "You believe outcomes emerge through collective alignment but resist the pull of the group. You want collaboration without conformity — a narrow gate that requires constant navigation.",
    },
    {
      when: p => p.timeOrientation === 'future' && ['past_self', 'wounds', 'failure'].includes(p.attachmentCore),
      text: "You live ahead of yourself but held on to the past. You are building toward a future version while the past remains the reference point — two orientations in quiet competition.",
    },
    {
      when: p => p.valueSystem === 'utilitarian' && ['wounds', 'failure'].includes(p.attachmentCore),
      text: "You optimize for outcomes but held onto a wound. Pure outcome-focus would have released it as unproductive — which means something in you knows the wound is doing work that defies the calculus.",
    },
    {
      when: p => p.biasAwareness === 'high' && p.riskStyle === 'averse',
      text: "You moved when shown the mechanism of your own bias — but weight downside heavily. High self-awareness and risk aversion together can produce sophisticated reasons to stay still.",
    },
    {
      when: p => p.identityCore === 'relational' && p.trustStyle === 'earned',
      text: "You know yourself through others but require trust to be demonstrated before extending it. Your deepest source of self depends on exactly what you are slowest to allow.",
    },
    {
      when: p => p.mortalityStyle === 'legacy' && p.timeOrientation === 'present',
      text: "You orient toward what outlasts you but live fully in the present. Legacy-building usually requires sacrificing present comfort for future impact — you may be attempting both simultaneously.",
    },
    {
      when: p => p.socialOrientation === 'independent' && p.desireCore === 'connection',
      text: "You resist the pull of the group but most fundamentally want to be truly known. Independence and deep connection are both real — but they require different postures, and switching between them costs something.",
    },
    {
      when: p => p.conflictStyle === 'avoidant' && p.mortalityStyle === 'legacy',
      text: "You avoid friction but orient toward legacy — toward something that outlasts you. Most forms of lasting impact require someone to push back, and you tend to step around that moment.",
    },
    {
      when: p => p.conflictStyle === 'direct' && p.trustStyle === 'open',
      text: "You move toward friction and extend trust freely. That combination creates intense closeness fast — and fast closeness creates the conditions for significant betrayal.",
    },
  ]
  return pairs.filter(c => c.when(profile)).slice(0, 2)
}

export function generateArchetypeShift(fromId, toId) {
  if (!fromId || !toId || fromId === toId) return null
  const SHIFTS = {
    'architect→seeker':    'from building frameworks toward questioning them',
    'architect→navigator': 'from fixed principles toward contextual reading',
    'architect→idealist':  'from disciplined structure toward visionary conviction',
    'architect→forge':     'from careful architecture toward direct force',
    'architect→wanderer':  'from structure toward open movement',
    'realist→idealist':    'from outcome-optimization toward principled vision',
    'realist→navigator':   'from calculating outcomes toward reading rooms',
    'realist→seeker':      'from pragmatism toward open inquiry',
    'seeker→anchor':       'from open-ended questioning toward rootedness',
    'seeker→architect':    'from questioning toward building',
    'seeker→guardian':     "from chasing what's new toward protecting what shaped you",
    'seeker→realist':      'from open inquiry toward pragmatic ground',
    'forge→diplomat':      'from moving through friction toward navigating around it',
    'forge→architect':     'from raw force toward deliberate structure',
    'forge→witness':       'from direct impact toward careful observation',
    'empath→witness':      'from absorbing others toward observing them',
    'empath→diplomat':     'from feeling the room toward translating it',
    'diplomat→forge':      'from careful navigation toward direct action',
    'diplomat→architect':  'from flexible translation toward principled structure',
    'anchor→seeker':       'from stable ground toward open horizon',
    'anchor→wanderer':     'from being the foundation toward following the current',
    'witness→forge':       'from watching toward acting',
    'witness→architect':   'from observing systems toward building them',
    'guardian→seeker':     "from protecting what shaped you toward seeking what's next",
    'guardian→navigator':  'from principle toward pragmatic flexibility',
    'wanderer→anchor':     'from moving through the world toward becoming the ground',
    'wanderer→architect':  'from open experience toward deliberate structure',
    'idealist→realist':    'from principled vision toward pragmatic outcomes',
    'idealist→navigator':  'from fixed conviction toward situational judgment',
    'navigator→architect': 'from reading contexts toward building systems',
    'navigator→seeker':    'from translating between positions toward moving beyond them',
  }
  const phrase = SHIFTS[`${fromId}→${toId}`]
  return phrase ? `You moved ${phrase}.` : `You moved from ${fromId} toward ${toId}.`
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
        variantSeed: 0,
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
        variantSeed: Math.floor(Math.random() * 9999),
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
          mortality: { answers: [...state.tracking.mortality.answers, action.answer] },
        },
      }

    case 'TRACK_CONFLICT':
      return {
        ...state,
        tracking: {
          ...state.tracking,
          conflict: { answers: [...state.tracking.conflict.answers, action.answer] },
        },
      }

    case 'TRACK_TIME':
      return {
        ...state,
        tracking: {
          ...state.tracking,
          time: { answers: [...state.tracking.time.answers, action.answer] },
        },
      }

    case 'TRACK_IDENTITY':
      return {
        ...state,
        tracking: {
          ...state.tracking,
          identity: { answers: [...state.tracking.identity.answers, action.answer] },
        },
      }

    case 'TRACK_AGENCY':
      return {
        ...state,
        tracking: {
          ...state.tracking,
          agency: { answers: [...state.tracking.agency.answers, action.answer] },
        },
      }

    case 'TRACK_DESIRE':
      return {
        ...state,
        tracking: {
          ...state.tracking,
          desire: { answers: [...state.tracking.desire.answers, action.answer] },
        },
      }

    case 'TRACK_EMPATHY':
      return {
        ...state,
        tracking: {
          ...state.tracking,
          empathy: { answers: [...state.tracking.empathy.answers, action.answer] },
        },
      }

    case 'TRACK_RISK':
      return {
        ...state,
        tracking: {
          ...state.tracking,
          risk: { answers: [...state.tracking.risk.answers, action.answer] },
        },
      }

    case 'TRACK_TRUST':
      return {
        ...state,
        tracking: {
          ...state.tracking,
          trust: { answers: [...state.tracking.trust.answers, action.answer] },
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
const STORAGE_KEY = 'echo_state_v5'

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(
    gameReducer,
    null,
    () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (!saved) return INITIAL_STATE
        return { ...INITIAL_STATE, ...JSON.parse(saved) }
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
