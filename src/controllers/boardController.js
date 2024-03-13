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

export const boardController = {
  createNew
}
