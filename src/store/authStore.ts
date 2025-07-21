import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout
} from '../services/api'
import useTaskStore from './taskStore'

interface User {
  _id: string
  email: string
  firstName?: string
  lastName?: string
  dateOfBirth?: Date | null
  country?: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  error: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (
    email: string,
    password: string,
    userData?: {
      firstName?: string
      lastName?: string
      dateOfBirth?: string | Date
      country?: string
    }
  ) => Promise<void>
  updateProfile: (userData: {
    firstName?: string
    lastName?: string
    dateOfBirth?: string | Date
    country?: string
  }) => Promise<void>
  getProfile: () => Promise<void>
  logout: () => void
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      error: null,
      loading: false,

      login: async (email, password) => {
        set({ loading: true, error: null })
        try {
          const { user } = await apiLogin(email, password)
          set({ user, isAuthenticated: true, loading: false })
        } catch (error) {
          set({ error: (error as Error).message, loading: false })
          throw error
        }
      },

      register: async (email, password, userData) => {
        set({ loading: true, error: null })
        try {
          await apiRegister(email, password, userData)
          // After successful registration, log the user in
          const { user } = await apiLogin(email, password)
          set({ user, isAuthenticated: true, loading: false })
        } catch (error) {
          set({ error: (error as Error).message, loading: false })
          throw error
        }
      },

      updateProfile: async (userData) => {
        set({ loading: true, error: null })
        try {
          const { updateUserProfile } = await import('../services/api')
          const updatedUser = await updateUserProfile(userData)
          set({ user: updatedUser, loading: false })
        } catch (error) {
          set({ error: (error as Error).message, loading: false })
          throw error
        }
      },

      getProfile: async () => {
        set({ loading: true, error: null })
        try {
          const { getUserProfile } = await import('../services/api')
          const user = await getUserProfile()
          set({ user, isAuthenticated: true, loading: false })
        } catch (error) {
          set({ error: (error as Error).message, loading: false })
          // If we can't get the profile, we're not authenticated
          set({ isAuthenticated: false })
        }
      },

      logout: () => {
        apiLogout()
        set({ user: null, isAuthenticated: false })
        // Clear tasks from taskStore
        useTaskStore.getState().clearTasks()
      }
    }),
    {
      name: 'focusflow-auth'
    }
  )
)

export default useAuthStore
