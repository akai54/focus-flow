import { useState } from 'react'
import TaskPage from '../task/TaskPage'
import Sidebar from '../layout/Sidebar'
import HomeView from '../../pages/HomeView'
import CalendarView from '../../pages/CalendarView'
import ReportsView from '../../pages/ReportsView'
import SettingsView from '../../pages/SettingsView'

function AppLayout() {
  const [activeTab, setActiveTab] = useState('tasks')

  const renderView = () => {
    switch (activeTab) {
      case 'home':
        return <HomeView />
      case 'tasks':
        return <TaskPage />
      case 'calendar':
        return <CalendarView />
      case 'reports':
        return <ReportsView />
      case 'settings':
        return <SettingsView />
      default:
        return <TaskPage />
    }
  }

  return (
    <div className="flex min-h-screen bg-dark font-spline">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-y-auto">{renderView()}</main>
    </div>
  )
}

export default AppLayout
