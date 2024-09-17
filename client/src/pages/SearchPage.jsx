import { useState } from 'react'
import { useContentStore } from '../zustand/useContentStore'
import { Navbar } from '../components'
import { Search } from 'lucide-react'
import toast from 'react-hot-toast'
import { ORIGINAL_IMG_BASE_URL } from '../utils/constants'
import { Link } from 'react-router-dom'
import { axiosInstance } from '../utils/axios'

const SearchPage = () => {
  const [activeTab, setActiveTab] = useState('movie')
  const [searchTerm, setSearchTerm] = useState('')

  const [results, setResults] = useState([])
  const { setContentType } = useContentStore()

  const handleTabClick = (tab) => {
    setActiveTab(tab)
    tab === 'movie' ? setContentType('movie') : setContentType('tv')
    setResults([])
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    try {
      const res = await axiosInstance.get(`/search/${activeTab}/${searchTerm}`)
      setResults(res.data.content)
    } catch (error) {
      if (error.response.status === 404) {
        toast.error(
          'Nothing found, make sure you are searching under the right category'
        )
      } else {
        toast.error('An error occurred, please try again later')
      }
    }
  }

  return (
    <div className='bg-black min-h-screen text-white'>
      <Navbar />
      <div className='mx-auto px-4 py-8 container'>
        <div className='flex justify-center gap-3 mb-4'>
          <button
            className={`py-2 px-4 rounded ${
              activeTab === 'movie' ? 'bg-red-600' : 'bg-gray-800'
            } hover:bg-red-700`}
            onClick={() => handleTabClick('movie')}
          >
            Movies
          </button>
          <button
            className={`py-2 px-4 rounded ${
              activeTab === 'tv' ? 'bg-red-600' : 'bg-gray-800'
            } hover:bg-red-700`}
            onClick={() => handleTabClick('tv')}
          >
            TV Shows
          </button>
          <button
            className={`py-2 px-4 rounded ${
              activeTab === 'person' ? 'bg-red-600' : 'bg-gray-800'
            } hover:bg-red-700`}
            onClick={() => handleTabClick('person')}
          >
            Person
          </button>
        </div>

        <form
          className='flex items-stretch gap-2 mx-auto mb-8 max-w-2xl'
          onSubmit={handleSearch}
        >
          <input
            type='text'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={'Search for a ' + activeTab}
            className='bg-gray-800 p-2 rounded w-full text-white'
          />
          <button className='bg-red-600 hover:bg-red-700 p-2 rounded text-white'>
            <Search className='size-6' />
          </button>
        </form>

        <div className='gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
          {results.map((result) => {
            if (!result.poster_path && !result.profile_path) return null

            return (
              <div key={result.id} className='bg-gray-800 p-4 rounded'>
                {activeTab === 'person' ? (
                  <div className='flex flex-col items-center'>
                    <img
                      src={ORIGINAL_IMG_BASE_URL + result.profile_path}
                      alt={result.name}
                      className='mx-auto rounded max-h-96'
                    />
                    <h2 className='mt-2 font-bold text-xl'>{result.name}</h2>
                  </div>
                ) : (
                  <Link
                    to={'/watch/' + result.id}
                    onClick={() => {
                      setContentType(activeTab)
                    }}
                  >
                    <img
                      src={ORIGINAL_IMG_BASE_URL + result.poster_path}
                      alt={result.title || result.name}
                      className='rounded w-full h-auto'
                    />
                    <h2 className='mt-2 font-bold text-xl'>
                      {result.title || result.name}
                    </h2>
                  </Link>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default SearchPage
