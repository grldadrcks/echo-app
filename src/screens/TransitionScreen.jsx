import { useEffect, useState } from 'react'
import { useGame, REALMS } from '../context/GameContext.jsx'

export default function TransitionScreen() {
  const { dispatch, currentRealm, pendingRealm } = useGame()
  const [phase, setPhase] = useState('out')   // 'out' | 'in' | 'ready'
  const [canTap, setCanTap] = useState(false)

  const completedRealm = REALMS[currentRealm]
  const nextRealm      = REALMS[pendingRealm]

  useEffect(() => {
    // Brief pause, then fade in debrief
    const t1 = setTimeout(() => setPhase('in'),    400)
    // After 2s allow tap-to-continue
    const t2 = setTimeout(() => setCanTap(true),   2200)
    // Auto-advance after 4.5s
    const t3 = setTimeout(() => dispatch({ type: 'COMPLETE_TRANSITION' }), 4500)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [dispatch])

  function handleTap() {
    if (!canTap) return
    dispatch({ type: 'COMPLETE_TRANSITION' })
  }

  return (
    <div
      className="fixed inset-0 flex flex-col justify-between safe-top safe-bottom px-8 cursor-pointer screen-enter"
      style={{ backgroundColor: 'var(--app-bg)' }}
      onClick={handleTap}
    >
      {/* Subtle radial glow from completed realm accent */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 60% 40% at 50% 30%, rgba(${completedRealm.accentRgb}, 0.08) 0%, transparent 70%)`,
        }}
      />

      <div className="relative z-10 flex-1 flex flex-col justify-center space-y-10">

        {/* Completed realm */}
        <div
          className="transition-all duration-700"
          style={{ opacity: phase === 'out' ? 0 : 1, transform: phase === 'out' ? 'translateY(8px)' : 'translateY(0)' }}
        >
          <p
            className="mono text-xs font-semibold mb-2 tracking-widest"
            style={{ color: `rgba(${completedRealm.accentRgb}, 0.5)` }}
          >
            STRATUM {currentRealm + 1} COMPLETE
          </p>
          <h2
            className="mono font-bold text-3xl tracking-widest mb-4"
            style={{ color: completedRealm.accent }}
          >
            {completedRealm.label}
          </h2>
          <p className="text-slate-300 text-base leading-relaxed">{completedRealm.debrief}</p>
          <p className="text-slate-500 text-sm leading-relaxed mt-2">{completedRealm.debriefSub}</p>
        </div>

        {/* Divider */}
        <div
          className="transition-all duration-700 delay-200"
          style={{ opacity: phase === 'out' ? 0 : 1 }}
        >
          <div className="h-px" style={{ background: `rgba(${completedRealm.accentRgb}, 0.15)` }} />
        </div>

        {/* Next realm preview */}
        <div
          className="transition-all duration-700 delay-300"
          style={{ opacity: phase === 'out' ? 0 : 0.6, transform: phase === 'out' ? 'translateY(12px)' : 'translateY(0)' }}
        >
          <p className="mono text-xs text-slate-600 mb-1 tracking-widest">NEXT</p>
          <p className="mono font-semibold text-lg tracking-widest text-slate-400">
            {nextRealm.label}
          </p>
          <p className="text-slate-600 text-sm mt-1">{nextRealm.intro}</p>
        </div>
      </div>

      {/* Tap to continue hint */}
      <div
        className="relative z-10 pb-4 text-center transition-opacity duration-500"
        style={{ opacity: canTap ? 0.4 : 0 }}
      >
        <p className="mono text-xs text-slate-600">tap to continue</p>
      </div>
    </div>
  )
}
