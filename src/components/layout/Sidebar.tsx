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

const Sidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
  const menuItems = [
    { id: 'home', label: 'Home', icon: HomeIcon },
    { id: 'tasks', label: 'My Tasks', icon: TasksIcon },
    { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
    { id: 'reports', label: 'Reports', icon: ReportsIcon },
    { id: 'settings', label: 'Settings', icon: SettingsIcon }
  ]

  return (
    <div className="flex h-screen w-80 flex-col bg-dark p-4 font-spline">
      {/* Header */}
      <div className="mb-6 border-b border-dark-border pb-4">
        <h1 className="text-lg font-bold text-white">FocusFlow</h1>
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
        <div className="flex cursor-pointer items-center gap-3 rounded-xl p-3 transition-colors hover:bg-dark-card">
          <div className="size-8 rounded-full bg-gradient-to-r from-primary to-primary-dark"></div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-white">User</div>
            <div className="truncate text-xs text-primary-light">
              user@focusflow.com
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
