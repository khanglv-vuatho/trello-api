import express from 'express'
import { cardController } from '~/controllers/cardController'
import { cardValidation } from '~/validations/cardValidation'

const Router = express.Router()

Router.route('/').post(cardValidation.createNew, cardController.createNew)

Router.route('/:id').delete(cardValidation.deleteCard, cardController.deleteCard)

export const cardRouter = Router
