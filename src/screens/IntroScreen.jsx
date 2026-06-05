import { useState, useEffect } from 'react'
import { useGame } from '../context/GameContext.jsx'

const BOOT_LINES_FIRST = [
  { text: 'ECHO v1.0.0',                               delay: 0,    dim: false, bold: true },
  { text: 'Initializing behavioral substrate...',      delay: 900,  dim: true  },
  { text: 'Loading 7 cognitive strata...',             delay: 1800, dim: true  },
  { text: 'Subject profiling: ENABLED',                delay: 2700, dim: false },
  { text: '─────────────────────────────────────',    delay: 3400, dim: true, small: true },
  { text: 'This is not a game.',                       delay: 4200, dim: false },
  { text: 'You will solve it.',                        delay: 5000, dim: false },
  { text: 'It will study you.',                        delay: 5800, dim: false },
  { text: '─────────────────────────────────────',    delay: 6600, dim: true, small: true },
]

const MIND_LABEL    = { intuitive: 'Intuitive', analytical: 'Analytical', balanced: 'Balanced' }
const VALUE_LABEL   = { utilitarian: 'Utilitarian', principled: 'Principled', contextual: 'Contextual' }
const SOCIAL_LABEL  = { independent: 'Independent', conformist: 'Attuned', adaptive: 'Adaptive' }

const BOOT_LINES_RETURNING = (cycle, lastProfile) => {
  const hasProfile = !!lastProfile
  const priorRead  = hasProfile
    ? `${MIND_LABEL[lastProfile.mindType]} / ${VALUE_LABEL[lastProfile.valueSystem]} / ${SOCIAL_LABEL[lastProfile.socialOrientation]}`
    : null
  const shifted = cycle >= 2
    ? 'What changed is as telling as what didn\'t.'
    : 'Descend and see what shifted.'

  return [
    { text: 'ECHO v1.0.0',                                                delay: 0,    dim: false, bold: true },
    { text: `Cycle ${cycle} complete. Behavioral delta computing...`,      delay: 700,  dim: true  },
    ...(priorRead ? [{ text: `Prior read: ${priorRead}`,                   delay: 1400, dim: true  }] : []),
    { text: '─────────────────────────────────────',                       delay: priorRead ? 2100 : 1400, dim: true, small: true },
    { text: 'You have been here before.',                                   delay: priorRead ? 2900 : 2200, dim: false },
    { text: 'The pattern remembers.',                                       delay: priorRead ? 3800 : 3100, dim: false },
    { text: shifted,                                                        delay: priorRead ? 4700 : 4000, dim: false },
    { text: '─────────────────────────────────────',                       delay: priorRead ? 5500 : 4800, dim: true, small: true },
  ]
}

export default function IntroScreen() {
  const { dispatch, cycleCount, cycleHistory } = useGame()
  const isReturning = cycleCount > 0
  const lastProfile = cycleHistory[cycleHistory.length - 1]?.profile
  const lines = isReturning ? BOOT_LINES_RETURNING(cycleCount, lastProfile) : BOOT_LINES_FIRST

  const [visibleCount, setVisibleCount] = useState(0)
  const [showButton,   setShowButton]   = useState(false)

  useEffect(() => {
    setVisibleCount(0)
    setShowButton(false)
    const timers = lines.map((line, i) =>
      setTimeout(() => setVisibleCount(v => Math.max(v, i + 1)), line.delay)
    )
    const lastDelay = lines[lines.length - 1].delay
    const btnTimer  = setTimeout(() => setShowButton(true), lastDelay + 800)
    return () => { timers.forEach(clearTimeout); clearTimeout(btnTimer) }
  }, [cycleCount])

  const btnLabel = isReturning ? `DESCEND TO CYCLE ${cycleCount + 1}` : 'ENTER ECHO'
  const subLabel = isReturning
    ? `${cycleHistory.length} cycle${cycleHistory.length !== 1 ? 's' : ''} recorded.`
    : 'Your choices are being recorded.'

  return (
    <div className="fixed inset-0 flex flex-col justify-center px-8 bg-black safe-top safe-bottom screen-enter">
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 space-y-2 mb-12">
        {lines.slice(0, visibleCount).map((line, i) => (
          <div
            key={i}
            className={[
              'mono transition-opacity duration-300',
              line.bold  ? 'text-white font-bold text-lg' : '',
              line.dim   ? 'text-slate-600 text-sm'       : 'text-slate-300 text-sm',
              line.small ? 'text-xs'                       : '',
            ].join(' ')}
          >
            {line.text}
            {i === visibleCount - 1 && <span className="cursor-blink" />}
          </div>
        ))}
      </div>

      {showButton && (
        <div className="relative z-10 animate-fade-in space-y-3">
          <button
            onClick={() => dispatch({ type: 'START_GAME' })}
            className="btn-realm mono tracking-widest uppercase text-sm"
          >
            {btnLabel}
          </button>
          <p className="mono text-slate-700 text-xs text-center">{subLabel}</p>

          {isReturning && (
            <button
              onClick={() => dispatch({ type: 'RESET' })}
              className="mono text-xs text-slate-700 text-center w-full pt-2 underline underline-offset-2"
            >
              Reset all cycles
            </button>
          )}
        </div>
      )}
    </div>
  )
}
