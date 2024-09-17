import { axiosInstance } from '../utils/axios'
import toast from 'react-hot-toast'
import { create } from 'zustand'

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  isLoading: false,
  setEmail: (email) => set({ email }),
  signup: async (formData) => {
    set({ isLoading: true })
    try {
      const res = await axiosInstance.post('/auth/signup', formData)
      set({ user: res.data.user, isLoading: false })
      toast.success('Account created successfully')
      localStorage.setItem('user', JSON.stringify(res.data.user))
    } catch (error) {
      set({ user: null })
      toast.error(error.response.data.msg || 'Failed to create account')
    } finally {
      set({ isLoading: false })
    }
  },
  login: async (formData) => {
    set({ isLoading: true })
    try {
      const res = await axiosInstance.post('/auth/login', formData)
      set({ user: res.data.user })
      toast.success('Logged in successfully')
      localStorage.setItem('user', JSON.stringify(res.data.user))
    } catch (error) {
      set({ user: null })
      toast.error(error.res.data.message || 'Failed to login')
    } finally {
      set({ isLoading: false })
    }
  },
  logout: async () => {
    set({ isLoading: true })
    try {
      await axiosInstance.post('/auth/logout')
      set({ user: null })
      toast.success('Logged out successfully')
      localStorage.removeItem('user')
    } catch (error) {
      toast.error(error.res.data.message || 'Failed to logout')
    } finally {
      set({ isLoading: false })
    }
  },
  getCurrentUser: async () => {
    set({ isLoading: true })
    try {
      const res = await axiosInstance.post('/auth/getCurrentUser')
      set({ user: res.data.user, isLoading: false })
      localStorage.setItem('user', JSON.stringify(res.data.user))
    } catch (error) {
      set({ user: null })
      toast.error(error.res.data.message || 'Failed to get user')
    } finally {
      set({ isLoading: false })
    }
  },
}))
