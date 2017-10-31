const fireHelper = require('../../util/firebase')
const userService = require('./user/service')
const notiService = require('./noti/service')
const activityService = require('./activity/service')
const utilService = require('./util/service')
const waitingService = require('./waiting/service')
const wekinService = require('./wekin/service')
const orderService = require('./order/service')
const returnMsg = require('../../return.msg')

const ADMIN_LIST = ['qMBDHB2hlidSxEHHFYYfeAv9FHU2', 'b3hL1vS6uSTaZEPK4YfTeS3ySOg2', '7rJfyA9N1ePygZXpZCmdUSTSexI2', 'UGxNNJ5g1nSia24aC82qB7Eqfkt1', 'bGsdG3iWEAWetGlRBqq19L8ztij1']

exports.fireHelper = fireHelper
exports.userService = userService
exports.notiService = notiService
exports.activityService = activityService
exports.utilService = utilService
exports.waitingService = waitingService
exports.wekinService = wekinService
exports.orderService = orderService
exports.docService = require('./doc/service')

/**
 * 액티비티 상태
 */
exports.activityStatus = {
  error: { text: '에러', code: 0 },
  request: { text: '요청', code: 1 },
  reject: { text: '반려', code: 2 },
  activity: { text: '활동', code: 3 },
  deletion: { text: '삭제', code: 4 },
  end: { text: '종료', code: 5 }
}

/**
 * 도큐먼트 타입
 */
exports.docType = {
  feed: { text: '피드', code: 0 },
  review: { text: '리뷰', code: 1 },
  qna: { text: 'QnA', code: 2 }
}

exports.arraySeparator = array => {
  if (array == null || array === undefined) return
  return array.split(',').map(Number)
}

exports.authChk = (req, res, next) => {
  fireHelper.verifyFireToken(req.headers['x-access-token'])
  .then(userService.getUserByFirebaseToken)
  .then(user => {
    req.user = user
    next()
  })
  .catch(err => {returnMsg.errorInvalidAccessToken(res) })
}
exports.adminChk = (req, res, next) => {
  fireHelper.verifyFireToken(req.headers['x-access-token'])
  .then(token => { 
    ADMIN_LIST.includes(token.uid) ? next() : returnMsg.error401Unauthorized(res)
  })
  .catch(err => { returnMsg.error400InvalidCall(res, 'ERROR_INVALID_ACCESS_TOKEN', err) })
}
