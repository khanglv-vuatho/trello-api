import { StatusCodes } from 'http-status-codes'
import { boardService } from '@/services/boardService'
import { userService } from '@/services/userService'
import { NOTIFICATION_INVITATION_STATUS } from '@/utils/constants'

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
    const email = req.query.email
    // Điều hướng sang service
    const board = await boardService.getDetails(boardId, email)
    const ownerDetails = {
      email: board.ownerId,
      status: NOTIFICATION_INVITATION_STATUS.ACCEPTED
    }
    // get member details
    if (board?.memberGmails?.length > 0) {
      board.memberGmails = await Promise.all(
        [ownerDetails, ...board.memberGmails]
          .filter((member) => member.email !== email)
          .map(async (member) => {
            if (member.status === NOTIFICATION_INVITATION_STATUS.ACCEPTED || member.email === email) {
              return await userService.getDetails(member.email)
            }
            return member
          })
      )
    }

    res.status(StatusCodes.OK).json(board)
  } catch (error) {
    //next(error) để đẩy sang errorhandling
    next(error)
  }
}

const deleteMemberFromBoard = async (req, res, next) => {
  try {
    const boardId = req.params.id
    const email = req.body.email
    const board = await boardService.deleteMemberFromBoard(boardId, email)
    res.status(StatusCodes.OK).json(board)
  } catch (error) {
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

const getAll = async (req, res, next) => {
  try {
    const email = req.query.email
    const boards = await boardService.getAll(email)
    res.status(StatusCodes.OK).json(boards)
  } catch (error) {
    next(error)
  }
}

const searchBoard = async (req, res, next) => {
  try {
    const { keyword, email } = req.body
    const boards = await boardService.searchBoard(keyword, email)
    res.status(StatusCodes.OK).json(boards)
  } catch (error) {
    next(error)
  }
}

const deleteBoard = async (req, res, next) => {
  try {
    const boardId = req.params.id
    const board = await boardService.deleteBoard(boardId)
    res.status(StatusCodes.OK).json(board)
  } catch (error) {
    next(error)
  }
}

const updateTypeBoard = async (req, res, next) => {
  try {
    const boardId = req.params.id
    const type = req.body.type
    const board = await boardService.updateTypeBoard(boardId, type)
    res.status(StatusCodes.OK).json(board)
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
  searchBoard,
  deleteBoard,
  updateTypeBoard,
  deleteMemberFromBoard
}
