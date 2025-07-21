import { Router } from 'express'
import { ObjectId } from 'mongodb'

const router = Router()

// GET /api/tasks - Get all tasks for the logged-in user
router.get('/', async (req, res) => {
  try {
    const userId = new ObjectId(req.user.userId)
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const tasksCollection = req.db.collection('tasks')
    const query = { userId }

    const tasks = await tasksCollection
      .find(query)
      .skip(skip)
      .limit(limit)
      .toArray()
    const totalItems = await tasksCollection.countDocuments(query)
    const totalPages = Math.ceil(totalItems / limit)

    res.json({
      success: true,
      data: tasks.map((t) => ({ ...t, id: t._id.toString() })),
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

// POST /api/tasks - Create a new task for the logged-in user
router.post('/', async (req, res) => {
  try {
    const { title } = req.body
    const userId = new ObjectId(req.user.userId)

    if (!title) {
      return res
        .status(400)
        .json({ success: false, data: null, error: 'Title is required' })
    }

    const newTask = {
      userId,
      title,
      done: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await req.db.collection('tasks').insertOne(newTask)
    const insertedTask = { ...newTask, id: result.insertedId.toString() }

    res.status(201).json({ success: true, data: insertedTask, error: null })
  } catch (error) {
    res
      .status(500)
      .json({ success: false, data: null, error: 'Internal Server Error' })
  }
})

// PUT /api/tasks/:id - Update a task for the logged-in user
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { title, done } = req.body
    const userId = new ObjectId(req.user.userId)

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
      .findOneAndUpdate({ _id: new ObjectId(id), userId }, updates, {
        returnDocument: 'after'
      })

    if (!result) {
      return res.status(404).json({
        success: false,
        data: null,
        error: 'Task not found or you do not have permission to edit it'
      })
    }

    res.json({
      success: true,
      data: { ...result, id: result._id.toString() },
      error: null
    })
  } catch (error) {
    res
      .status(500)
      .json({ success: false, data: null, error: 'Internal Server Error' })
  }
})

// DELETE /api/tasks/:id - Delete a task for the logged-in user
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const userId = new ObjectId(req.user.userId)

    if (!ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, data: null, error: 'Invalid task ID' })
    }

    const result = await req.db
      .collection('tasks')
      .deleteOne({ _id: new ObjectId(id), userId })

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        data: null,
        error: 'Task not found or you do not have permission to delete it'
      })
    }

    res.status(204).send()
  } catch (error) {
    res
      .status(500)
      .json({ success: false, data: null, error: 'Internal Server Error' })
  }
})

export default router
