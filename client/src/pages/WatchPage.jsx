import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useContentStore } from '../zustand/useContentStore'
import { Navbar, WatchPageSkeleton } from '../components'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import ReactPlayer from 'react-player'
import { ORIGINAL_IMG_BASE_URL, SMALL_IMG_BASE_URL } from '../utils/constants'
import { formatReleaseDate } from '../utils/dateFunction'
import { axiosInstance } from '../utils/axios'

const WatchPage = () => {
  const { id } = useParams()
  const [trailers, setTrailers] = useState([])
  const [currentTrailerIdx, setCurrentTrailerIdx] = useState(0)
  const [loading, setLoading] = useState(true)
  const [content, setContent] = useState({})
  const [similarContent, setSimilarContent] = useState([])
  const { contentType } = useContentStore()

  const sliderRef = useRef(null)

  useEffect(() => {
    const getTrailers = async () => {
      try {
        const res = await axiosInstance.get(`/${contentType}/trailers/${id}`)
        setTrailers(res.data.trailers)
      } catch (error) {
        if (error.message.includes('404')) {
          setTrailers([])
        }
      }
    }

    getTrailers()
  }, [contentType, id])

  useEffect(() => {
    const getSimilarContent = async () => {
      try {
        const res = await axiosInstance.get(`/${contentType}/similar/${id}`)
        setSimilarContent(res.data.similar)
      } catch (error) {
        if (error.message.includes('404')) {
          setSimilarContent([])
        }
      }
    }

    getSimilarContent()
  }, [contentType, id])

  useEffect(() => {
    const getContentDetails = async () => {
      try {
        const res = await axiosInstance.get(`/${contentType}/details/${id}`)
        setContent(res.data.content)
      } catch (error) {
        if (error.message.includes('404')) {
          setContent(null)
        }
      } finally {
        setLoading(false)
      }
    }

    getContentDetails()
  }, [contentType, id])

  const handleNext = () => {
    if (currentTrailerIdx < trailers.length - 1)
      setCurrentTrailerIdx(currentTrailerIdx + 1)
  }
  const handlePrev = () => {
    if (currentTrailerIdx > 0) setCurrentTrailerIdx(currentTrailerIdx - 1)
  }

  const scrollLeft = () => {
    if (sliderRef.current)
      sliderRef.current.scrollBy({
        left: -sliderRef.current.offsetWidth,
        behavior: 'smooth',
      })
  }
  const scrollRight = () => {
    if (sliderRef.current)
      sliderRef.current.scrollBy({
        left: sliderRef.current.offsetWidth,
        behavior: 'smooth',
      })
  }

  if (loading)
    return (
      <div className='bg-black p-10 min-h-screen'>
        <WatchPageSkeleton />
      </div>
    )

  if (!content) {
    return (
      <div className='bg-black h-screen text-white'>
        <div className='mx-auto max-w-6xl'>
          <Navbar />
          <div className='mx-auto mt-40 px-4 py-8 h-full text-center'>
            <h2 className='font-bold text-2xl text-balance sm:text-5xl'>
              Content not found 😥
            </h2>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='bg-black min-h-screen text-white'>
      <div className='mx-auto px-4 py-8 h-full container'>
        <Navbar />

        {trailers.length > 0 && (
          <div className='flex justify-between items-center mb-4'>
            <button
              className={`
							bg-gray-500/70 hover:bg-gray-500 text-white py-2 px-4 rounded ${
                currentTrailerIdx === 0 ? 'opacity-50 cursor-not-allowed ' : ''
              }}
							`}
              disabled={currentTrailerIdx === 0}
              onClick={handlePrev}
            >
              <ChevronLeft size={24} />
            </button>

            <button
              className={`
							bg-gray-500/70 hover:bg-gray-500 text-white py-2 px-4 rounded ${
                currentTrailerIdx === trailers.length - 1
                  ? 'opacity-50 cursor-not-allowed '
                  : ''
              }}
							`}
              disabled={currentTrailerIdx === trailers.length - 1}
              onClick={handleNext}
            >
              <ChevronRight size={24} />
            </button>
          </div>
        )}

        <div className='mb-8 sm:px-10 md:px-32 p-2 aspect-video'>
          {trailers.length > 0 && (
            <ReactPlayer
              controls={true}
              width={'100%'}
              height={'70vh'}
              className='mx-auto rounded-lg overflow-hidden'
              url={`https://www.youtube.com/watch?v=${trailers[currentTrailerIdx].key}`}
            />
          )}

          {trailers?.length === 0 && (
            <h2 className='mt-5 text-center text-xl'>
              No trailers available for{' '}
              <span className='font-bold text-red-600'>
                {content?.title || content?.name}
              </span>{' '}
              😥
            </h2>
          )}
        </div>

        {/* movie details */}
        <div className='flex md:flex-row flex-col justify-between items-center gap-20 mx-auto max-w-6xl'>
          <div className='mb-4 md:mb-0'>
            <h2 className='font-bold text-5xl text-balance'>
              {content?.title || content?.name}
            </h2>

            <p className='mt-2 text-lg'>
              {formatReleaseDate(
                content?.release_date || content?.first_air_date
              )}{' '}
              |{' '}
              {content?.adult ? (
                <span className='text-red-600'>18+</span>
              ) : (
                <span className='text-green-600'>PG-13</span>
              )}{' '}
            </p>
            <p className='mt-4 text-lg'>{content?.overview}</p>
          </div>
          <img
            src={ORIGINAL_IMG_BASE_URL + content?.poster_path}
            alt='Poster image'
            className='rounded-md max-h-[600px]'
          />
        </div>

        {similarContent.length > 0 && (
          <div className='relative mx-auto mt-12 max-w-5xl'>
            <h3 className='mb-4 font-bold text-3xl'>Similar Movies/Tv Show</h3>

            <div
              className='flex gap-4 pb-4 overflow-x-scroll group scrollbar-hide'
              ref={sliderRef}
            >
              {similarContent.map((content) => {
                if (content.poster_path === null) return null
                return (
                  <Link
                    key={content.id}
                    to={`/watch/${content.id}`}
                    className='flex-none w-52'
                  >
                    <img
                      src={SMALL_IMG_BASE_URL + content.poster_path}
                      alt='Poster path'
                      className='rounded-md w-full h-auto'
                    />
                    <h4 className='mt-2 font-semibold text-lg'>
                      {content.title || content.name}
                    </h4>
                  </Link>
                )
              })}

              <ChevronRight
                className='top-1/2 right-2 absolute bg-red-600 opacity-0 group-hover:opacity-100 rounded-full w-8 h-8 text-white transition-all -translate-y-1/2 duration-300 cursor-pointer'
                onClick={scrollRight}
              />
              <ChevronLeft
                className='top-1/2 left-2 absolute bg-red-600 opacity-0 group-hover:opacity-100 rounded-full w-8 h-8 text-white transition-all -translate-y-1/2 duration-300 cursor-pointer'
                onClick={scrollLeft}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default WatchPage
