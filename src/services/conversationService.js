import { conversationModel } from '@/models/conversation'

const createNew = async (data) => {
  const conversation = await conversationModel.createNew(data)
  return conversation
}

const getAll = async (email) => {
  const conversations = await conversationModel.getAll(email)

  const newData = conversations
    .map((item) => {
      // Sort the messageDetails by createdAt
      const sortedMessageDetails = [...item.messageDetails].sort((a, b) => a.createdAt - b.createdAt)

      const updatedItem = {
        ...item,
        id: item._id,
        name: item?.chatWithUserId || '',
        avatar: item?.chatWithUserId?.charAt?.(0)?.toUpperCase() || 'K',
        message: sortedMessageDetails?.[sortedMessageDetails.length - 1]?.content || '',
        createdAt: sortedMessageDetails?.[sortedMessageDetails.length - 1]?.createdAt || ''
      }

      // Nếu email trùng với chatWithUserId, đổi ngược lại
      if (email === updatedItem.chatWithUserId) {
        updatedItem.chatWithUserId = updatedItem.email
        updatedItem.email = email
      }

      // Replace the original messageDetails with the sorted one
      updatedItem.messageDetails = sortedMessageDetails

      return updatedItem
    })
    .sort((a, b) => b.createdAt - a.createdAt) // Sort conversations by createdAt in descending order

  //khangluong2002 :eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEwMDQ4Nzk1MTQ2NDM0ODE3NDc0NiIsImVtYWlsIjoia2hhbmdsdW9uZzIwMDJAZ21haWwuY29tIiwidmVyaWZpZWRfZW1haWwiOnRydWUsIm5hbWUiOiJLaGFuZyBsxrDGoW5nIiwiZ2l2ZW5fbmFtZSI6IktoYW5nIiwiZmFtaWx5X25hbWUiOiJsxrDGoW5nIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0tTQVc4YUdySXh4QjZnT1NWNzFCWVp2UkNnSnlfZmZqbmR0eHR2aFBRU0RjVnhvZz1zOTYtYyIsImlhdCI6MTczMzY0NjcwN30.nPnvleO-Pe7-_jxQmTXymKi8flAneDu03cbegcP7Z6I

  //khanglv@vuatho.com: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjExMjk4MzQzMjQwNzc1NTA4NjAwMiIsImVtYWlsIjoia2hhbmdsdkB2dWF0aG8uY29tIiwidmVyaWZpZWRfZW1haWwiOnRydWUsIm5hbWUiOiJLaGFuZyBMxrDGoW5nIiwiZ2l2ZW5fbmFtZSI6IktoYW5nIiwiZmFtaWx5X25hbWUiOiJMxrDGoW5nIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0pNR2NKY1J5bzhRaEEzbEFrVTFwcC0tWXQwYUpLeTA2WFNlaEVQcUZZRnkyMk45UT1zOTYtYyIsImhkIjoidnVhdGhvLmNvbSIsImlhdCI6MTczMzY1MzgzN30.LsFeKOT5J1uAuCZc8NTGXs3sw0FxhFaWjTVgMBB5y8Y

  console.log({ newData: JSON.stringify(newData), email })
  return newData
}
const getDetails = async (id) => {
  const conversation = await conversationModel.getDetails(id)
  return conversation
}

const findConversationByEmailAndChatWithUserId = async (email, chatWithUserId) => {
  const conversation = await conversationModel.findConversationByEmailAndChatWithUserId(email, chatWithUserId)
  return conversation
}

export const conversationService = {
  createNew,
  getAll,
  getDetails,
  findConversationByEmailAndChatWithUserId
}
