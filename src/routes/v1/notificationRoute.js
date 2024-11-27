import express from 'express'
import { notificationController } from '~/controllers/notificationController'
import { notificationValidation } from '~/validations/notificationValidation'

const Router = express.Router()

Router.route('/').get(notificationController.getAll)

Router.route('/:id').delete(notificationController.deleteOne).put(notificationController.updateStatusInvitation)

export const notificationRouter = Router
