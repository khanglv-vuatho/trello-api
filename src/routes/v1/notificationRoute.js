import express from 'express'
import { notificationController } from '~/controllers/notificationController'
import { notificationValidation } from '~/validations/notificationValidation'

const Router = express.Router()

Router.route('/').get(notificationController.getAll)

export const notificationRouter = Router
