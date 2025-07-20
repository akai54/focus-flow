import { useState } from 'react'
import useTaskStore from '../../store/taskStore'

const TaskInput = () => {
  const [title, setTitle] = useState('')
  const { addTask, loading } = useTaskStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || loading) return

    await addTask(title.trim())
    setTitle('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a new task..."
        className="grow rounded-lg border border-dark-border bg-dark-card px-4 py-2 text-white placeholder:text-primary-light focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        disabled={loading}
      />
      <button
        type="submit"
        className="rounded-lg bg-primary px-6 py-2 font-semibold text-dark transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-gray-500"
        disabled={loading || !title.trim()}
      >
        {loading ? 'Adding...' : 'Add'}
      </button>
    </form>
  )
}

export default TaskInput
