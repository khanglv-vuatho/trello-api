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

const update = async (req, res, next) => {
  try {
    const boardId = req.params.id
    // Điều hướng sang service
    const updateBoard = await boardService.update(boardId, req.body)
    res.status(StatusCodes.OK).json(updateBoard)
  } catch (error) {
    //next(error) để đẩy sang errorhandling
    next(error)
  }
}

const moveCardToDifferentColumn = async (req, res, next) => {
  try {
    // Điều hướng sang service
    const result = await boardService.moveCardToDifferentColumn(req.body)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    //next(error) để đắy sang errorhandling
    next(error)
  }
}

const addMemberToBoard = async (req, res, next) => {
  try {
    const boardId = req.params.id
    const memberGmails = req.body.memberGmails
    const board = await boardService.addMemberToBoard(boardId, memberGmails)
    res.status(StatusCodes.OK).json(board)
  } catch (error) {
    next(error)
  }
}

const removeMemberFromBoard = async (req, res, next) => {
  try {
    const boardId = req.params.id
    const memberGmails = req.body.memberGmails
    const board = await boardService.removeMemberFromBoard(boardId, memberGmails)
    res.status(StatusCodes.OK).json(board)
  } catch (error) {
    next(error)
  }
}

export const boardController = {
  createNew,
  getDetails,
  update,
  moveCardToDifferentColumn,
  addMemberToBoard,
  removeMemberFromBoard
}
