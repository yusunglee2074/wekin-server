const express = require('express')
const router = express.Router()

const controller = require('./controller')

/**
 * @api {get} /like/:user_key 좋아요 조회
 * @apiParam {Number} user_key 사용자키
 * @apiName getData
 * @apiGroup like
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *
 * @apiError Bad Request 잘못된 요청
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 * {
 *     "errorCode": -2,
 *     "data": {...}
 * }
 */
router.get('/:user_key', controller.getData)

/**
 * @api {put} /like/:user_key/:doc_key 좋아요 추가 제거
 * @apiParam {Number} user_key 사용자키
 * @apiParam {Number} doc_key 피드, 후기 키
 * @apiName postData
 * @apiGroup like
 *
 * @apiSuccessExample 추가 성공시:
 *     HTTP/1.1 200 OK
 * 
 * @apiSuccessExample 삭제 성공시:
 *     HTTP/1.1 200 OK
 *     1
 * 
 * @apiError Bad Request 잘못된 요청
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 * {
 *     "errorCode": -2,
 *     "data": {...}
 * }
 */
router.put('/:user_key/:doc_key', controller.putData)

module.exports = router