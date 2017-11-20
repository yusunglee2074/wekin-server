const express = require('express')
const router = express.Router()

const controller = require('./controller')

/**
 * @api {post} /noti/:user_key 알림 설정
 * @apiParam {Number} user_key 대상 user key
 * 
 * @apiParam {String} name 알림 이름['호스트신청, 피드, 질문, 결제']
 * @apiParam {String} target 알림 내용['승인', '좋아요', '답변']
 * @apiParam {String} type 알림타입 ['host', 'user']
 * @apiParam {json} extra 알림대상 {"doc_key": 3}
 * 
 * @apiName postNoti
 * @apiGroup noti
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * 
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 403 Bad Request
 */
router.post('/:user_key', controller.postNoti)

/**
 * @api {get} /noti/ 나의 알림 리스트
 * 
 * @apiName getNoti
 * @apiGroup noti
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *  [
 *     {
 *         "noti_key": 22,
 *         "user_key": 17,
 *         "user_name": "김진형",
 *         "target_user_key": 16,
 *         "target_user_name": "위킨",
 *         "active_name": "피드",
 *         "active_target": "좋아요",
 *         "type": "user",
 *         "extra": {
 *             "doc_key": 2
 *         },
 *         "created_at": "2017-06-22T07:39:22.337Z",
 *         "updated_at": "2017-06-22T07:39:22.337Z",
 *         "deleted_at": null
 *     }
 *  ]
 * 
 * @apiErrorExample Error-Res ponse:
 *     HTTP/1.1 403 Bad Request
 */
router.get('/', controller.getNoti)



module.exports = router