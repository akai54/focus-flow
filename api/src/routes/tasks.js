import { Router } from 'express'
import { ObjectId } from 'mongodb'

const router = Router()

// GET /api/tasks - Get all tasks with pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const tasksCollection = req.db.collection('tasks')
    const tasks = await tasksCollection
      .find({})
      .skip(skip)
      .limit(limit)
      .toArray()
    const totalItems = await tasksCollection.countDocuments()
    const totalPages = Math.ceil(totalItems / limit)

    res.json({
      success: true,
      data: tasks.map((t) => ({ ...t, id: t._id })),
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
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query

    if (!q) {
      return res
        .status(400)
        .json({ success: false, data: null, error: 'Search query is required' })
    }

    const tasks = await req.db
      .collection('tasks')
      .find({
        title: { $regex: q, $options: 'i' }
      })
      .toArray()

    res.json({
      success: true,
      data: tasks.map((t) => ({ ...t, id: t._id })),
      error: null
    })
  } catch (error) {
    res
      .status(500)
      .json({ success: false, data: null, error: 'Internal Server Error' })
  }
})

// POST /api/tasks - Create a new task
router.post('/', async (req, res) => {
  try {
    const { title } = req.body

    if (!title) {
      return res
        .status(400)
        .json({ success: false, data: null, error: 'Title is required' })
    }

    const newTask = {
      title,
      done: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await req.db.collection('tasks').insertOne(newTask)
    const insertedTask = { ...newTask, id: result.insertedId }

    res.status(201).json({ success: true, data: insertedTask, error: null })
  } catch (error) {
    res
      .status(500)
      .json({ success: false, data: null, error: 'Internal Server Error' })
  }
})

// PUT /api/tasks/:id - Update a task
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { title, done } = req.body

    if (!ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, data: null, error: 'Invalid task ID' })
    }

    const updates = { $set: { updatedAt: new Date() } }
    if (title !== undefined) updates.$set.title = title
    if (done !== undefined) updates.$set.done = done

    const result = await req.db
      .collection('tasks')
      .findOneAndUpdate({ _id: new ObjectId(id) }, updates, {
        returnDocument: 'after'
      })

    if (!result.value) {
      return res
        .status(404)
        .json({ success: false, data: null, error: 'Task not found' })
    }

    res.json({
      success: true,
      data: { ...result.value, id: result.value._id },
      error: null
    })
  } catch (error) {
    res
      .status(500)
      .json({ success: false, data: null, error: 'Internal Server Error' })
  }
})

// DELETE /api/tasks/:id - Delete a task
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params

    if (!ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, data: null, error: 'Invalid task ID' })
    }

    const result = await req.db
      .collection('tasks')
      .deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ success: false, data: null, error: 'Task not found' })
    }

    res.status(204).send()
  } catch (error) {
    res
      .status(500)
      .json({ success: false, data: null, error: 'Internal Server Error' })
  }
})

export default router
