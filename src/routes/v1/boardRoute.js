import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardController } from '@/controllers/boardController'
import { boardValidation } from '@/validations/boardValidation'
import { checkPermission } from '@/middlewares/checkPermission'
import { boardPermission } from '@/utils/constants'

const Router = express.Router()

Router.route('/')
  .get((req, res) => {
    res.status(StatusCodes.OK).json({ message: 'GET: API get list boards' })
  })
  .post(boardValidation.createNew, boardController.createNew)

Router.route('/get-all').get(boardController.getAll)

Router.route('/supports/moving_card').put(boardValidation.moveCardToDifferentColumn, boardController.moveCardToDifferentColumn)

Router.route('/:id/update-type-board').put(boardValidation.updateTypeBoard, checkPermission(boardPermission.updateTypeBoard), boardController.updateTypeBoard)

Router.route('/:id')
  .get(boardController.getDetails)
  .put(boardValidation.update, checkPermission(boardPermission.editBoard), boardController.update)
  .delete(boardValidation.deleteBoard, checkPermission(boardPermission.deleteBoard), boardController.deleteBoard)

Router.route('/:id/members')
  .post(boardValidation.addMemberToBoard, checkPermission(boardPermission.inviteMember), boardController.addMemberToBoard)
  .delete(boardValidation.deleteMemberFromBoard, checkPermission(boardPermission.deleteMember), boardController.deleteMemberFromBoard)

Router.route('/search-board').post(boardController.searchBoard)

export const boardRouter = Router
