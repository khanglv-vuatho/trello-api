import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardController } from '~/controllers/boardController'
import { boardValidation } from '~/validations/boardValidation'

const Router = express.Router()

Router.route('/')
  .get((req, res) => {
    res.status(StatusCodes.OK).json({ message: 'GET: API get list boards' })
  })
  .post(boardValidation.createNew, boardController.createNew)

Router.route('/get-all').get(boardValidation.getAll, boardController.getAll)

Router.route('/supports/moving_card').put(boardValidation.moveCardToDifferentColumn, boardController.moveCardToDifferentColumn)

Router.route('/:id').get(boardController.getDetails).put(boardValidation.update, boardController.update)

Router.route('/:id/members')
  .post(boardValidation.addMemberToBoard, boardController.addMemberToBoard)
  .delete(boardValidation.removeMemberFromBoard, boardController.removeMemberFromBoard)

Router.route('/search').get(boardValidation.search, boardController.search)

export const boardRouter = Router
