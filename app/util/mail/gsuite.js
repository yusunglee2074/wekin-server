const nodemailer = require('nodemailer')
const smtpPool = require('nodemailer-smtp-pool');
// const smtpTransport = require('nodemailer-smtp-transport');

const sender = '위키너 < wekin@wekiner.com >'
/*
const transporter = nodemailer.createTransport(smtpTransport({
    host: 'smtp-relay.gmail.com',
    port: 465
}))

exports.nodeMailer = (addr, title, msg) => {
  return new Promise((resolve, reject) => {

    let mailOptions = { from: sender, to: addr, subject: title, html: msg }

    transporter.sendMail(mailOptions, function (err, res) {
        if (err) {
          reject(error)
        } else {
          resolve(info.response)
        }
        transporter.close()
    })
  })
}
*/





exports.nodeMailer = (addr, title, msg) => {
  return new Promise((resolve, reject) => {

    var transporter = nodemailer.createTransport(smtpPool({
      service: 'Gmail',
      host: 'smtp.gmail.com',
      port: 465,
      auth: {
          user: 'cylim@wekiner.com',
          pass: 'codbs9050'
      },
      tls: {
          rejectUnauthorize: false
      },
      maxConnections: 5,
      maxMessages: 10
    }))

    let mailOptions = { from: sender, to: addr, subject: title, html: msg }

    transporter.sendMail(mailOptions, function (err, res) {
        if (err) {
          reject(error)
        } else {
          resolve(true)
        }
        transporter.close()
    })
  })
}

