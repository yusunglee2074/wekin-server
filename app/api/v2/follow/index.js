const express = require('express')
const router = express.Router()

const controller = require('./controller')


/** @api {get} /follow/:user_key 유저 팔로잉 조회
 * 
 * @apiName getData 
 * @apiGroup follow
 * @apiParam {Number} user_key 유저키
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * [
 *     {
 *         "created_at": "2017-07-06T11:08:53.241Z",
 *         "Follower": {
 *             "user_key": 127,
 *             "name": "SS승마클럽",
 *             "profile_image": "https://firo/img%2Fimage730%2F2017%2F7%2F6%2F29886.png?alt=media",
 *             "Host": {
 *                 "introduce": "서울에서 10분거리 승마장",
 *                 "status": 3,
 *                 "type": 1,
 *                 "host_key": 11,
 *                 "name": "SS승마클럽",
 *                 "profile_image": "https://img%2Fimage730%2F2017%2F7%2F7%2F9232.png?alt=media",
 *                 "user_key": 127
 *             }
 *         }
 *     }, ..
 * ]
 */
router.get('/:user_key', controller.getData)

/** @api {get} /follow/target/:user_key 유저 팔로워 조회
 * 
 * @apiName getTargetData 
 * @apiGroup follow
 * @apiParam {Number} user_key 유저키
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * [
 *     {
 *         "created_at": "2017-07-07T10:07:25.318Z",
 *         "User": {
 *             "user_key": 18,
 *             "name": "진시호",
 *             "profile_image": "https://firebasestorage.googleapis2F2017%2F7%2F26%2F46608.png?alt=media",
 *             "Host": {
 *                 "status": 3,
 *                 "type": 0,
 *                 "host_key": 80,
 *                 "name": "진시호",
 *                 "profile_image": "https://firebasestorage.googleapis.com/%2F8%2F11%2F35461.png?alt=media"
 *             }
 *         },
 *         "Follower": {
 *             "user_key": 37,
 *             "name": "유니",
 *             "profile_image": "https://firebasestorage.googleapis.com/v0/b2F2017%2F7%2F20%2F21323.png?alt=media"
 *         }
 *     }, ...
 * ]
 */
router.get('/target/:user_key', controller.getTargetData)

/** @api {put} /follow/:user_key/:follower_user_key 유저 팔로워 토글
 * 
 * @apiName putData
 * @apiGroup follow
 * @apiParam {Number} user_key 유저키
 * @apiParam {Number} follower_user_key 팔로잉할 유저키
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *     "follow_key": 467,
 *     "user_key": 37,
 *     "follower_user_key": 18,
 *     "updated_at": "2017-12-06T07:33:40.149Z",
 *     "created_at": "2017-12-06T07:33:40.149Z"
 * }
 * or
 * 1
 */
router.put('/:user_key/:follower_user_key', controller.putData)



module.exports = router
