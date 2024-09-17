import { useState } from 'react'
import { Link } from 'react-router-dom'
import { LogOut, Menu, Search } from 'lucide-react'
import { useAuthStore } from '../zustand/useAuthStore'
import { useContentStore } from '../zustand/useContentStore'
import Logo from '/logo.svg'

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, logout } = useAuthStore()
  const { setContentType } = useContentStore()

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)

  return (
    <header className='flex flex-wrap justify-between items-center mx-auto p-4 max-w-6xl h-20'>
      <div className='z-50 flex items-center gap-10'>
        <Link to='/'>
          <img src={Logo} alt='Netflix Logo' className='w-32 sm:w-40' />
        </Link>

        {/* desktop navbar items */}
        <div className='sm:flex items-center gap-2 hidden'>
          <Link
            to='/'
            className='hover:underline'
            onClick={() => setContentType('movie')}
          >
            Movies
          </Link>
          <Link
            to='/'
            className='hover:underline'
            onClick={() => setContentType('tv')}
          >
            Tv Shows
          </Link>
          <Link to='/history' className='hover:underline'>
            Search History
          </Link>
        </div>
      </div>

      <div className='z-50 flex items-center gap-2'>
        <Link to={'/search'}>
          <Search className='cursor-pointer size-6' />
        </Link>
        <img
          src={user.image}
          alt='Avatar'
          className='rounded h-8 cursor-pointer'
        />
        <LogOut className='cursor-pointer size-6' onClick={logout} />
        <div className='sm:hidden'>
          <Menu className='cursor-pointer size-6' onClick={toggleMobileMenu} />
        </div>
      </div>

      {/* mobile navbar items */}
      {isMobileMenuOpen && (
        <div className='z-50 border-gray-800 sm:hidden bg-black mt-4 border rounded w-full'>
          <Link
            to={'/'}
            className='block p-2 hover:underline'
            onClick={toggleMobileMenu}
          >
            Movies
          </Link>
          <Link
            to={'/'}
            className='block p-2 hover:underline'
            onClick={toggleMobileMenu}
          >
            Tv Shows
          </Link>
          <Link
            to={'/history'}
            className='block p-2 hover:underline'
            onClick={toggleMobileMenu}
          >
            Search History
          </Link>
        </div>
      )}
    </header>
  )
}

export default Navbar
