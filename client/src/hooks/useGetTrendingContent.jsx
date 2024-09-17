import { useEffect, useState } from 'react'
import { useContentStore } from '../zustand/useContentStore'
import { axiosInstance } from '../utils/axios'

const useGetTrendingContent = () => {
  const [trendingContent, setTrendingContent] = useState(null)
  const { contentType } = useContentStore()

  useEffect(() => {
    const getTrendingContent = async () => {
      const res = await axiosInstance.get(`/movie/trending`)
      setTrendingContent(res.data.content)
    }

    getTrendingContent()
  }, [contentType])

  return { trendingContent }
}

export default useGetTrendingContent
