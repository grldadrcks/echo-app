import { useState, useEffect } from 'react'
import { useGame, generateNarrative, generateSynthesis, generateContradictions, generateArchetypeShift, computeCycleMeta, computeArchetype, computeArchetypes, REALMS } from '../context/GameContext.jsx'

const DIM_LABELS = {
  mindType:          { label: 'MIND TYPE',  map: { intuitive: 'Intuitive', analytical: 'Analytical', balanced: 'Balanced' } },
  valueSystem:       { label: 'VALUES',     map: { utilitarian: 'Utilitarian', principled: 'Principled', contextual: 'Contextual' } },
  attention:         { label: 'ATTENTION',  map: { focused: 'Focused', scattered: 'Wide-Range', selective: 'Selective' } },
  biasAwareness:     { label: 'AWARENESS',  map: { high: 'High', moderate: 'Moderate', low: 'Grounded' } },
  socialOrientation: { label: 'SOCIAL',     map: { independent: 'Independent', conformist: 'Attuned', adaptive: 'Adaptive' } },
  attachmentCore:    { label: 'ATTACHMENT', map: { identity: 'Identity', relationships: 'Connection', beliefs: 'Belief', future: 'Hope', wounds: 'Memory', past_self: 'Past Self', secret: 'Secrets', mentor: 'Mentorship', home: 'Home', promise: 'Promise', hidden_self: 'Hidden Self', ambition: 'Ambition', friendship: 'Friendship', failure: 'Failure', vision: 'Vision', truth: 'Truth' } },
  mortalityStyle:    { label: 'MORTALITY',  map: { legacy: 'Legacy-Driven', present: 'Present-Focused', avoidant: 'Guarded' } },
  conflictStyle:     { label: 'CONFLICT',   map: { direct: 'Direct', diplomatic: 'Diplomatic', avoidant: 'Avoidant' } },
  timeOrientation:   { label: 'TIME',       map: { past: 'Past', present: 'Present', future: 'Future' } },
  identityCore:      { label: 'IDENTITY',   map: { achiever: 'Achiever', relational: 'Relational', experiential: 'Experiential' } },
  agencyStyle:       { label: 'AGENCY',     map: { internal: 'Internal', contextual: 'Contextual', collective: 'Collective' } },
  desireCore:        { label: 'DESIRE',     map: { security: 'Security', connection: 'Connection', growth: 'Growth' } },
  empathyStyle:      { label: 'EMPATHY',    map: { cognitive: 'Cognitive', affective: 'Affective', contained: 'Contained' } },
  riskStyle:         { label: 'RISK',       map: { tolerant: 'Tolerant', calibrated: 'Calibrated', averse: 'Averse' } },
  trustStyle:        { label: 'TRUST',      map: { open: 'Open', earned: 'Earned', contextual: 'Contextual' } },
}

const LABEL_TO_DIM = {
  'Mind':       { dim: 'mindType',          realmLabel: 'NATURE'      },
  'Values':     { dim: 'valueSystem',       realmLabel: 'ABSTRACTION' },
  'Attention':  { dim: 'attention',         realmLabel: 'PERCEPTION'  },
  'Awareness':  { dim: 'biasAwareness',     realmLabel: 'PSYCHOLOGY'  },
  'Social':     { dim: 'socialOrientation', realmLabel: 'SOCIOLOGY'   },
  'Attachment': { dim: 'attachmentCore',    realmLabel: 'ATTACHMENT'  },
  'Mortality':  { dim: 'mortalityStyle',    realmLabel: 'MORTALITY'   },
  'Conflict':   { dim: 'conflictStyle',     realmLabel: 'CONFLICT'    },
  'Time':       { dim: 'timeOrientation',   realmLabel: 'TIME'        },
  'Identity':   { dim: 'identityCore',      realmLabel: 'IDENTITY'    },
  'Agency':     { dim: 'agencyStyle',       realmLabel: 'AGENCY'      },
  'Desire':     { dim: 'desireCore',        realmLabel: 'DESIRE'      },
  'Empathy':    { dim: 'empathyStyle',      realmLabel: 'EMPATHY'     },
  'Risk':       { dim: 'riskStyle',         realmLabel: 'RISK'        },
  'Trust':      { dim: 'trustStyle',        realmLabel: 'TRUST'       },
}

