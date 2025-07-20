import { create } from 'zustand'
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

const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  loading: false,
  error: null,

  fetchTasks: async () => {
    console.log('fetchTasks called')
    set({ loading: true, error: null })
    try {
      const tasks = await getTasks()
      console.log('Tasks received in store:', tasks)
      set({ tasks: tasks, loading: false })
    } catch (error) {
      console.error('Error fetching tasks:', error)
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
        tasks: state.tasks.map((task) => (task.id === id ? updatedTask : task)),
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
      set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== id),
        loading: false
      }))
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
    }
  }
}))

export default useTaskStore
