import exitHook from 'async-exit-hook'
import cors from 'cors'
import express from 'express'
import { env } from './config/environment.js'
import { CLOSE_DB, CONNECT_DB } from './config/mongodb.js'
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware.js'
import { APIs_V1 } from './routes/v1/index.js'

const START_SERVER = async () => {
  const app = express()
  const port = process.env.APP_PORT || 5000

  app.use(cors())

  app.use(express.json())

  app.use('/v1', APIs_V1)

  //middleware xử lí lỗi tập trung
  app.use(errorHandlingMiddleware)

  app.get('/', (req, res) => {
    res.end('<h1>Hello World!</h1>')
  })

  if (env.BUILD_MODE === 'production') {
    app.listen(process.env.PORT, () => {
      console.log(`Hello World, I am running at PORT : ${process.env.PORT}`)
    })
  } else {
    app.listen(env.APP_PORT, env.APP_HOST, () => {
      console.log(`Hello World, I am running at http://${env.APP_HOST}:${port}`)
    })
  }

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
