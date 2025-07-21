import { useState, useRef, useEffect } from 'react'
import useTaskStore, { Task } from '../../store/taskStore'

interface TaskItemProps {
  task: Task
}

const TaskItem = ({ task }: TaskItemProps) => {
  const { updateTask, deleteTask, loading } = useTaskStore()
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(task.title)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [isEditing])

  const handleToggle = () => {
    if (loading) return
    updateTask(task.id, { done: !task.done })
  }

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    // Do nothing if there are no changes
    if (!title.trim() || title === task.title) {
      setIsEditing(false)
      return
    }

    try {
      await updateTask(task.id, { title: title.trim() })
    } catch (err) {
      console.error('Failed to update task:', err)
      // Revert title on error
      setTitle(task.title)
    } finally {
      setIsEditing(false)
    }
  }

  const handleDelete = () => {
    if (loading) return
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(task.id)
    }
  }

  return (
    <div
      className={`flex items-center gap-4 rounded-lg p-4 transition-all duration-200 ${
        task.done
          ? 'bg-dark-card/30 opacity-60'
          : 'bg-dark-card hover:bg-dark-card/80'
      }`}
    >
      <input
        type="checkbox"
        checked={task.done}
        onChange={handleToggle}
        className="form-checkbox size-5 rounded border-primary-light bg-dark text-primary focus:ring-primary"
        disabled={loading}
      />
      <div className="flex-1">
        {isEditing ? (
          <form onSubmit={handleSave}>
            <input
              ref={inputRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => handleSave()}
              className="w-full border-b border-primary-light bg-transparent font-medium text-white focus:border-primary focus:outline-none"
              disabled={loading}
            />
          </form>
        ) : (
          <span
            className={`font-medium ${
              task.done ? 'text-primary-light line-through' : 'text-white'
            }`}
            onDoubleClick={() => !task.done && setIsEditing(true)}
          >
            {task.title}
          </span>
        )}
      </div>
      <button
        onClick={() => setIsEditing(true)}
        className="p-1 text-primary-light transition-colors duration-200 hover:text-primary disabled:cursor-not-allowed"
        disabled={task.done || isEditing || loading}
        title="Edit task"
      >
        ✏️
      </button>
      <button
        onClick={handleDelete}
        className="p-1 text-primary-light transition-colors duration-200 hover:text-red-500 disabled:cursor-not-allowed"
        disabled={loading}
        title="Delete task"
      >
        🗑️
      </button>
    </div>
  )
}

export default TaskItem
