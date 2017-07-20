const model = require('../../../model')
const returnMsg = require('../../../return.msg')
const { userService, wekinService, waitingService, notiService } = require('../service')

exports.applyWaiting = (req, res) => {
  
  let tmp = {}
  userService.getUserByToken(req)
  .then(r => {
    tmp.usr = r
    return wekinService.getWekinByKey(req.params.wekin_key)
  })
  .then(r => {
    notiService.waitingApply(tmp.usr.user_key, r.Activity.host_key)
    return waitingService.applyWaiting(tmp.usr.user_key, r.wekin_key, req.body.method.split(','))
  })
  .then(r => {
    returnMsg.success200RetObj(res, {result: 'done'})
  })
  .catch(e => {
    returnMsg.error400InvalidCall(res, 'ERROR_INVALID_PARAM', {result: 'err'})
  })
}

exports.cancellWaiting = (req, res) => {
  let tmp = {}
  userService.getUserByToken(req)
  .then(r => {
    tmp.usr = r
    return wekinService.getWekinByKey(req.params.wekin_key)
  })
  .then(r => {
    return waitingService.cancellWaiting(tmp.usr.user_key, r.wekin_key)
  })
  .then(r => {
    returnMsg.success200RetObj(res, {result: 'done'})
  })
  .catch(e => {
    returnMsg.error400InvalidCall(res, 'ERROR_INVALID_PARAM', {result: 'err'})
  })
}

exports.confirmWaiting = (req, res) => {
  let tmp = {}
  userService.getUserByToken(req)
  .then(r => {
    tmp.usr = r
    return wekinService.getWekinByKey(req.params.wekin_key)
  })
  .then(r => {
    return waitingService.confirmWaiting(tmp.usr.user_key, r.wekin_key)
  })
  .then(r => {
    if (r == null) {
      returnMsg.success200RetObj(res, {result: false})
    } else {
      returnMsg.success200RetObj(res, {result: true}) 
    }
  })
  .catch(e => {
    returnMsg.error400InvalidCall(res, 'ERROR_INVALID_PARAM', {result: 'err'})
  })
}
