const express = require('express')
const router = express.Router()
const service = require('../service')

const controller = require('./controller')

/** @api {get} /qna/ qna 조회
 * @apiParam {String} token (옵션)[헤더]토큰-같이오면 해당유저의 비공개 qna도 보냄
 * @apiParam {Number} activity_key (옵션)엑티비티키 - 특정엑티비티 qna만 가져옴
 * 
 * @apiName getQna
 * @apiGroup qna
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *     "count": 2,
 *     "rows": [
 *         {
 *             "doc_key": 658,
 *             "content": "궁금해요\n",
 *             "user_key": 37,
 *             "private_mode": false,
 *             "status": 0,
 *             "answer": "안궁",
 *             "created_at": "2017-11-23T11:08:30.585Z",
 *             "updated_at": "2017-12-06T08:07:07.588Z",
 *             "User": {
 *                 "user_key": 37,
 *                 "name": "유니",
 *                 "profile_image": "https://firebasestorage.googleapis.com/v0/b/wekin-9111d.appspot.com/o/img%2Fimage730%2F2017%2F7%2F20%2F21323.png?alt=media"
 *             }
 *         },
 *         {
 *             "doc_key": 647,
 *             "content": "ㅈㄹ문",
 *             "user_key": 2041,
 *             "private_mode": false,
 *             "status": 0,
 *             "answer": null,
 *             "created_at": "2017-11-20T13:16:22.186Z",
 *             "updated_at": "2017-11-20T13:16:22.186Z",
 *             "User": {
 *                 "user_key": 2041,
 *                 "name": "testw",
 *                 "profile_image": "https://firebasestorage.googleapis.com/v0/b/wekin-9111d.appspot.com/o/img%2Fimage%2F2017%2F11%2F20%2F3854.png?alt=media&token=1a8302b4-373d-425d-9fa7-e61fe62f6326"
 *             }
 *         }
 *     ]
 * }
 */
router.get('/', controller.getQna)

/** @api {post} /qna/:activity_key qna작성
 * @apiParam {Number} activity_key activity key
 * @apiParam {String} content 내용 
 * @apiParam {Boolean} private_mode 공개/비공개
 * @apiParam {String} activity_title 엑티비티 이름
 * @apiParam {Number} host_key 호스트키
 * 
 * @apiName postQna
 * @apiGroup qna 
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *     "share_count": 0,
 *     "doc_key": 668,
 *     "user_key": 37,
 *     "activity_key": 200,
 *     "activity_title": null,
 *     "host_key": null,
 *     "content": "ㅈㄹㅈㄷㄹㅈㄷㄹㅈ",
 *     "private_mode": null,
 *     "type": 2,
 *     "status": 0,
 *     "updated_at": "2017-12-07T02:21:02.068Z",
 *     "created_at": "2017-12-07T02:21:02.068Z",
 *     "activity_rating": null,
 *     "images": null,
 *     "image_url": null,
 *     "tags": null,
 *     "answer": null,
 *     "medias": null
 * }
 */
router.post('/:activity_key', service.authChk, controller.postQna)

/** @api {post} /qna/:doc_key qna삭제
 * @apiParam {Number} doc_key doc_key
 * 
 * @apiName deleteQna
 * @apiGroup qna 
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *     1
 * }
 */
router.delete('/:doc_key', service.authChk,controller.deleteQna)

/** @api {post} /qna/:doc_key/reply qna 답변 
 * @apiParam {Number} doc_key doc_key
 * @apiParam {String} answer 답변내용 
 * 
 * @apiName postReply
 * @apiGroup qna 
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *     "share_count": 0,
 *     "doc_key": 668,
 *     "user_key": 37,
 *     "activity_key": 200,
 *     "activity_title": null,
 *     "host_key": null,
 *     "content": null,
 *     "private_mode": null,
 *     "type": 2,
 *     "status": 0,
 *     "updated_at": "2017-12-07T02:21:02.068Z",
 *     "created_at": "2017-12-07T02:21:02.068Z",
 *     "activity_rating": null,
 *     "images": null,
 *     "image_url": null,
 *     "tags": null,
 *     "answer": '하핫',
 *     "medias": null
 * }
 */
router.post('/:doc_key/reply', service.authChk,controller.postReply)

/** @api {put} /qna/:doc_key/reply qna 답변 수정
 * @apiParam {Number} doc_key doc_key
 * @apiParam {String} answer 답변내용 
 * 
 * @apiName postReply
 * @apiGroup qna 
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *     "share_count": 0,
 *     "doc_key": 668,
 *     "user_key": 37,
 *     "activity_key": 200,
 *     "activity_title": null,
 *     "host_key": null,
 *     "content": null,
 *     "private_mode": null,
 *     "type": 2,
 *     "status": 0,
 *     "updated_at": "2017-12-07T02:21:02.068Z",
 *     "created_at": "2017-12-07T02:21:02.068Z",
 *     "activity_rating": null,
 *     "images": null,
 *     "image_url": null,
 *     "tags": null,
 *     "answer": '하핫',
 *     "medias": null
 * }
 */
router.put('/:doc_key/reply', service.authChk,controller.putReply)

module.exports = router
