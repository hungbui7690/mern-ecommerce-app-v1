import toast from 'react-hot-toast'
import Logo from '/logo.svg'
import { Link, useNavigate } from 'react-router-dom'

const HomePageNotLogin = () => {
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const email = formData.get('email')
    if (!email) {
      toast.error('Please enter a valid email address')
      return
    }
    navigate('/signup?email=' + email)
  }

  return (
    <div className='mx-auto w-full'>
      <div className='h-screen hero-bg'>
        <header className='flex justify-between items-center mx-auto mb-20 p-10 pb-10 max-w-6xl'>
          <Link to={'/'}>
            <img src={Logo} alt='logo' className='w-32 md:w-52 text-red-500' />
          </Link>
          <Link
            to={'/login'}
            className='bg-red-600 px-4 py-2 rounded text-white px'
          >
            {' '}
            Sign In
          </Link>
        </header>

        {/* Hero Section */}
        <div className='flex flex-col justify-center items-center mx-20 h-96 text-center text-white'>
          <h1 className='mb-4 font-bold text-4xl md:text-6xl'>
            Unlimited movies, <br /> TV shows, and more.
          </h1>
          <p className='mb-10 font-semibold text-lg md:text-xl'>
            Starts at $6.99/month. Cancel anytime.
          </p>
          <p className='text-xs'>
            Ready to watch? Enter your email to create or restart your
            membership.
          </p>
          <form
            onSubmit={handleSubmit}
            className='flex flex-wrap justify-center space-x-1 px-4'
          >
            <input
              type='email'
              name='email'
              placeholder='Email address'
              className='border-emerald-500 bg-black/70 mt-4 px-4 py-2 border rounded w-72 md:w-96'
            />
            <button className='bg-red-600 mt-4 px-4 py-2 rounded w-72 sm:w-auto text-white'>
              Get Started
            </button>
          </form>
        </div>
      </div>

      {/* ENJOY */}
      <div className='bg-black py-10 p-4 text-white'>
        <div className='flex md:flex-row flex-col justify-center items-center mx-auto px-4 md:px-2 max-w-6xl'>
          <div className='flex-1 text-center md:text-left'>
            <h2 className='mb-4 font-extrabold text-4xl md:text-5xl'>
              Enjoy on your TV
            </h2>
            <p className='text-lg md:text-xl'>
              Watch on Smart TVs, PlayStation, Xbox, Chromecast, Apple TV,
              Blu-ray players, and more.
            </p>
          </div>
          <div className='relative flex-1'>
            <img src='/tv.png' alt='Tv image' className='relative z-20 mt-4' />
            <video
              className='top-1/2 left-1/2 z-10 absolute h-1/2 -translate-x-1/2 -translate-y-1/2'
              playsInline
              autoPlay={true}
              muted
              loop
            >
              <source src='/hero-vid.m4v' type='video/mp4' />
            </video>
          </div>
        </div>
      </div>

      {/* DOWNLOAD */}
      <div className='bg-black py-10 text-white'>
        <div className='flex md:flex-row flex-col-reverse justify-center items-center mx-auto px-4 md:px-2 max-w-6xl'>
          <div className='relative flex-1'>
            <div className='relative'>
              <img
                src='/download-lg.png'
                alt='Stranger Things img'
                className='mt-4'
              />

              <div className='bottom-5 left-1/2 absolute flex items-center gap-2 border-slate-500 bg-black px-2 border rounded-md w-3/4 lg:w-1/2 h-24 -translate-x-1/2'>
                <img src='/download-sm.png' alt='image' className='h-full' />
                <div className='flex justify-between items-center w-full'>
                  <div className='flex flex-col gap-0'>
                    <span className='font-bold text-md lg:text-lg'>
                      Stranger Things
                    </span>
                    <span className='text-blue-500 text-sm'>
                      Downloading...
                    </span>
                  </div>

                  <img src='/download-icon.gif' alt='' className='h-12' />
                </div>
              </div>
            </div>
          </div>
          <div className='flex-1 text-center md:text-left'>
            <h2 className='mb-4 font-extrabold text-4xl text-balance md:text-5xl'>
              Download your shows to watch offline
            </h2>
            <p className='text-lg md:text-xl'>
              Save your favorites easily and always have something to watch.
            </p>
          </div>
        </div>
      </div>

      {/* 3rd section */}
      <div className='bg-black py-10 text-white'>
        <div className='flex md:flex-row flex-col justify-center items-center mx-auto px-4 md:px-2 max-w-6xl'>
          {/* left side */}
          <div className='flex-1 text-center md:text-left'>
            <h2 className='mb-4 font-extrabold text-4xl md:text-5xl'>
              Watch everywhere
            </h2>
            <p className='text-lg md:text-xl'>
              Stream unlimited movies and TV shows on your phone, tablet,
              laptop, and TV.
            </p>
          </div>

          {/* right side */}
          <div className='relative flex-1 overflow-hidden'>
            <img
              src='/device-pile.png'
              alt='Device image'
              className='relative z-20 mt-4'
            />
            <video
              className='top-2 left-1/2 z-10 absolute max-w-[63%] h-4/6 -translate-x-1/2'
              playsInline
              autoPlay={true}
              muted
              loop
            >
              <source src='/video-devices.m4v' type='video/mp4' />
            </video>
          </div>
        </div>
      </div>

      {/* 4th section*/}
      <div className='bg-black py-10 text-white'>
        <div className='flex md:flex-row flex-col-reverse justify-center items-center mx-auto px-4 md:px-2 max-w-6xl'>
          {/* left */}
          <div className='relative flex-1'>
            <img src='/kids.png' alt='Enjoy on your TV' className='mt-4' />
          </div>
          {/* right */}
          <div className='flex-1 text-center md:text-left'>
            <h2 className='mb-4 font-extrabold text-4xl md:text-5xl'>
              Create profiles for kids
            </h2>
            <p className='text-lg md:text-xl'>
              Send kids on adventures with their favorite characters in a space
              made just for them—free with your membership.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePageNotLogin
