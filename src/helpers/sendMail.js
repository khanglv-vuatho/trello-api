import nodemailer from 'nodemailer'
import { env } from '~/config/environment'

const renderTemplate = (username, url = '', to, from, data) => {
  return `
  <h1>Welcome to NTTU Workspace</h1>
  <p>Hello, ${to}</p>
  <p>${from} invited you to join a board</p>
  <p>Please click on the link below to accepted invitation:</p>
  <a href="${env.FRONTEND_URL}/${url}?boardId=${data?.boardId}&status=${data?.status}">Accept Invitation</a>
  `
}

const sendMail = async ({ from, to, subject, text, username, cc, bcc, url, data }) => {
  try {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: env.ADMIN_EMAIL_ADDRESS,
        pass: env.PASSWORD_SECRET_KEY
      }
    })

    let mailOptions = {
      from: from || env.ADMIN_EMAIL_ADDRESS,
      to,
      cc, // Thêm CC (nếu có)
      bcc, // Thêm BCC (nếu có)
      subject,
      text,
      html: renderTemplate(username, url, to, from, data) // Gửi HTML content nếu có
    }
    await transporter.sendMail(mailOptions)
  } catch (error) {
    console.error('Error sending email: ', error)
  }
}

export default sendMail
