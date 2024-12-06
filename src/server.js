import exitHook from 'async-exit-hook'
import cors from 'cors'
import express from 'express'
import http from 'http' // Import http to create a server
import { env } from './config/environment.js'
import { CLOSE_DB, CONNECT_DB } from './config/mongodb.js'
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware.js'
import { APIs_V1 } from './routes/v1/index.js'
import { initSocket, getIO } from './sockets/index.js' // Import socket module
import { SOCKET_EVENTS } from './utils/constants.js'

const START_SERVER = async () => {
  const app = express()
  const port = process.env.APP_PORT || 5000

  app.use(cors())
  app.use(express.json())
  app.use('/v1', APIs_V1)

  // Middleware for centralized error handling
  app.use(errorHandlingMiddleware)

  app.get('/', (req, res) => {
    res.end('<h1>Hello World!</h1>')
  })

  // Create a server instance
  const server = http.createServer(app)

  // Initialize Socket.IO
  initSocket(server)

  // Socket event handling

  // Start the server

  server.listen(env.APP_PORT, env.APP_HOST, () => {
    console.log(`Hello World, I am running at http://${env.APP_HOST}:${env.APP_PORT}`)
  })

  exitHook(() => {
    console.log('Closing database connection')
    CLOSE_DB()
    console.log('Exiting')
  })
}

;(async () => {
  try {
    await CONNECT_DB()
    START_SERVER()
  } catch (error) {
    console.error(error)
    process.exit(0)
  }
})()
