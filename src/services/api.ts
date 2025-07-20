const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ error: 'Network response was not ok' }))
    throw new Error(errorData.error || 'An unknown error occurred')
  }
  const result = await response.json()
  return result.data
}

// Helper function to convert backend task to frontend task format
const convertTask = (backendTask: {
  id: number
  title: string
  done: boolean
  createdAt: string
  updatedAt: string
}) => ({
  ...backendTask,
  id: String(backendTask.id), // Convert number to string
  createdAt: new Date(backendTask.createdAt), // Convert ISO string to Date
  updatedAt: new Date(backendTask.updatedAt) // Convert ISO string to Date
})

export const getTasks = async () => {
  console.log('Making request to:', `${API_URL}/tasks`)
  const response = await fetch(`${API_URL}/tasks`)
  console.log('Response status:', response.status)
  const data = await handleResponse(response)
  console.log('Raw data from API:', data)

  // Convert the tasks to the expected frontend format
  const convertedTasks = data.map(convertTask)
  console.log('Converted tasks:', convertedTasks)

  return convertedTasks
}

export const createTask = async (title: string) => {
  const response = await fetch(`${API_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title })
  })
  const data = await handleResponse(response)
  return convertTask(data)
}

export const updateTask = async (
  id: string,
  updates: { title?: string; done?: boolean }
) => {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  })
  const data = await handleResponse(response)
  return convertTask(data)
}

export const deleteTask = async (id: string) => {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: 'DELETE'
  })
  // DELETE might not return a body, so we check for 204 No Content
  if (response.status === 204) {
    return { id }
  }
  return handleResponse(response)
}
