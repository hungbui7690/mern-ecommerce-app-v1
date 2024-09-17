import { Link } from 'react-router-dom'
import NotFoundImg from '/404.svg'
import Logo from '/logo.svg'

const NotFoundPage = () => {
  return (
    <div className='flex flex-col p-8 gap-12'>
      <header className=''>
        <Link to={'/'}>
          <img src={Logo} alt='Netflix' className='h-8' />
        </Link>
      </header>
      <div className='flex flex-col gap-8 justify-center items-center'>
        <img src={NotFoundImg} alt='404' className='w-64' />
        <main className='flex flex-col justify-center gap-8 items-center'>
          <h1 className='font-semibold text-7xl'>Lost your way?</h1>
          <p className='text-xl'>
            Sorry, we {"can't"} find that page. {"You'll"} find lots to explore
            on the home page.
          </p>
          <Link
            to={'/'}
            className='bg-[#B91C1C] px-4 py-2 rounded font-bold text-white mx-auto'
          >
            Back to Home
          </Link>
        </main>
      </div>
    </div>
  )
}

export default NotFoundPage
