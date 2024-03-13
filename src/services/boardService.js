import { slugify } from '~/utils/formatters'

/* eslint-disable no-unused-vars */
const createNew = async (reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }

    return newBoard
  } catch (error) {
    throw error
  }
}

export const boardService = {
  createNew
}
