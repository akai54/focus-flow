import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/auth.js'
import taskRoutes from './routes/tasks.js'
import logger from './middleware/logger.js'
import authMiddleware from './middleware/auth.js'
import clientPromise from './utils/db.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 3001

app.use(logger)
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true
  })
)
app.use(express.json())
app.use(cookieParser())

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

app.use('/api/auth', authRoutes)
app.use('/api/tasks', authMiddleware, taskRoutes)

app.get('/', (req, res) => {
  res.send('FocusFlow API is running!')
})

// Global error handler
app.use((err, req, res) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
