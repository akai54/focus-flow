import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  getTasks,
  createTask,
  updateTask as apiUpdateTask,
  deleteTask as apiDeleteTask
} from '../services/api'

export interface Task {
  id: string
  title: string
  done: boolean
  createdAt: Date
  updatedAt: Date
}

export interface TaskStore {
  tasks: Task[]
  loading: boolean
  error: string | null
  fetchTasks: () => Promise<void>
  addTask: (title: string) => Promise<void>
  updateTask: (
    id: string,
    updates: Partial<Pick<Task, 'title' | 'done'>>
  ) => Promise<void>
  deleteTask: (id: string) => Promise<void>
}

const useTaskStore = create<TaskStore>()(
  persist(
    (set) => ({
      tasks: [],
      loading: false,
      error: null,

      fetchTasks: async () => {
        set({ loading: true, error: null })
        try {
          const tasks = await getTasks()
          set({ tasks, loading: false })
        } catch (error) {
          set({ error: (error as Error).message, loading: false })
        }
      },

      addTask: async (title: string) => {
        set({ loading: true, error: null })
        try {
          const newTask = await createTask(title)
          set((state) => ({ tasks: [...state.tasks, newTask], loading: false }))
        } catch (error) {
          set({ error: (error as Error).message, loading: false })
        }
      },

      updateTask: async (id, updates) => {
        set({ loading: true, error: null })
        try {
          const updatedTask = await apiUpdateTask(id, updates)
          set((state) => ({
            tasks: state.tasks.map((task) =>
              task.id === id ? updatedTask : task
            ),
            loading: false
          }))
        } catch (error) {
          set({ error: (error as Error).message, loading: false })
        }
      },

      deleteTask: async (id: string) => {
        set({ loading: true, error: null })
        try {
          await apiDeleteTask(id)
          // Refetch tasks to ensure UI is in sync
          const tasks = await getTasks()
          set({ tasks, loading: false })
        } catch (error) {
          set({ error: (error as Error).message, loading: false })
        }
      }
    }),
    {
      name: 'focusflow-tasks', // key in localStorage
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name)
          if (!str) return null
          const { state } = JSON.parse(str)
          return {
            state: {
              ...state,
              tasks: state.tasks.map((t: Task) => ({
                ...t,
                createdAt: new Date(t.createdAt),
                updatedAt: new Date(t.updatedAt)
              }))
            }
          }
        },
        setItem: (name, newValue) => {
          localStorage.setItem(name, JSON.stringify(newValue))
        },
        removeItem: (name) => localStorage.removeItem(name)
      }
    }
  )
)

export default useTaskStore
