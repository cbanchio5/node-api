const nodemailer = require('nodemailer')

const sendMail = async options => {
  //Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass:process.env.EMAIL_PASSWORD
    }
  })



  //Define email options
  const mailOptions = {
    from: 'Cesar Banchio <cbanchio@banchio.io>',
    to:options.email,
    subject: options.subject,
    text: options.message
  }

  //Send email
 await transporter.sendMail(mailOptions)
}

module.exports = sendMail;
