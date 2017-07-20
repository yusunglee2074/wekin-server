const model = require('../../../model')
const utilService = require('../util/service')
const userService = require('../user/service')
const wekinService = require('../wekin/service')
const notiService = require('../noti/service')

exports.applyWaiting = (user_key, wekin_key, method) => {
  let tmp = {}
  return new Promise((resolve, reject) => {
    model.Waiting.create({
      user_key: user_key,
      wekin_key: wekin_key,
      method: method
    })
    .then(r => {
      tmp.method = r.method
      return userService.getUserByKey(user_key)
    })
    .then(r => {
      tmp.usr = r
      return wekinService.getWekinByKey(wekin_key)
    })
    .then(r => {
      if (tmp.method.includes('sms')) { utilService.sendWaitingRequestLms(tmp.usr, r) }
      if (tmp.method.includes('mail')) { utilService.sendWaitingRequestMail(tmp.usr, r) }
      resolve(r)
    }).catch(reject)
  })
}

exports.cancellWaiting = (user_key, wekin_key) => {
  return new Promise((resolve, reject) => {
    model.Waiting.destroy({
      where: {
        user_key: user_key,
        wekin_key: wekin_key
      }
    })
    .then(resolve).catch(reject)
  })
}

exports.getWaitingUserList = (wekin_key) => {
  return new Promise((resolve, reject) => {
    model.Waiting.findAll({
      where: {
        wekin_key: wekin_key
      }
    })
    .then(resolve).catch(reject)
  })
}

exports.confirmWaiting = (user_key, wekin_key) => {
  return new Promise((resolve, reject) => {
    model.Waiting.findOne({
      where: {
        wekin_key: wekin_key,
        user_key: user_key
      }
    })
    .then(resolve).catch(reject)
  })
}

exports.sendNoti = (wekin_key) => {
  return new Promise((resolve, reject) => {
    this.getWaitingUserList(wekin_key)
    .then(r => {
      r.forEach(v => {
        if(v.method.includes('sms')) { sendSmsNoti(v.user_key, wekin_key) }
        if(v.method.includes('mail')) { sendMailNoti(v.user_key, wekin_key) }
      })
      return resolve()
    })
    .catch(reject)
  })
}

let sendSmsNoti = (user_key, wekin_key) => {
  return new Promise((resolve, reject) => {
    let tmp = {}
    userService.getUserByKey(user_key)
    .then(r => {
      tmp.user = r
      return wekinService.getWekinByKey(wekin_key)
    })
    .then(r => {
      utilService.sendWaitingSms(tmp.user, r)
    })
  })
}

let sendMailNoti = (user_key, wekin_key) => {
  return new Promise((resolve, reject) => {
    let tmp = {}
    userService.getUserByKey(user_key)
    .then(r => {
      tmp.user = r
      return wekinService.getWekinByKey(wekin_key)
    })
    .then(r => utilService.sendWaitingMail(tmp.user, r) )
  })
}