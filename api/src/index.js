import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import taskRoutes from './routes/tasks.js'
import logger from './middleware/logger.js'
import clientPromise from './utils/db.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 3000

app.use(logger)
app.use(cors())
app.use(express.json())

// Make db available to our router
app.use(async (req, res, next) => {
  try {
    const client = await clientPromise
    req.db = client.db('focusflow')
    next()
  } catch (e) {
    console.error(e)
    next(e)
  }
})

app.use('/api/tasks', taskRoutes)

app.get('/', (req, res) => {
  res.send('FocusFlow API is running!')
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
