import { useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import useTaskStore from '../../store/taskStore'
import {
  TasksIcon,
  HomeIcon,
  CalendarIcon,
  ReportsIcon,
  SettingsIcon
} from '../icons/FigmaIcons'

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

const SyncSpinner = () => (
  <svg
    className="size-5 animate-spin text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
)

const Sidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
  const { loading } = useTaskStore()
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const menuItems = [
    { id: 'home', label: 'Home', icon: HomeIcon },
    { id: 'tasks', label: 'My Tasks', icon: TasksIcon },
    { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
    { id: 'reports', label: 'Reports', icon: ReportsIcon },
    { id: 'settings', label: 'Settings', icon: SettingsIcon }
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex h-screen w-80 flex-col bg-dark p-4 font-spline">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between border-b border-dark-border pb-4">
        <h1 className="text-lg font-bold text-white">FocusFlow</h1>
        {loading && <SyncSpinner />}
      </div>

      {/* Navigation */}
      <nav className="mb-6 flex flex-col gap-2">
        {menuItems.map((item) => {
          const IconComponent = item.icon
          const isActive = activeTab === item.id

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-primary-dark text-white'
                  : 'text-white hover:bg-primary-dark/50'
              }`}
            >
              <div className="flex size-6 items-center justify-center">
                <IconComponent className="size-6" fill="#FFFFFF" />
              </div>
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* User Profile */}
      <div className="mt-auto border-t border-dark-border pt-4">
        <div
          onClick={() => setActiveTab('settings')}
          className="flex cursor-pointer items-center gap-3 rounded-xl p-3 transition-colors hover:bg-dark-card"
        >
          <div className="size-8 rounded-full bg-gradient-to-r from-primary to-primary-dark"></div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-white">
              {user?.firstName
                ? `${user.firstName} ${user.lastName || ''}`
                : user?.email || 'User'}
            </div>
            <div className="text-xs text-primary-light">
              View Profile & Settings
            </div>
          </div>
        </div>
        <div className="mt-2 px-3">
          <button
            onClick={handleLogout}
            className="w-full rounded-lg bg-red-600 py-1.5 text-sm font-medium text-white hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
