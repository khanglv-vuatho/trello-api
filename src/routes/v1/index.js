import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardRouter } from './boardRoute'
import { cardRouter } from './cardRouter'
import { columnRouter } from './columnRouter'
import { userRouter } from './userRoute'
import { notificationRouter } from './notificationRoute'
import { conversationRouter } from './conversation'
import { authenticateJWT } from '@/middlewares/authenticateJWT'

const Router = express.Router()

// Public routes (no authentication needed)
Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'api v1 are ready to use' })
})

// Apply authenticateJWT middleware to all routes except specific ones
Router.use((req, res, next) => {
  // Allow creating a new user without authentication
  if (req.method === 'POST' && req.path === '/users') {
    return next()
  }
  // Allow checking API status without authentication
  if (req.method === 'GET' && req.path === '/status') {
    return next()
  }
  if (req.method === 'POST' && req.path === '/users/login') {
    return next()
  }
  // For all other routes, apply authentication
  authenticateJWT(req, res, next)
})

// Routes (authentication applied based on the check above)
Router.use('/boards', boardRouter)
Router.use('/cards', cardRouter)
Router.use('/columns', columnRouter)
Router.use('/users', userRouter)
Router.use('/notifications', notificationRouter)
Router.use('/conversations', conversationRouter)

export const APIs_V1 = Router
