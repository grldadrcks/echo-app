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
  cycleHistory: [],   // array of { cycle, profile }
  tracking: {
    nature:      { responseTimes: [], rushCount: 0, pauseCount: 0 },
    abstraction: { answers: [] },
    perception:  { attentionScore: 0, framingShift: false, errorFound: false },
    psychology:  { biasAnswers: [], postRevealChanges: [] },
    sociology:   { conformCount: 0, resistCount: 0, totalRounds: 6 },
    attachment:  { surrenderOrder: [], finalAnchor: null },
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
    detachment:  { finalChoice: null },
  }
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

  const counts = { utilitarian: 0, principled: 0, contextual: 0 }
  tracking.abstraction.answers.forEach(a => { if (counts[a] !== undefined) counts[a]++ })
  const valueSystem = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]

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

  const attachmentCore = tracking.attachment.finalAnchor || 'identity'
  const finalChoice    = tracking.detachment.finalChoice  || 'questioning'

  return { mindType, valueSystem, attention, biasAwareness, socialOrientation, attachmentCore, finalChoice }
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
  ]
}

export function computeCycleMeta(cycleHistory, currentProfile) {
  if (!cycleHistory.length || !currentProfile) return null
  const dims = ['mindType', 'valueSystem', 'attention', 'biasAwareness', 'socialOrientation', 'attachmentCore']
  const all  = [...cycleHistory.map(h => h.profile), currentProfile]
  return dims.map(dim => {
    const values   = all.map(p => p[dim])
    const unique   = [...new Set(values)]
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
      return { ...state, screen: 'transition', pendingRealm: next }
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
const STORAGE_KEY = 'strata_state_v2'

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
