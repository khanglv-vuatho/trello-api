import nodemailer from 'nodemailer'
import { env } from '~/config/environment'

const renderTemplate = (username, url = '') => {
  return `
  <h1>Welcome to </h1>
  <p>Hello, ${username} thank you for signing up!</p>
  <p>We hope you enjoy using our platform.</p>
  <p>Please click on the link below to accpect invitation:</p>
  <a href="${env.FRONTEND_URL}/${url}">Accept Invitation</a>
  `
}

const sendMail = async ({ from, to, subject, text, username, cc, bcc, url }) => {
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
      html: renderTemplate(username, url) // Gửi HTML content nếu có
    }
    await transporter.sendMail(mailOptions)
  } catch (error) {
    console.error('Error sending email: ', error)
  }
}

export default sendMail