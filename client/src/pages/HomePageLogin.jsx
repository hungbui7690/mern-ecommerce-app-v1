import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Info, Play } from 'lucide-react'
import useGetTrendingContent from '../hooks/useGetTrendingContent'
import { useContentStore } from '../zustand/useContentStore'
import { MovieSlider, Navbar } from '../components'
import {
  MOVIE_CATEGORIES,
  ORIGINAL_IMG_BASE_URL,
  TV_CATEGORIES,
} from '../utils/constants'

const HomePageLogin = () => {
  const { trendingContent } = useGetTrendingContent()
  const { contentType } = useContentStore()
  const [imgLoading, setImgLoading] = useState(true)

  if (!trendingContent)
    return (
      <div className='relative p-4 h-screen text-white'>
        <Navbar />
        <div className='top-0 left-0 -z-10 absolute flex justify-center items-center bg-black/70 w-full h-full shimmer' />
      </div>
    )

  return (
    <>
      <div className='relative p-4 h-screen text-white'>
        <Navbar />

        {/* COOL OPTIMIZATION HACK FOR IMAGES */}
        {imgLoading && (
          <div className='top-0 left-0 -z-10 absolute flex justify-center items-center bg-black/70 w-full h-full shimmer' />
        )}

        <img
          src={ORIGINAL_IMG_BASE_URL + trendingContent?.backdrop_path}
          alt='Hero img'
          className='top-0 left-0 -z-50 absolute w-full h-full object-cover'
          onLoad={() => {
            setImgLoading(false)
          }}
        />

        <div
          className='top-0 left-0 -z-50 absolute bg-black/50 w-full h-full'
          aria-hidden='true'
        />
        <div className='top-0 left-0 absolute flex flex-col justify-center px-8 md:px-16 lg:px-32 w-full h-full'>
          <div className='top-0 left-0 -z-10 absolute bg-gradient-to-b from-black via-transparent to-transparent w-full h-full' />

          <div className='max-w-2xl'>
            <h1 className='mt-4 font-extrabold text-6xl text-balance'>
              {trendingContent?.title || trendingContent?.name}
            </h1>
            <p className='mt-2 text-lg'>
              {trendingContent?.release_date?.split('-')[0] ||
                trendingContent?.first_air_date.split('-')[0]}{' '}
              | {trendingContent?.adult ? '18+' : 'PG-13'}
            </p>

            <p className='mt-4 text-lg'>
              {trendingContent?.overview.length > 200
                ? trendingContent?.overview.slice(0, 200) + '...'
                : trendingContent?.overview}
            </p>
          </div>

          <div className='flex mt-8'>
            <Link
              to={`/watch/${trendingContent?.id}`}
              className='flex items-center bg-white hover:bg-white/80 mr-4 px-4 py-2 rounded font-bold text-black'
            >
              <Play className='mr-2 fill-black size-6' />
              Play
            </Link>

            <Link
              to={`/watch/${trendingContent?.id}`}
              className='flex items-center bg-gray-500/70 hover:bg-gray-500 px-4 py-2 rounded text-white'
            >
              <Info className='mr-2 size-6' />
              More Info
            </Link>
          </div>
        </div>
      </div>

      <div className='flex flex-col gap-10 bg-black py-10'>
        {contentType === 'movie'
          ? MOVIE_CATEGORIES.map((category) => (
              <MovieSlider key={category} category={category} />
            ))
          : TV_CATEGORIES.map((category) => (
              <MovieSlider key={category} category={category} />
            ))}
      </div>
    </>
  )
}

export default HomePageLogin
