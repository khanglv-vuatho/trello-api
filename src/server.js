import express from 'express'
import { CONNECT_DB, CLOSE_DB } from './config/mongodb.js'
import exitHook from 'async-exit-hook'
import { env } from './config/environment.js'
import { APIs_V1 } from './routes/v1/index.js'
import cors from 'cors'
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware.js'
import { corsOptions } from './config/cors.js'
import multer from 'multer'
import axios from 'axios'
import cron from 'node-cron'

const START_SERVER = async () => {
  const app = express()
  const port = process.env.APP_PORT || 5000

  app.use(cors())

  app.use(express.json())

  app.use('/v1', APIs_V1)

  //middleware xử lí lỗi tập trung
  app.use(errorHandlingMiddleware)

  cron.schedule('*/2 * * * *', async () => {
    try {
      // Gửi request tới API
      const response = await axios.get('https://auto-send-request.onrender.com/')

      // Xử lý dữ liệu trả về nếu cần
      console.log(response.data)
    } catch (error) {
      console.error('Error sending request:', error)
    }
  })

  app.get('/', (req, res) => {
    res.end('<h1>Hello World!</h1>')
    console.log(123)
  })

  const upload = multer()

  app.post('/', upload.array('files'), async (req, res) => {
    console.log(req.files)

    if (req.files.length > 0) {
      req.files.map(async (item) => {
        const response = await axios.put(`https://match-dev.khangluong2002.workers.dev/${item.originalname}`, item.buffer, {
          header: {
            'Content-Type': 'multipart/form-data'
          }
        })
      })
    }

    res.send({ message: '123' })
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