const NARRATIVE_ACCENTS = {
  'Mind':       { accent: '#2d6a4f', rgb: '45,106,79'   },
  'Values':     { accent: '#4338ca', rgb: '67,56,202'   },
  'Attention':  { accent: '#b45309', rgb: '180,83,9'    },
  'Awareness':  { accent: '#be123c', rgb: '190,18,60'   },
  'Social':     { accent: '#1d4ed8', rgb: '29,78,216'   },
  'Attachment': { accent: '#7c3aed', rgb: '124,58,237'  },
  'Mortality':  { accent: '#475569', rgb: '71,85,105'   },
  'Conflict':   { accent: '#dc2626', rgb: '220,38,38'   },
  'Time':       { accent: '#0891b2', rgb: '8,145,178'   },
  'Identity':   { accent: '#0e7490', rgb: '14,116,144'  },
  'Agency':     { accent: '#15803d', rgb: '21,128,61'   },
  'Desire':     { accent: '#86198f', rgb: '134,25,143'  },
  'Empathy':    { accent: '#059669', rgb: '5,150,105'   },
  'Risk':       { accent: '#ea580c', rgb: '234,88,12'   },
  'Trust':      { accent: '#7e22ce', rgb: '126,34,206'  },
}

function radarScores(profile) {
  return {
    MIND:   profile.mindType === 'balanced' ? 0.5 : profile.mindType === 'analytical' ? 0.9 : 0.25,
    VALS:   profile.valueSystem === 'principled' ? 0.9 : profile.valueSystem === 'contextual' ? 0.55 : 0.3,
    ATTN:   profile.attention === 'focused' ? 0.9 : profile.attention === 'selective' ? 0.6 : 0.25,
    AWARE:  profile.biasAwareness === 'high' ? 0.9 : profile.biasAwareness === 'moderate' ? 0.55 : 0.2,
    SOCIAL: profile.socialOrientation === 'independent' ? 0.9 : profile.socialOrientation === 'adaptive' ? 0.55 : 0.25,
    ATTCH:  profile.attachmentCore === 'wounds' ? 0.3 : profile.attachmentCore === 'future' ? 0.6 : 0.85,
    MORT:   profile.mortalityStyle === 'legacy' ? 0.9 : profile.mortalityStyle === 'present' ? 0.55 : 0.2,
    CONF:   profile.conflictStyle === 'direct' ? 0.9 : profile.conflictStyle === 'diplomatic' ? 0.55 : 0.2,
    TIME:   profile.timeOrientation === 'future' ? 0.9 : profile.timeOrientation === 'present' ? 0.55 : 0.25,
    IDNT:   profile.identityCore === 'achiever' ? 0.9 : profile.identityCore === 'relational' ? 0.6 : 0.3,
    AGCY:   profile.agencyStyle === 'internal' ? 0.9 : profile.agencyStyle === 'contextual' ? 0.55 : 0.25,
    DESIR:  profile.desireCore === 'growth' ? 0.9 : profile.desireCore === 'connection' ? 0.55 : 0.2,
    EMPT:   profile.empathyStyle === 'affective' ? 0.9 : profile.empathyStyle === 'cognitive' ? 0.55 : 0.2,
    RISK:   profile.riskStyle === 'tolerant' ? 0.9 : profile.riskStyle === 'calibrated' ? 0.55 : 0.2,
    TRUST:  profile.trustStyle === 'open' ? 0.9 : profile.trustStyle === 'contextual' ? 0.55 : 0.25,
  }
}

