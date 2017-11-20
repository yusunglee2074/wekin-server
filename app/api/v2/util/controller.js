const returnMsg = require('../../../return.msg')
const sms = require('../../../util/sms')
const mail = require('../../../util/mail')
const slack = require('../../../util/slack')
const { userService, utilService } = require('../service')

exports.joinMail = (req, res) => {
  userService.getUserByToken(req)
  .then(r => { return utilService.sendJoinAfterMail(r) })
  .then(r => { returnMsg.success200RetObj(res, {result: r}) })
  .catch(e => { console.log(e) })
}
exports.joinSms = (req, res) => {
  userService.getUserByToken(req)
  .then(r => utilService.senJoinAfterLms(r))
  .then(r => { returnMsg.success200RetObj(res, r) })
  .catch(e => { console.log(e) })
}
exports.sendMailt = (req, res) => {
  let body = req.body
  mail.sendMail(body.target, body.title, body.message)
  .then(r => { returnMsg.success200RetObj(res, r) })
  .catch(e => { console.log(e) })
}
exports.sendMail = (req, res) => {
  let body = req.body

  mail.sendMail(body.target, body.title, body.message)
  .then(r => { returnMsg.success200RetObj(res, r) })
  .catch(e => { console.log(e) })
}

exports.confirmWekin = (req, res) => {
  utilService.sendWekinMail(req.body.title, req.body.msg)
  .then(r => { returnMsg.success200RetObj(res, r) })
  .catch(e => { console.log(e) })
}

exports.sendSms = (req, res) => {
  let body = req.body
  
  // slack.sendMessage(`구분 : sms\n대상 : ${body.target}\n내용 : ${body.message}`)
  sms.sendSms(body.target, body.message)
  .then(r => { 
    returnMsg.success200RetObj(res, {success: true})
  })
  .catch(e => {
    let msg = ''
    switch (e) {
      case '-101':
        msg = '변수부족 에러'
        return
      case '-102':
        msg = '인증 에러'
        return
      case '0004':
        msg = '메시지 body길이 오류'
        return
      case '3205':
        msg = '폰번호 오류'
        return
      case '3219':
        msg = '월 전송건수 초과'
        return
      case '3221':
        msg = '착신번호 오류 (자리수)'
        return
      case '3222':
        msg = '착신번호 오류 (국번)'
        return
    }
    console.log(msg)
  })
  
}
