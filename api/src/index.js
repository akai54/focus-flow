import 'dotenv/config.js'
import http from 'http'
import createApp from './app.js'
import { connectToDatabase } from './utils/db.js'

const startServer = async () => {
  try {
    const db = await connectToDatabase(process.env.MONGODB_URI)
    console.log('Successfully connected to the database.')

    const app = createApp(db)

    const port = process.env.PORT || 3001
    const server = http.createServer(app)

    server.listen(port, () => {
      console.log(`Server running on port ${port}`)
    })
  } catch (error) {
    console.error('Failed to start the server:', error)
    process.exit(1)
  }
}

startServer()
