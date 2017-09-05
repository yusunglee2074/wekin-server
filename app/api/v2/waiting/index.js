const express = require('express')
const router = express.Router()

const controller = require('./controller')

/**
  
 * @apiParam {Number} wekin_key 대상 위킨 키
 * 
 * @apiParam {Array} method 알림방법 sms,mail 띄어쓰기금지
 *  
 * @apiName applyWaiting
 * @apiGroup waiting
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * { "result": "done" }
 * 
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 403 Bad Request
 * { "result": "err" }
 */
router.post('/:wekin_key', controller.applyWaiting)

/**
 * @api {delete} /waiting/:user_key 예약 취소
 * @apiParam {Number} wekin_key 대상 위킨 키
 * 
 * @apiName cancellWaiting
 * @apiGroup waiting
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * { "result": "done" }
 * 
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 403 Bad Request
 * { "result": "err" }
 */
router.delete('/:wekin_key', controller.cancellWaiting)

/**
 * @api {get} /waiting/:user_key 예약 여부
 * @apiParam {Number} wekin_key 대상 위킨 키
 * 
 * @apiName confirmWaiting
 * @apiGroup waiting
 *
 * @apiSuccessExample 예약되어있을경우:
 *     HTTP/1.1 200 OK
 * { "result": true }
 * 
 *  * @apiSuccessExample 예약되지 않은경우:
 *     HTTP/1.1 200 OK
 * { "result": false }
 * 
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 403 Bad Request
 * { "result": "err" }
 */
router.get('/:wekin_key', controller.confirmWaiting)



module.exports = router