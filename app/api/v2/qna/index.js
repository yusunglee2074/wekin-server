const express = require('express')
const router = express.Router()
const service = require('../service')

const controller = require('./controller')

/** @api {get} /qna/ qna 조회
 * @apiParam {String} token (옵션)[헤더]엑세스토큰
 * @apiParam {Number} activity_key (옵션)엑티비티키
 * 
 * @apiName getQna
 * @apiGroup qna
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *  1
 * }
 */
router.get('/', controller.getQna)

/** @api {post} /order/refund/:order_key 환불(주문취소)
 * @apiParam {Number} order_key order key
 * @apiParam {Number} order_refund_price 환불금액
 * 
 * @apiName setOrderCancelled
 * @apiGroup order
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *  1
 * }
 *
 * @apiError Bad Request 잘못된 요청
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "errorCode": -2,
 *       "data": "ERROR_INVALID_PARAM"
 *     }
 */
router.post('/:activity_key', service.authChk, controller.postQna)

router.delete('/:doc_key', service.authChk,controller.deleteQna)

router.post('/:doc_key/reply', service.authChk,controller.postReply)

router.put('/:doc_key/reply', service.authChk,controller.putReply)

module.exports = router
