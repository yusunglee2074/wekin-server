const express = require('express')
const router = express.Router()

const controller = require('./controller')

/** @api {get} /favorite/:user_key 유저 관심 엑티비티
 * 
 * @apiName getData
 * @apiGroup favorite
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * [
 *     {
 *         "fav_key": 5,
 *         "user_key": 22,
 *         "activity_key": 8,
 *         "created_at": "2017-07-05T07:43:25.600Z",
 *         "updated_at": "2017-07-05T07:43:25.600Z",
 *         "ActivityNew": { }
 *     }, ...
 * ]
 */
router.get('/:user_key', controller.getData)

/** @api {get} /favorite/:user_key/:activity_key 관심 토글
 * 
 * @apiName putData
 * @apiGroup favorite
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *     "fav_key": 376,
 *     "user_key": 2,
 *     "activity_key": 8,
 *     "updated_at": "2017-12-06T07:23:54.898Z",
 *     "created_at": "2017-12-06T07:23:54.898Z"
 * }
 * or
 * 1
 */
router.put('/:user_key/:activity_key', controller.putData)

module.exports = router
