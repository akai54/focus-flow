import { useEffect } from 'react'
import useTaskStore from '../../store/taskStore'
import TaskInput from './TaskInput'
import TaskList from './TaskList'

const TaskPage = () => {
  const { tasks, loading, error, fetchTasks } = useTaskStore()

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const completedTasks = tasks.filter((task) => task.done)
  const pendingTasks = tasks.filter((task) => !task.done)

  const completionRate =
    tasks.length > 0
      ? Math.round((completedTasks.length / tasks.length) * 100)
      : 0

  return (
    <div className="flex-1 space-y-6 bg-dark p-6 font-spline">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">My Tasks</h1>
            <p className="mt-1 text-primary-light">
              Manage your tasks efficiently and stay on top of your schedule.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="hidden items-center gap-6 text-sm md:flex">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {tasks.length}
              </div>
              <div className="text-primary-light">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {pendingTasks.length}
              </div>
              <div className="text-primary-light">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-medium">
                {completedTasks.length}
              </div>
              <div className="text-primary-light">Completed</div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        {tasks.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white">Progress</span>
              <span className="font-medium text-primary-light">
                {completionRate}% completed
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-dark-border">
              <div
                className="h-full rounded-full bg-primary transition-all duration-300"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Task Input */}
      <div className="space-y-4">
        <TaskInput />
      </div>

      {/* Tasks List */}
      <div className="flex-1">
        {loading && <p className="text-center text-white">Loading tasks...</p>}
        {error && <p className="text-center text-red-500">Error: {error}</p>}
        {!loading && !error && <TaskList />}
      </div>
    </div>
  )
}

export default TaskPage
