import { Outlet } from 'react-router-dom'
import { Navbar, Footer } from '../components'

const SharedLayout = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  )
}
export default SharedLayout
