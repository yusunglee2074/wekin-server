/**
 * type : 공지사항, FAQ 등의 타입
 * name : 카테고리, 멘트, 설정 등의 종류
 */
const express = require('express')
const router = express.Router()

const controller = require('./controller')

/** @api {get} /env/:type/:name 해당 설정 정보들
 * @apiParam {String="notice","faq", "notice"} type 타입
 * @apiParam {String="category","banner"} name 종류
 * 
 * @apiName getData
 * @apiGroup environment
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * [
 *     {
 *         "value": {
 *             "name": "공지사항",
 *             "color": "D51254"
 *         },
 *         "env_key": 1
 *     }
 * ]
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 403 Bad Request
 * { "result": "err" }
 */
router.get('/:type/:name', controller.getData)

/** @api {post} /env/:type/:name 해당 설정 추가
 * @apiParam {String="notice","faq", "notice"} type 타입
 * @apiParam {Json} value 내용
 * 
 * @apiName postData
 * @apiGroup environment
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "value": {
 *             "name": "공지사항",
 *             "color": "D51254"
 *         },
 *         "env_key": 1
 *     }
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 403 Bad Request
 * { "result": "err" }
 */
router.post('/:type/:name', controller.postData)

/** @api {put} /env/:type/:name 해당 설정 수정
 * @apiParam {String="notice","faq", "notice"} type 타입
 * @apiParam {Json} value 내용
 * 
 * @apiName putData
 * @apiGroup environment
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         1
 *     }
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 403 Bad Request
 * { "result": "err" }
 */
router.put('/:type/:name', controller.putData)

/** @api {delete} /env/:type/:name/:key 해당 설정 삭제
 * @apiParam {String="notice","faq", "notice"} type 타입
 * @apiParam {Json} value 내용
 * @apiParam {Number} key 설정키
 * 
 * @apiName deleteData
 * @apiGroup environment
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         1
 *     }
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 403 Bad Request
 * { "result": "err" }
 */
router.delete('/:type/:name/:key', controller.deleteData)


module.exports = router