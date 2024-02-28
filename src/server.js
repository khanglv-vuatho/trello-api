import express from 'express'
import { CONNECT_DB, CLOSE_DB } from './config/mongodb.js'
import exitHook from 'async-exit-hook'
import { env } from './config/environment.js'
import { APIs_V1 } from './routes/v1/index.js'

const START_SERVER = async () => {
  const app = express()

  app.use(express.json())

  app.use('/v1', APIs_V1)

  app.get('/', (req, res) => {
    res.end('<h1>Hello World!</h1>')
  })

  app.listen(env.APP_PORT, env.APP_HOST, () => {
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
