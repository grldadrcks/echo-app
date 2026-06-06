import { useState, useEffect } from 'react'
import { useGame, REALMS } from '../context/GameContext.jsx'
import { tapMedium } from '../lib/haptics.js'
import NatureRealm      from '../realms/NatureRealm.jsx'
import AbstractionRealm from '../realms/AbstractionRealm.jsx'
import PerceptionRealm  from '../realms/PerceptionRealm.jsx'
import PsychologyRealm  from '../realms/PsychologyRealm.jsx'
import SociologyRealm   from '../realms/SociologyRealm.jsx'
import AttachmentRealm  from '../realms/AttachmentRealm.jsx'
import MortalityRealm   from '../realms/MortalityRealm.jsx'
import ConflictRealm    from '../realms/ConflictRealm.jsx'
import TimeRealm        from '../realms/TimeRealm.jsx'
import IdentityRealm    from '../realms/IdentityRealm.jsx'
import AgencyRealm      from '../realms/AgencyRealm.jsx'
import DesireRealm      from '../realms/DesireRealm.jsx'
import EmpathyRealm     from '../realms/EmpathyRealm.jsx'
import RiskRealm        from '../realms/RiskRealm.jsx'
import TrustRealm       from '../realms/TrustRealm.jsx'
import DetachmentRealm  from '../realms/DetachmentRealm.jsx'

const COMPONENTS = [
  NatureRealm,
  AbstractionRealm,
  PerceptionRealm,
  PsychologyRealm,
  SociologyRealm,
  AttachmentRealm,
  MortalityRealm,
  ConflictRealm,
  TimeRealm,
  IdentityRealm,
  AgencyRealm,
  DesireRealm,
  EmpathyRealm,
  RiskRealm,
  TrustRealm,
  DetachmentRealm,
]

function RealmIntro({ realm, onEnter }) {
  const [visible, setVisible] = useState(false)
  const [subVisible, setSubVisible] = useState(false)
  const [btnVisible, setBtnVisible] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true),    200)
    const t2 = setTimeout(() => setSubVisible(true), 900)
    const t3 = setTimeout(() => setBtnVisible(true), 1700)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  return (
    <div className="flex-1 flex flex-col justify-center space-y-8 animate-fade-in">
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 70% 50% at 50% 40%, rgba(${realm.accentRgb}, 0.06) 0%, transparent 70%)`,
        }}
      />

      <div className="relative z-10 space-y-4">
        <p
          className="text-white text-2xl font-light leading-snug transition-all duration-700"
          style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(10px)' }}
        >
          {realm.intro}
        </p>
        <p
          className="text-xl leading-snug transition-all duration-700 delay-100"
          style={{
            color: realm.accent,
            opacity: subVisible ? 1 : 0,
            transform: subVisible ? 'translateY(0)' : 'translateY(10px)',
          }}
        >
          {realm.introSub}
        </p>
      </div>

      <div
        className="relative z-10 transition-all duration-500"
        style={{ opacity: btnVisible ? 1 : 0, transform: btnVisible ? 'translateY(0)' : 'translateY(8px)' }}
      >
        <button onClick={() => { tapMedium(); onEnter() }} className="btn-realm mono tracking-widest uppercase text-sm">
          BEGIN
        </button>
      </div>
    </div>
  )
}

export default function RealmScreen() {
  const { currentRealm } = useGame()
  const [introShown, setIntroShown] = useState(false)

  // Reset intro when realm changes
  useEffect(() => {
    setIntroShown(false)
  }, [currentRealm])

  const realm = REALMS[currentRealm]
  const ActiveRealm = COMPONENTS[currentRealm]

  return (
    <div
      key={currentRealm}
      className="fixed inset-0 flex flex-col safe-top safe-bottom realm-transition overflow-y-auto"
      style={{ backgroundColor: 'var(--app-bg)' }}
    >
      {/* Top accent gradient */}
      <div
        className="absolute top-0 left-0 right-0 h-36 pointer-events-none"
        style={{ background: `linear-gradient(to bottom, rgba(${realm.accentRgb}, 0.07), transparent)` }}
      />

      {/* Header — always visible */}
      <div className="relative z-10 px-6 pt-2 pb-4">
        <div className="flex gap-1.5 mb-5">
          {REALMS.map((r, i) => (
            <div
              key={r.id}
              className="h-0.5 flex-1 rounded-full transition-all duration-700"
              style={{
                backgroundColor: i <= currentRealm ? realm.accent : 'rgba(255,255,255,0.08)',
                opacity: i === currentRealm ? 1 : i < currentRealm ? 0.5 : 0.15,
              }}
            />
          ))}
        </div>
        <span
          className="mono text-xs font-medium"
          style={{ color: `rgba(${realm.accentRgb}, 0.55)` }}
        >
          STRATUM {currentRealm + 1} / {REALMS.length}
        </span>
        <h1
          className="mono font-bold text-2xl tracking-widest mt-0.5"
          style={{ color: realm.accent }}
        >
          {realm.label}
        </h1>
      </div>

      {/* Body — intro card or realm content */}
      <div className="relative z-10 flex-1 flex flex-col px-6 pb-8">
        {!introShown ? (
          <RealmIntro realm={realm} onEnter={() => setIntroShown(true)} />
        ) : (
          <div className="animate-fade-in">
            <ActiveRealm />
          </div>
        )}
      </div>
    </div>
  )
}