function RadarChart({ profile, size = 260 }) {
  const CENTER = size / 2
  const RADIUS = size * 0.32
  const scores = radarScores(profile)
  const axes   = Object.keys(scores)
  const N      = axes.length

  function pt(i, v) {
    const angle = (Math.PI * 2 * i) / N - Math.PI / 2
    return { x: CENTER + RADIUS * v * Math.cos(angle), y: CENTER + RADIUS * v * Math.sin(angle) }
  }

  const dataPoints = axes.map((ax, i) => pt(i, scores[ax]))
  const dataPath   = dataPoints.map(p => `${p.x},${p.y}`).join(' ')
  const fontSize   = Math.max(6, size * 0.032)

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} style={{ overflow: 'visible' }}>
      {[0.25, 0.5, 0.75, 1].map(ring => (
        <polygon key={ring}
          points={axes.map((_, i) => { const p = pt(i, ring); return `${p.x},${p.y}` }).join(' ')}
          fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      ))}
      {axes.map((_, i) => {
        const o = pt(i, 1)
        return <line key={i} x1={CENTER} y1={CENTER} x2={o.x} y2={o.y} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      })}
      <polygon points={dataPath}
        fill="rgba(var(--realm-accent-rgb), 0.12)"
        stroke="var(--realm-accent)" strokeWidth="1.5" strokeLinejoin="round" />
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill="var(--realm-accent)" stroke="#000" strokeWidth="1.5" />
      ))}
      {axes.map((ax, i) => {
        const lp = pt(i, 1.34)
        return (
          <text key={ax} x={lp.x} y={lp.y} textAnchor="middle" dominantBaseline="middle"
            fill="rgba(255,255,255,0.38)" fontSize={fontSize}
            fontFamily="'Courier New', monospace" letterSpacing="0.05em">
            {ax}
          </text>
        )
      })}
    </svg>
  )
}

function MiniRadar({ profile }) {
  const SIZE = 100, CENTER = 50, RADIUS = 32
  const scores = radarScores(profile)
  const axes   = Object.keys(scores).slice(0, 6)
  const N      = axes.length

  function pt(i, v) {
    const angle = (Math.PI * 2 * i) / N - Math.PI / 2
    return { x: CENTER + RADIUS * v * Math.cos(angle), y: CENTER + RADIUS * v * Math.sin(angle) }
  }

  const dataPath = axes.map((ax, i) => { const p = pt(i, scores[ax]); return `${p.x},${p.y}` }).join(' ')

  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} width={SIZE} height={SIZE}>
      {[0.5, 1].map(ring => (
        <polygon key={ring}
          points={axes.map((_, i) => { const p = pt(i, ring); return `${p.x},${p.y}` }).join(' ')}
          fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      ))}
      <polygon points={dataPath}
        fill="rgba(var(--realm-accent-rgb), 0.12)"
        stroke="var(--realm-accent)" strokeWidth="1" strokeLinejoin="round" />
    </svg>
  )
}

