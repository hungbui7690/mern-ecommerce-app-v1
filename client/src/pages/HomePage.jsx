import { useAuthStore } from '../zustand/useAuthStore'
import HomePageNotLogin from './HomePageNotLogin'
import HomePageLogin from './HomePageLogin'

const HomePage = () => {
  const { user } = useAuthStore()

  return <>{user ? <HomePageLogin /> : <HomePageNotLogin />}</>
}
export default HomePage
