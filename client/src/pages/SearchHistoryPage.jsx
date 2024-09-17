import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { SMALL_IMG_BASE_URL } from '../utils/constants'
import { Trash } from 'lucide-react'
import toast from 'react-hot-toast'
import { axiosInstance } from '../utils/axios'

function formatDate(dateString) {
  // Create a Date object from the input date string
  const date = new Date(dateString)

  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]

  // Extract the month, day, and year from the Date object
  const month = monthNames[date.getUTCMonth()]
  const day = date.getUTCDate()
  const year = date.getUTCFullYear()

  // Return the formatted date string
  return `${month} ${day}, ${year}`
}

const SearchHistoryPage = () => {
  const [searchHistory, setSearchHistory] = useState([])

  useEffect(() => {
    const getSearchHistory = async () => {
      try {
        const res = await axiosInstance.get(`/search/history`)
        setSearchHistory(res.data.content)
      } catch (error) {
        setSearchHistory([])
        toast.error(error.response.data.msg || 'Failed to create account')
      }
    }
    getSearchHistory()
  }, [])

  const handleDelete = async (entry) => {
    try {
      await axiosInstance.delete(`/search/history/${entry.id}`)
      setSearchHistory(searchHistory.filter((item) => item.id !== entry.id))
    } catch (error) {
      toast.error(error.response.data.msg || 'Failed to delete search item')
    }
  }

  if (searchHistory?.length === 0) {
    return (
      <div className='bg-black min-h-screen text-white'>
        <Navbar />
        <div className='mx-auto px-4 py-8 max-w-6xl'>
          <h1 className='mb-8 font-bold text-3xl'>Search History</h1>
          <div className='flex justify-center items-center h-96'>
            <p className='text-xl'>No search history found</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='bg-black min-h-screen text-white'>
      <Navbar />

      <div className='mx-auto px-4 py-8 max-w-6xl'>
        <h1 className='mb-8 font-bold text-3xl'>Search History</h1>
        <div className='gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3'>
          {searchHistory?.map((entry) => (
            <div
              key={entry.id}
              className='flex items-start bg-gray-800 p-4 rounded'
            >
              <img
                src={SMALL_IMG_BASE_URL + entry.image}
                alt='History image'
                className='mr-4 rounded-full object-cover size-16'
              />
              <div className='flex flex-col'>
                <span className='text-lg text-white'>{entry.title}</span>
                <span className='text-gray-400 text-sm'>
                  {formatDate(entry.createdAt)}
                </span>
              </div>

              <span
                className={`py-1 px-3 min-w-20 text-center rounded-full text-sm  ml-auto ${
                  entry.searchType === 'movie'
                    ? 'bg-red-600'
                    : entry.searchType === 'tv'
                    ? 'bg-blue-600'
                    : 'bg-green-600'
                }`}
              >
                {entry.searchType[0].toUpperCase() + entry.searchType.slice(1)}
              </span>
              <Trash
                className='ml-4 hover:text-red-600 cursor-pointer size-5 hover:fill-red-600'
                onClick={() => handleDelete(entry)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SearchHistoryPage
