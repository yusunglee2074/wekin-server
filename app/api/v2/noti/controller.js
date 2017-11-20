const model = require('../../../model')
const returnMsg = require('../../../return.msg')
const { userService, notiService } = require('../service')

exports.postNoti = (req, res) => {
  userService.getUserByToken(req)
  .then(myInfo => {
    return userService.getUserByKey(req.params.user_key)
    .then(r => { return {targetInfo: r, myInfo: myInfo} })
  })
  .then(r => {
    return notiService.postNoti(r.myInfo, r.targetInfo, {
      name: req.body.name,
      target: req.body.target,
      type: req.body.type,
      extra: req.body.extra
    })
  })
  .then(r => {
    returnMsg.success200RetObj(res, {result: 'success'})
  })
  .catch(e => {
    returnMsg.error403Forbidden(res, e)
  })
}

exports.getNoti = (req, res) => {
  userService.getUserByToken(req)
  .then(myInfo => notiService.getNotiList(myInfo))
  .then(r => {
    returnMsg.success200RetObj(res, r)
  })
  .catch(e => {
    returnMsg.error403Forbidden(res, e)
  })
}
