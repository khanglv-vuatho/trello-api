import axios from 'axios'

export const uploadFile = async (url, buffer) => {
  await axios.put(url, buffer, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export const deleteFile = async (url) => {
  await axios.delete(url)
}

export const updateFile = async (url, buffer) => {
  await axios.put(url, buffer, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
