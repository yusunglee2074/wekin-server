const express = require('express')
const router = express.Router()

const controller = require('./controller')


/**
 * @api {get} /follow/:user_key 나를 팔로하는 사람들
 * @apiParam {Number} user_key 사용자키
 * @apiName getData
 * @apiGroup follow
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
router.get('/target/:user_key', controller.getTargetData)


/**
 * @api {get} /follow/:user_key 내 팔로 조회
 * @apiParam {Number} user_key 사용자키
 * @apiName getData
 * @apiGroup follow
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
 * @api {put} /follow/:user_key/:follower_user_key 팔로 추가 / 제거
 * @apiParam {Number} user_key 사용자키
 * @apiParam {Number} follower_user_key 대상 사용자키
 * @apiName putData
 * @apiGroup follow
 *
 * @apiSuccessExample 추가 성공시: 
 *     HTTP/1.1 200 OK
 * {
 *     "follow_key": 3,
 *     "user_key": 0,
 *     "follower_user_key": 8,
 *     "updated_at": "2017-06-15T06:51:05.984Z",
 *     "created_at": "2017-06-15T06:51:05.984Z"
 * }
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
router.put('/:user_key/:follower_user_key', controller.putData)



module.exports = router