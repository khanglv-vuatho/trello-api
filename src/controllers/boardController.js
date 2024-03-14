import { StatusCodes } from 'http-status-codes'
import { boardService } from '~/services/boardService'

const createNew = async (req, res, next) => {
  try {
    // Điều hướng sang service
    const createBoard = await boardService.createNew(req.body)

    res.status(StatusCodes.CREATED).json(createBoard)
  } catch (error) {
    //next(error) để đẩy sang errorhandling
    next(error)
  }
}
const getDetails = async (req, res, next) => {
  try {
    const boardId = req.params.id
    // Điều hướng sang service
    const board = await boardService.getDetails(boardId)

    res.status(StatusCodes.OK).json(board)
  } catch (error) {
    //next(error) để đẩy sang errorhandling
    next(error)
  }
}
export const boardController = {
  createNew,
  getDetails
}
