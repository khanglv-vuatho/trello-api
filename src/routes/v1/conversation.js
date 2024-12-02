import { conversationController } from '@/controllers/conversationController'
import express from 'express'
const Router = express.Router()
import multer from 'multer'

Router.route('/:email').get(conversationController.getAll).post(multer().single('content'), conversationController.createNew)

export const conversationRouter = Router
