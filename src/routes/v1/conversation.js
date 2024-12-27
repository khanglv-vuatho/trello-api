import { conversationController } from '@/controllers/conversationController'
import express from 'express'
import multer from 'multer'

const Router = express.Router()

Router.route('/').get(conversationController.getAll).post(multer().single('content'), conversationController.createNew)

export const conversationRouter = Router
