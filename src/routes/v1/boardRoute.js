import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardController } from '@/controllers/boardController'
import { boardValidation } from '@/validations/boardValidation'
import { checkPermission } from '@/middlewares/checkPermission'

const Router = express.Router()

Router.route('/')
  .get((req, res) => {
    res.status(StatusCodes.OK).json({ message: 'GET: API get list boards' })
  })
  .post(boardValidation.createNew, boardController.createNew)

Router.route('/get-all').get(boardController.getAll)

Router.route('/supports/moving_card').put(boardValidation.moveCardToDifferentColumn, boardController.moveCardToDifferentColumn)

Router.route('/:id/update-type-board').put(boardValidation.updateTypeBoard, boardController.updateTypeBoard)

Router.route('/:id')
  .get(boardController.getDetails)
  .put(boardValidation.update, boardController.update)
  .delete(boardValidation.deleteBoard, boardController.deleteBoard)

Router.route('/:id/members')
  .post(boardValidation.addMemberToBoard, checkPermission('inviteMember'), boardController.addMemberToBoard)
  .delete(boardValidation.deleteMemberFromBoard, checkPermission('deleteMember'), boardController.deleteMemberFromBoard)

Router.route('/search-board').post(boardController.searchBoard)

export const boardRouter = Router
