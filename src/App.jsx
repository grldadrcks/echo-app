import { useGame } from './context/GameContext.jsx'
import IntroScreen      from './screens/IntroScreen.jsx'
import RealmScreen      from './screens/RealmScreen.jsx'
import TransitionScreen from './screens/TransitionScreen.jsx'
import ProfileScreen    from './screens/ProfileScreen.jsx'

export default function App() {
  const { screen } = useGame()
  if (screen === 'realm')       return <RealmScreen />
  if (screen === 'transition')  return <TransitionScreen />
  if (screen === 'profile')     return <ProfileScreen />
  return <IntroScreen />
}
