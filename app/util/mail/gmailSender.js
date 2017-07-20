const nodemailer = require('nodemailer')

exports.nodeMailer = (addr, title, msg) => {
  return new Promise((resolve, reject) => {
    let transpoter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // use SSL
      auth: {
          user: 'makeit.ko@gmail.com',
          pass: 'mypass'
      }
    })

    let mailOptions = {
      from: '"아티즘" <makeit.ko@gmail.com>',
      to: addr,
      subject: title,
      html: msg,
    }

    transpoter.sendMail(mailOptions, function (error, info) {
      if (error){
        reject(error)
      } else {
        resolve(info.response)
      }
    })
  })
  
}