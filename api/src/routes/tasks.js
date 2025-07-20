import { Router } from 'express'

const router = Router()

// In-memory data store
let tasks = [
  {
    id: 1,
    title: 'Setup the project',
    done: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 2,
    title: 'Create the backend',
    done: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 3,
    title: 'Create the frontend',
    done: false,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]
let nextId = 4

// GET /api/tasks - Get all tasks with pagination
router.get('/', (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10

    const startIndex = (page - 1) * limit
    const endIndex = page * limit

    const results = tasks.slice(startIndex, endIndex)
    const totalItems = tasks.length
    const totalPages = Math.ceil(totalItems / limit)

    res.json({
      success: true,
      data: results,
      pagination: {
        totalItems,
        totalPages,
        currentPage: page,
        pageSize: limit
      },
      error: null
    })
  } catch (error) {
    res
      .status(500)
      .json({ success: false, data: null, error: 'Internal Server Error' })
  }
})

// GET /api/tasks/search?q=... - Search for tasks
router.get('/search', (req, res) => {
  try {
    const { q } = req.query

    if (!q) {
      return res
        .status(400)
        .json({ success: false, data: null, error: 'Search query is required' })
    }

    const searchResults = tasks.filter((task) =>
      task.title.toLowerCase().includes(q.toString().toLowerCase())
    )

    res.json({ success: true, data: searchResults, error: null })
  } catch (error) {
    res
      .status(500)
      .json({ success: false, data: null, error: 'Internal Server Error' })
  }
})

// POST /api/tasks - Create a new task
router.post('/', (req, res) => {
  try {
    const { title } = req.body

    if (!title) {
      return res
        .status(400)
        .json({ success: false, data: null, error: 'Title is required' })
    }

    const newTask = {
      id: nextId++,
      title,
      done: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    tasks.push(newTask)
    res.status(201).json({ success: true, data: newTask, error: null })
  } catch (error) {
    res
      .status(500)
      .json({ success: false, data: null, error: 'Internal Server Error' })
  }
})

// PUT /api/tasks/:id - Update a task
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params
    const { title, done } = req.body
    const taskIndex = tasks.findIndex((t) => t.id === parseInt(id))

    if (taskIndex === -1) {
      return res
        .status(404)
        .json({ success: false, data: null, error: 'Task not found' })
    }

    const updatedTask = { ...tasks[taskIndex] }
    if (title !== undefined) {
      updatedTask.title = title
    }
    if (done !== undefined) {
      updatedTask.done = done
    }
    updatedTask.updatedAt = new Date()

    tasks[taskIndex] = updatedTask
    res.json({ success: true, data: updatedTask, error: null })
  } catch (error) {
    res
      .status(500)
      .json({ success: false, data: null, error: 'Internal Server Error' })
  }
})

// DELETE /api/tasks/:id - Delete a task
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params
    const taskIndex = tasks.findIndex((t) => t.id === parseInt(id))

    if (taskIndex === -1) {
      return res
        .status(404)
        .json({ success: false, data: null, error: 'Task not found' })
    }

    tasks.splice(taskIndex, 1)
    res.status(204).send()
  } catch (error) {
    res
      .status(500)
      .json({ success: false, data: null, error: 'Internal Server Error' })
  }
})

export default router
