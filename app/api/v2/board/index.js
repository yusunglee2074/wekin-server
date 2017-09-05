const express = require('express')
const service = require('../service')
const router = express.Router()

const controller = require('./controller')

router.get('/front', controller.getFrontBoard)

router.post('/front', service.authChk, controller.postFrontBoard)

/** @api {get} /board/:type 해당 글 리스트
 * @apiParam {String="notice","faq"} type 종류
 * 
 * @apiName getList
 * @apiGroup board
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *  [
 *     {
 *         Board
 *     }
 *   ]
 * 
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 403 Bad Request
 * { "result": "err" }
 */
router.get('/:type/', controller.getList)

/** @api {post} /board/:type 글 작성
 * @apiParam {String="notice","faq"} type 종류
 * @apiParam {String} title 제목
 * @apiParam {String} content 내용
 * @apiParam {Number} category 카테고리
 * 
 * @apiName commitData
 * @apiGroup board
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *  [
 *     {
 *         Board
 *     }
 *   ]
 * 
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 403 Bad Request
 * { "result": "err" }
 */
router.post('/:type/', controller.commitData)

/** @api {get} /board/:type/:key 해당 글
 * @apiParam {String="notice","faq"} type 종류  
 * @apiParam {Number} key 글번호
 * 
 * @apiName getOne
 * @apiGroup board
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         Board
 *     }
 * 
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 403 Bad Request
 * { "result": "err" }
 */
router.get('/:type/:key', controller.getOne)

/** @api {put} /board/:type/:key 글 수정
 * @apiParam {String="notice","faq"} type 종류
 * @apiParam {Number} key 글번호
 * @apiParam {String} title 제목
 * @apiParam {String} content 내용
 * @apiParam {Number} category 카테고리
 * 
 * @apiName putOne
 * @apiGroup board
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         1
 *     }
 * 
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 403 Bad Request
 * { "result": "err" }
 */
router.put('/:type/:key', controller.putOne)

/** @api {delete} /board/:type/:key 글 삭제
 * @apiParam {String="notice","faq"} type 종류
 * @apiParam {Number} key 글번호
 * 
 * @apiName delOne
 * @apiGroup board
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         1
 *     }
 * 
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 403 Bad Request
 * { "result": "err" }
 */
router.delete('/:type/:key', controller.delOne)

module.exports = router