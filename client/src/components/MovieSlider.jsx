import { useEffect, useRef, useState } from 'react'
import { useContentStore } from '../zustand/useContentStore'
import { Link } from 'react-router-dom'
import { SMALL_IMG_BASE_URL } from '../utils/constants'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { axiosInstance } from '../utils/axios'

const MovieSlider = ({ category }) => {
  const { contentType } = useContentStore()
  const [content, setContent] = useState([])
  const [showArrows, setShowArrows] = useState(false) // 1. show arrow when hover on slider

  const sliderRef = useRef(null)

  // format category name: now_playing -> Now playing
  const formattedCategoryName = category
    .replaceAll('_', ' ')
    .split(' ')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ')
  const formattedContentType = contentType === 'movie' ? 'Movies' : 'TV Shows'

  useEffect(() => {
    const getContent = async () => {
      const res = await axiosInstance.get(`/${contentType}/${category}`)
      setContent(res.data.content)
    }

    getContent()
  }, [contentType, category])

  // https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollBy -> scrollBy() method scrolls the document by the specified number of pixels -> options: left, top, behavior
  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: -sliderRef.current.getBoundingClientRect().width / 2,
        behavior: 'smooth',
      })
    }
  }
  const scrollRight = () => {
    sliderRef.current.scrollBy({
      left: sliderRef.current.getBoundingClientRect().width / 2,
      behavior: 'smooth',
    })
  }

  return (
    <div
      className='relative bg-black px-5 md:px-20 text-white' // 2.
      onMouseEnter={() => setShowArrows(true)}
      onMouseLeave={() => setShowArrows(false)}
    >
      <h2 className='mb-4 font-bold text-2xl'>
        {formattedCategoryName} {formattedContentType}
      </h2>
      <div
        className='flex space-x-4 overflow-x-scroll scrollbar-hide'
        ref={sliderRef}
      >
        {content.map((item) => (
          <Link
            to={`/watch/${item.id}`}
            className='relative min-w-[250px] group'
            key={item.id}
          >
            <div className='rounded-lg overflow-hidden'>
              <img
                src={SMALL_IMG_BASE_URL + item.backdrop_path}
                alt='Movie image'
                className='group-hover:scale-125 transition-transform duration-300 ease-in-out'
              />
            </div>
            <p className='mt-2 text-center'>{item.title || item.name}</p>
          </Link>
        ))}
      </div>

      {/* 3. */}
      {showArrows && (
        <>
          <button
            className='top-1/2 left-5 md:left-24 z-10 absolute flex justify-center items-center bg-black bg-opacity-50 hover:bg-opacity-75 rounded-full text-white -translate-y-1/2 size-12'
            onClick={scrollLeft}
          >
            <ChevronLeft size={24} />
          </button>
          <button
            className='top-1/2 right-5 md:right-24 z-10 absolute flex justify-center items-center bg-black bg-opacity-50 hover:bg-opacity-75 rounded-full text-white -translate-y-1/2 size-12'
            onClick={scrollRight}
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}
    </div>
  )
}

export default MovieSlider
