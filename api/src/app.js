import express from 'express'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import mongoSanitize from 'express-mongo-sanitize'
import xss from 'xss-clean'
import hpp from 'hpp'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'

import authRouter from './routes/auth.js'
import tasksRouter from './routes/tasks.js'
import authMiddleware from './middleware/auth.js'

const createApp = (db) => {
  const app = express()

  // Make db available to our router
  app.use((req, res, next) => {
    req.db = db
    next()
  })

  // Serve static files
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)
  app.use('/api', express.static(path.join(__dirname, '..', 'public')))

  // 1) GLOBAL MIDDLEWARES
  app.use(
    cors({
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      credentials: true
    })
  )

  app.options('*', cors())

  // Set security HTTP headers
  app.use(helmet())

  // Development logging
  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
  }

  // Limit requests from same API
  const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!'
  })
  app.use('/api', limiter)

  // Body parser, reading data from body into req.body
  app.use(express.json({ limit: '10kb' }))
  app.use(express.urlencoded({ extended: true, limit: '10kb' }))
  app.use(cookieParser())

  // Data sanitization against NoSQL query injection
  app.use(mongoSanitize())

  // Data sanitization against XSS
  app.use(xss())

  // Prevent parameter pollution
  app.use(hpp())

  app.use(compression())

  // 3) ROUTES
  app.use('/api/auth', authRouter)
  app.use('/api/tasks', authMiddleware, tasksRouter)

  app.all('*', (req, res) => {
    res.status(404).json({
      status: 'fail',
      message: `Can't find ${req.originalUrl} on this server!`
    })
  })

  // Global error handling middleware
  app.use((err, req, res) => {
    console.error('ERROR 💥', err)

    err.statusCode = err.statusCode || 500
    err.status = err.status || 'error'

    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      err.statusCode = 401
      err.message = 'Please log in to get access.'
    }

    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    })
  })

  return app
}

export default createApp
