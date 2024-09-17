import { create } from 'zustand'

export const useContentStore = create((set) => ({
  contentType: 'movie', // either 'movie' or 'tv'
  setContentType: (type) => set({ contentType: type }),
}))
