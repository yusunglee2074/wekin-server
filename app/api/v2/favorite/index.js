const express = require('express')
const router = express.Router()

const controller = require('./controller')

/**
 * @api {get} /favorite/:user_key 관심 조회
 * @apiParam {Number} user_key 사용자키
 * @apiName getData
 * @apiGroup favorite
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * [
 *     {
 *         "fav_key": 3,
 *         "user_key": 0,
 *         "activity_key": 3,
 *         "created_at": "2017-06-15T06:01:30.933Z",
 *         "updated_at": "2017-06-15T06:01:30.933Z"
 *     }
 * ]
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
 * @api {put} /favorite/:user_key/:activity_key 관심 추가 / 제거
 * @apiParam {Number} user_key 사용자키
 * @apiParam {Number} activity_key 액티비티키
 * @apiName postData
 * @apiGroup favorite
 *
 * @apiSuccessExample 추가 성공시:
 *     HTTP/1.1 200 OK
 *  {
 *     "fav_key": 3,
 *     "user_key": 0,
 *     "activity_key": 3,
 *     "updated_at": "2017-06-15T06:01:30.933Z",
 *     "created_at": "2017-06-15T06:01:30.933Z"
 *  }
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
router.put('/:user_key/:activity_key', controller.putData)

module.exports = router