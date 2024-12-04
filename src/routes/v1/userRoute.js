import express from 'express'
import { userController } from '@/controllers/userController'
import { userValidation } from '@/validations/userValidation'
import multer from 'multer'

const Router = express.Router()

Router.route('/:email').get(userController.getDetails).put(multer().single('avatar'), userController.update)

Router.route('/login').post(userValidation.createNew, userController.createNew)

export const userRouter = Router
