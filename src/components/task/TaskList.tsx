import useTaskStore from '../../store/taskStore'
import TaskItem from './TaskItem'

const TaskList = () => {
  const { tasks } = useTaskStore()

  if (tasks.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="mb-4 text-4xl">📝</div>
        <h3 className="mb-2 text-lg font-medium text-white">No tasks yet!</h3>
        <p className="text-primary-light">
          Add a new task above to get started.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  )
}

export default TaskList