function ShareCard({ profile }) {
  const dims = Object.entries(DIM_LABELS)
  return (
    <div className="rounded-2xl overflow-hidden" style={{
      background: 'linear-gradient(135deg, #0a0a0a 0%, #111 100%)',
      border: '1px solid rgba(var(--realm-accent-rgb), 0.2)',
      padding: '1.5rem',
    }}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="mono text-xs text-slate-600 tracking-widest">ECHO</p>
          <p className="mono font-bold text-lg tracking-widest" style={{ color: 'var(--realm-accent)' }}>YOUR PATTERN</p>
        </div>
        <MiniRadar profile={profile} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        {dims.slice(0, 6).map(([key, meta]) => (
          <div key={key} className="rounded-xl p-3"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="mono text-xs text-slate-600 mb-1">{meta.label}</p>
            <p className="mono text-xs font-semibold" style={{ color: 'var(--realm-accent)' }}>
              {meta.map[profile[key]] || profile[key]}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-3 rounded-xl p-3 text-center"
        style={{ background: 'rgba(var(--realm-accent-rgb), 0.05)', border: '1px solid rgba(var(--realm-accent-rgb), 0.12)' }}>
        <p className="mono text-xs text-slate-500 mb-1">FINAL STANCE</p>
        <p className="mono text-sm font-semibold" style={{ color: 'var(--realm-accent)' }}>
          {profile.finalChoice === 'acceptance' ? 'Acceptance' : 'Inquiry'}
        </p>
      </div>
      <p className="mono text-xs text-slate-700 text-center mt-4">echo.mindgame</p>
    </div>
  )
}

function CycleHistory({ meta, cycleHistory, currentProfile }) {
  if (!meta || cycleHistory.length === 0) return null
  const consistentCount = meta.filter(m => m.consistent).length
  const allCycles = [...cycleHistory, { profile: currentProfile }]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="mono text-xs text-slate-500 tracking-widest">PATTERN HISTORY</p>
        <p className="mono text-xs" style={{ color: 'var(--realm-accent)' }}>
          {allCycles.length} cycle{allCycles.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div
        className="rounded-2xl p-4"
        style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        {/* Archetype timeline */}
        <div className="mb-4 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="mono text-xs text-slate-600 tracking-widest mb-2">ARCHETYPE</p>
          <div className="flex flex-wrap gap-2">
            {allCycles.map((c, i) => {
              const at = computeArchetype(c.profile)
              const isCurrent = i === allCycles.length - 1
              return (
                <div key={i} className="rounded-lg px-2.5 py-1.5"
                  style={{
                    background: isCurrent ? 'rgba(var(--realm-accent-rgb), 0.1)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${isCurrent ? 'rgba(var(--realm-accent-rgb), 0.25)' : 'rgba(255,255,255,0.07)'}`,
                  }}>
                  <p className="mono text-xs text-slate-600">{isCurrent ? 'NOW' : `#${i + 1}`}</p>
                  <p className="mono text-xs font-semibold" style={{ color: isCurrent ? 'var(--realm-accent)' : '#64748b' }}>
                    {at.name.replace('The ', '')}
                  </p>
                </div>
              )
            })}
          </div>
          {allCycles.length >= 2 && (
            <div className="mt-2 space-y-1">
              {allCycles.slice(1).map((c, i) => {
                const fromAt = computeArchetype(allCycles[i].profile)
                const toAt   = computeArchetype(c.profile)
                const shift  = generateArchetypeShift(fromAt.id, toAt.id)
                if (!shift) return null
                return (
                  <p key={i} className="mono text-xs text-slate-600 italic leading-relaxed">
                    {shift}
                  </p>
                )
              })}
            </div>
          )}
        </div>

        <p className="text-slate-500 text-xs leading-relaxed mb-4">
          {consistentCount === meta.length
            ? 'Your pattern is consistent across all cycles. These traits run deep.'
            : consistentCount === 0
            ? 'Every dimension has shifted across cycles. You are in motion.'
            : `${consistentCount} of ${meta.length} dimensions are consistent. Some things hold. Others shift.`}
        </p>

        <div className="space-y-3">
          {meta.map(({ dim, values, consistent, current }) => {
            const meta2 = DIM_LABELS[dim]
            if (!meta2) return null
            return (
              <div key={dim} className="flex items-center justify-between gap-3">
                <p className="mono text-xs text-slate-600 w-24 shrink-0">{meta2.label}</p>
                <div className="flex-1 flex items-center gap-1.5 flex-wrap">
                  {values.map((v, i) => (
                    <span
                      key={i}
                      className="mono text-xs px-2 py-0.5 rounded-full"
                      style={{
                        background: consistent ? 'rgba(var(--realm-accent-rgb), 0.1)' : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${consistent ? 'rgba(var(--realm-accent-rgb), 0.3)' : 'rgba(255,255,255,0.08)'}`,
                        color: i === values.length - 1 ? 'var(--realm-accent)' : '#64748b',
                      }}
                    >
                      {meta2.map[v] || v}
                    </span>
                  ))}
                </div>
                <span className="mono text-xs shrink-0" style={{ color: consistent ? 'var(--realm-accent)' : '#64748b' }}>
                  {consistent ? 'FIXED' : 'FLUID'}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default function ProfileScreen() {
  const { profile, dispatch, cycleCount, cycleHistory } = useGame()
  const [visibleCount,  setVisibleCount]  = useState(0)
  const [glowIndex,     setGlowIndex]     = useState(-1)
  const [showCard,      setShowCard]      = useState(false)
  const [showRestart,   setShowRestart]   = useState(false)
  const [descending,    setDescending]    = useState(false)
  const [copied,        setCopied]        = useState(false)
  const [expandedCard,  setExpandedCard]  = useState(null)
  const [allRevealed,   setAllRevealed]   = useState(false)

  const narrative      = profile ? generateNarrative(profile) : []
  const synthesis      = profile ? generateSynthesis(profile) : []
  const contradictions = profile ? generateContradictions(profile) : []
  const cycleMeta      = computeCycleMeta(cycleHistory, profile)
  const archetypes         = profile ? computeArchetypes(profile) : []
  const archetype          = archetypes[0] || null
  const secondaryArchetype = archetypes[1] || null

  useEffect(() => {
    if (!profile) return
    const timers = narrative.map((_, i) => {
      return setTimeout(() => {
        setVisibleCount(v => Math.max(v, i + 1))
        setGlowIndex(i)
        setTimeout(() => setGlowIndex(g => g === i ? -1 : g), 1200)
      }, i * 900 + 600)
    })
    const cardTimer    = setTimeout(() => setShowCard(true),    narrative.length * 900 + 800)
    const restartTimer = setTimeout(() => setShowRestart(true), narrative.length * 900 + 1400)
    return () => { timers.forEach(clearTimeout); clearTimeout(cardTimer); clearTimeout(restartTimer) }
  }, [profile])

  function revealAll() {
    setVisibleCount(narrative.length)
    setAllRevealed(true)
  }

  function handleDescend() {
    setDescending(true)
    setTimeout(() => dispatch({ type: 'NEXT_CYCLE' }), 2800)
  }

  function handleShare() {
    const text = narrative.map(n => `${n.label}: ${n.text}`).join('\n\n')
    const full  = `My ECHO pattern (Cycle ${cycleCount + 1}):\n\n${text}\n\nFinal stance: ${profile?.finalChoice}`
    if (navigator.share) {
      navigator.share({ title: 'ECHO — My Pattern', text: full }).catch(() => {})
    } else {
      navigator.clipboard.writeText(full).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }).catch(() => {})
    }
  }

  if (!profile) return null

  // Descent overlay
  if (descending) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-black screen-enter">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255,255,255,0.03) 0%, transparent 70%)' }}
        />
        <div className="text-center space-y-4 relative z-10">
          <p className="mono font-bold text-2xl tracking-widest text-white">
            DESCENDING TO CYCLE {cycleCount + 1}
          </p>
          <p className="mono text-sm text-slate-500">The echoes await.</p>
          <div className="flex justify-center gap-1.5 mt-6">
            {[0,1,2,3,4,5,6].map(i => (
              <div key={i} className="w-1.5 h-1.5 rounded-full"
                style={{ background: 'rgba(255,255,255,0.2)', animation: `terminalBlink 1s step-end ${i * 0.15}s infinite` }} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 flex flex-col safe-top safe-bottom overflow-y-auto screen-enter"
      style={{ backgroundColor: 'var(--app-bg)' }}>
      <div className="absolute top-0 left-0 right-0 h-48 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, rgba(226,232,240,0.05), transparent)' }} />

      <div className="relative z-10 px-6 pt-4 pb-12 space-y-8">

        {/* Header */}
        <div>
          <p className="mono text-xs text-slate-600 mb-1 tracking-widest">
            CYCLE {cycleCount + 1} — ECHO COMPLETE
          </p>
          <h1 className="mono font-bold text-2xl tracking-widest" style={{ color: 'var(--realm-accent)' }}>
            YOUR PATTERN
          </h1>
        </div>

        {/* Archetype */}
        {archetype && (
          <div className="rounded-2xl p-5 space-y-3"
            style={{ background: 'rgba(var(--realm-accent-rgb), 0.06)', border: '1px solid rgba(var(--realm-accent-rgb), 0.2)' }}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="mono text-xs text-slate-600 tracking-widest mb-1">YOUR ARCHETYPE</p>
                <p className="mono font-bold text-xl tracking-widest" style={{ color: 'var(--realm-accent)' }}>
                  {archetype.name.toUpperCase()}
                </p>
                {secondaryArchetype && (
                  <p className="mono text-xs mt-1" style={{ color: 'rgba(var(--realm-accent-rgb), 0.5)' }}>
                    Secondary: {secondaryArchetype.name}
                  </p>
                )}
              </div>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">{archetype.portrait}</p>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <p className="mono text-xs text-slate-600 mb-1">GIFT</p>
                <p className="text-slate-300 text-xs leading-relaxed">{archetype.gift}</p>
              </div>
              <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <p className="mono text-xs text-slate-600 mb-1">SHADOW</p>
                <p className="text-slate-300 text-xs leading-relaxed">{archetype.shadow}</p>
              </div>
            </div>
          </div>
        )}

        {/* Radar */}
        <div className="flex justify-center">
          <RadarChart profile={profile} size={260} />
        </div>

        {/* Narrative — revealed one at a time, tappable for source/value detail */}
        <div className="space-y-3">
          {narrative.slice(0, visibleCount).map((item, i) => {
            const isGlowing  = glowIndex === i
            const isExpanded = expandedCard === i
            const ac         = NARRATIVE_ACCENTS[item.label]
            const acRgb      = ac?.rgb    ?? '226,232,240'
            const acColor    = ac?.accent ?? 'var(--realm-accent)'
            const dimInfo    = LABEL_TO_DIM[item.label]
            const dimMeta    = dimInfo ? DIM_LABELS[dimInfo.dim] : null
            const rawValue   = dimInfo ? profile[dimInfo.dim] : null
            const readable   = dimMeta && rawValue ? (dimMeta.map[rawValue] || rawValue) : rawValue
            return (
              <div key={i}
                onClick={() => setExpandedCard(isExpanded ? null : i)}
                className="rounded-2xl p-4 transition-all duration-700 cursor-pointer"
                style={{
                  background: isGlowing ? `rgba(${acRgb}, 0.08)` : `rgba(${acRgb}, 0.03)`,
                  border: `1px solid ${isExpanded ? `rgba(${acRgb}, 0.28)` : isGlowing ? `rgba(${acRgb}, 0.3)` : `rgba(${acRgb}, 0.12)`}`,
                  boxShadow: isGlowing ? `0 0 20px rgba(${acRgb}, 0.1)` : 'none',
                  animation: i === visibleCount - 1 && !allRevealed ? 'screenFadeIn 0.5s cubic-bezier(0.16,1,0.3,1)' : 'none',
                }}>
                <p className="mono text-xs font-semibold mb-2" style={{ color: acColor }}>
                  {item.label.toUpperCase()}
                </p>
                <p className="text-slate-300 text-sm leading-relaxed">{item.text}</p>
                {isExpanded && dimInfo && (
                  <div className="mt-3 pt-3 flex gap-6" style={{ borderTop: `1px solid rgba(${acRgb}, 0.18)` }}>
                    <div>
                      <p className="mono text-xs text-slate-600 mb-0.5">SOURCE</p>
                      <p className="mono text-xs font-semibold tracking-widest" style={{ color: acColor }}>{dimInfo.realmLabel}</p>
                    </div>
                    {readable && (
                      <div>
                        <p className="mono text-xs text-slate-600 mb-0.5">RECORDED</p>
                        <p className="mono text-xs font-semibold tracking-widest" style={{ color: acColor }}>{readable.toUpperCase()}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
          {visibleCount >= 4 && !allRevealed && visibleCount < narrative.length && (
            <button onClick={revealAll}
              className="w-full mono text-xs text-slate-600 py-2 underline underline-offset-2">
              reveal all
            </button>
          )}
        </div>

        {/* Cross-dimension synthesis */}
        {showCard && synthesis.length > 0 && (
          <div className="animate-fade-in space-y-3">
            <p className="mono text-xs text-slate-600 tracking-widest">SYNTHESIS</p>
            {synthesis.map((s, i) => (
              <div key={i} className="rounded-2xl p-4"
                style={{ background: 'rgba(var(--realm-accent-rgb), 0.04)', border: '1px solid rgba(var(--realm-accent-rgb), 0.12)' }}>
                <p className="text-slate-300 text-sm leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>
        )}

        {/* Contradictions */}
        {showCard && contradictions.length > 0 && (
          <div className="animate-fade-in space-y-3">
            <p className="mono text-xs text-slate-600 tracking-widest">TENSIONS</p>
            {contradictions.map((c, i) => (
              <div key={i} className="rounded-2xl p-4"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <p className="text-slate-400 text-sm leading-relaxed">{c.text}</p>
              </div>
            ))}
          </div>
        )}

        {/* Cross-cycle history (cycle 2+) */}
        {showCard && cycleMeta && (
          <div className="animate-fade-in">
            <CycleHistory meta={cycleMeta} cycleHistory={cycleHistory} currentProfile={profile} />
          </div>
        )}

        {/* Stable core (3+ fixed dimensions across cycles) */}
        {showCard && cycleMeta && (() => {
          const stable = cycleMeta.filter(m => m.consistent)
          if (stable.length < 3) return null
          return (
            <div className="animate-fade-in rounded-2xl p-5 space-y-3"
              style={{ background: 'rgba(var(--realm-accent-rgb), 0.05)', border: '1px solid rgba(var(--realm-accent-rgb), 0.2)' }}>
              <p className="mono text-xs tracking-widest" style={{ color: 'var(--realm-accent)' }}>YOUR FOUNDATION</p>
              <p className="text-slate-400 text-sm leading-relaxed">
                These dimensions have not moved across any cycle. They are not traits you perform — they are what you are made of.
              </p>
              <div className="flex flex-wrap gap-1.5">
                {stable.map(({ dim }) => {
                  const m = DIM_LABELS[dim]
                  return (
                    <span key={dim} className="mono text-xs px-2.5 py-1 rounded-full"
                      style={{ background: 'rgba(var(--realm-accent-rgb), 0.12)', border: '1px solid rgba(var(--realm-accent-rgb), 0.25)', color: 'var(--realm-accent)' }}>
                      {m?.label || dim}
                    </span>
                  )
                })}
              </div>
            </div>
          )
        })()}

        {/* Final stance */}
        {showCard && (
          <div className="rounded-2xl p-4 text-center animate-fade-in"
            style={{ background: 'rgba(var(--realm-accent-rgb), 0.05)', border: '1px solid rgba(var(--realm-accent-rgb), 0.15)' }}>
            <p className="mono text-xs text-slate-600 mb-1">YOUR FINAL STANCE</p>
            <p className="text-slate-200 text-sm">
              You chose to{' '}
              <span className="font-semibold" style={{ color: 'var(--realm-accent)' }}>
                {profile.finalChoice === 'acceptance' ? 'accept what you saw.' : 'question everything.'}
              </span>
            </p>
          </div>
        )}

        {/* Share card */}
        {showCard && (
          <div className="animate-fade-in space-y-3">
            <p className="mono text-xs text-slate-600 text-center tracking-widest">YOUR PROFILE CARD</p>
            <ShareCard profile={profile} />
            <button onClick={handleShare} className="btn-realm mono tracking-widest uppercase text-sm">
              {copied ? 'COPIED TO CLIPBOARD' : 'SHARE YOUR PATTERN'}
            </button>
          </div>
        )}

        {/* Actions */}
        {showRestart && (
          <div className="animate-fade-in space-y-3">
            <p className="text-slate-600 text-xs leading-relaxed mono text-center px-2">
              This is a record of how your mind moved through {REALMS.length} layers. It is not a judgment. It is a map — and maps are only useful when you know you're the one holding them.
            </p>
            <button onClick={handleDescend} className="btn-realm mono tracking-widest uppercase text-sm">
              DESCEND TO CYCLE {cycleCount + 2}
            </button>
            <button onClick={() => dispatch({ type: 'RESET' })}
              className="mono text-xs text-slate-700 text-center w-full pt-1 underline underline-offset-2">
              Reset all cycles
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
