const express = require('express')
const service = require('../service')
const router = express.Router()

const controller = require('./controller')

/**
 * @api {get} /board/front 임시결제 삭제
 * @apiParam {Number} type board타입
 * @apiName getFrontBoard 
 * @apiGroup Board
 *
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * [
 *     {
 *         "board_key": 44,
 *         "title": "위킨 오픈!",
 *         "type": 0,
 *         "category": [
 *             22
 *         ],
 *         "content": "위킨이 오픈되였습니다",
 *         "created_at": "2017-06-27T15:43:38.145Z",
 *         "updated_at": "2017-06-27T15:43:38.145Z"
 *     }
 * ]
 */
router.get('/front', controller.getFrontBoard)

/**
 * @api {post} /board/front [어드민] board작성 
 * @apiBody {String} title 제목
 * @apiParam {String} content 내용 
 * @apiParam {Number} type board타입
 * @apiParam {String} category 카테고리
 * @apiName postFrontBoard
 * @apiGroup Board
 *
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *         "board_key": 44,
 *         "title": "위킨 오픈!",
 *         "type": 0,
 *         "category": [
 *             22
 *         ],
 *         "content": "위킨이 오픈되였습니다",
 *         "created_at": "2017-06-27T15:43:38.145Z",
 *         "updated_at": "2017-06-27T15:43:38.145Z"
 * }
 */
router.post('/front', service.authChk, controller.postFrontBoard)

/**
 * @api {get} /board/:type 특정타입 board 조회
 * @apiParam {Number} type board타입
 * @apiName getList 
 * @apiGroup Board
 *
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * [
 * {
 *         "board_key": 44,
 *         "title": "위킨 오픈!",
 *         "type": 0,
 *         "category": [
 *             22
 *         ],
 *         "content": "위킨이 오픈되였습니다",
 *         "created_at": "2017-06-27T15:43:38.145Z",
 *         "updated_at": "2017-06-27T15:43:38.145Z"
 * }, ...
 * ]
 */
router.get('/:type/', controller.getList)

router.post('/:type/', controller.commitData)

/**
 * @api {get} /board/:type/:key board 디테일 조회
 * @apiParam {Number} type board타입
 * @apiParam {Number} key board 키
 * @apiName getOne 
 * @apiGroup Board
 *
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *         "board_key": 44,
 *         "title": "위킨 오픈!",
 *         "type": 0,
 *         "category": [
 *             22
 *         ],
 *         "content": "위킨이 오픈되였습니다",
 *         "created_at": "2017-06-27T15:43:38.145Z",
 *         "updated_at": "2017-06-27T15:43:38.145Z"
 * }, ...
 */
router.get('/:type/:key', controller.getOne)

/**
 * @api {put} /board/:type/:key board 수정
 * @apiParam {Number} type board타입
 * @apiParam {Number} key board 키
 * @apiName putOne 
 * @apiGroup Board
 *
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *         "board_key": 44,
 *         "title": "위킨 오픈!",
 *         "type": 0,
 *         "category": [
 *             22
 *         ],
 *         "content": "위킨이 오픈되였습니다",
 *         "created_at": "2017-06-27T15:43:38.145Z",
 *         "updated_at": "2017-06-27T15:43:38.145Z"
 * }, ...
 */
router.put('/:type/:key', controller.putOne)

/**
 * @api {delete} /board/:type/:key board 삭제
 * @apiParam {Number} type board타입
 * @apiParam {Number} key board 키
 * @apiName putOne 
 * @apiGroup Board
 *
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *  message: 'success'
 * }
 */
router.delete('/:type/:key', controller.delOne)

module.exports = router
