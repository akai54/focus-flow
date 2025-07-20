import { useState, useEffect, useMemo } from 'react'
import useTaskStore from '../store/taskStore'

const CalendarView = () => {
  const { tasks, loading, error, fetchTasks } = useTaskStore()
  const [currentDate, setCurrentDate] = useState(new Date())

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  // Group tasks by date
  const tasksByDate = useMemo(() => {
    const grouped: { [key: string]: typeof tasks } = {}

    tasks.forEach((task) => {
      const dateKey = task.createdAt.toDateString()
      if (!grouped[dateKey]) {
        grouped[dateKey] = []
      }
      grouped[dateKey].push(task)
    })

    return grouped
  }, [tasks])

  // Get days in current month
  const getDaysInMonth = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const dateKey = date.toDateString()
      const dayTasks = tasksByDate[dateKey] || []

      days.push({
        date,
        day,
        tasks: dayTasks,
        isToday: date.toDateString() === new Date().toDateString()
      })
    }

    return days
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1))
      return newDate
    })
  }

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  if (loading) {
    return (
      <div className="flex-1 bg-dark p-6 font-spline">
        <div className="py-20 text-center">
          <p className="text-white">Loading calendar...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 bg-dark p-6 font-spline">
        <div className="py-20 text-center">
          <p className="text-red-500">Error loading tasks: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 bg-dark p-6 font-spline">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Calendar</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigateMonth('prev')}
            className="rounded-lg bg-dark-card p-2 text-white hover:bg-dark-border"
          >
            ←
          </button>
          <h2 className="text-xl font-semibold text-white">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <button
            onClick={() => navigateMonth('next')}
            className="rounded-lg bg-dark-card p-2 text-white hover:bg-dark-border"
          >
            →
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="rounded-lg bg-dark-card p-4">
        {/* Week day headers */}
        <div className="mb-4 grid grid-cols-7 gap-1">
          {weekDays.map((day) => (
            <div
              key={day}
              className="p-2 text-center text-sm font-medium text-primary-light"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {getDaysInMonth().map((dayData, index) => (
            <div
              key={index}
              className={`min-h-[120px] rounded-lg border p-2 ${
                dayData
                  ? dayData.isToday
                    ? 'border-primary bg-primary/10'
                    : 'border-dark-border bg-dark'
                  : 'border-transparent'
              }`}
            >
              {dayData && (
                <>
                  <div
                    className={`mb-2 text-sm font-medium ${
                      dayData.isToday ? 'text-primary' : 'text-white'
                    }`}
                  >
                    {dayData.day}
                  </div>
                  <div className="space-y-1">
                    {dayData.tasks.slice(0, 3).map((task) => (
                      <div
                        key={task.id}
                        className={`truncate rounded px-2 py-1 text-xs ${
                          task.done
                            ? 'bg-primary-dark/30 text-primary-light line-through'
                            : 'bg-primary-dark text-white'
                        }`}
                        title={task.title}
                      >
                        {task.title}
                      </div>
                    ))}
                    {dayData.tasks.length > 3 && (
                      <div className="text-xs text-primary-light">
                        +{dayData.tasks.length - 3} more
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Today's tasks summary */}
      <div className="mt-6">
        <h3 className="mb-4 text-xl font-semibold text-white">
          Today&apos;s Tasks
        </h3>
        <div className="space-y-2">
          {(tasksByDate[new Date().toDateString()] || []).map((task) => (
            <div
              key={task.id}
              className={`flex items-center gap-3 rounded-lg bg-dark-card p-3 ${
                task.done ? 'opacity-60' : ''
              }`}
            >
              <input
                type="checkbox"
                checked={task.done}
                readOnly
                className="form-checkbox size-4 rounded border-primary-light bg-dark text-primary"
              />
              <span
                className={`flex-1 ${
                  task.done ? 'text-primary-light line-through' : 'text-white'
                }`}
              >
                {task.title}
              </span>
            </div>
          ))}
          {!tasksByDate[new Date().toDateString()]?.length && (
            <p className="text-primary-light">No tasks for today</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default CalendarView
