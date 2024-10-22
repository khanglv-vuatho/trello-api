import { StatusCodes } from 'http-status-codes'
import { boardService } from '~/services/boardService'
import { userService } from '~/services/userService'

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
    console.log({ boardId })
    const board = await boardService.getDetails(boardId)
    if (board?.memberGmails?.length >= 1) {
      const membersClone = await Promise.all(board?.memberGmails?.map((email) => userService.getDetails(email)))
      board.memberGmails = [...membersClone]
    }

    console.log({ board })
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

    res.status(StatusCodes.OK).json({
      message: 'Members added to board and invitations are being sent',
      board
    })
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
const getAll = async (req, res, next) => {
  try {
    const email = req.query.email
    const boards = await boardService.getAll(email)
    res.status(StatusCodes.OK).json(boards)
  } catch (error) {
    next(error)
  }
}

const search = async (req, res, next) => {
  try {
    const keyword = req.query.keyword
    const boards = await boardService.search(keyword)
    res.status(StatusCodes.OK).json(boards)
  } catch (error) {
    next(error)
  }
}
export const boardController = {
  createNew,
  getAll,
  getDetails,
  update,
  moveCardToDifferentColumn,
  addMemberToBoard,
  removeMemberFromBoard,
  search
}
