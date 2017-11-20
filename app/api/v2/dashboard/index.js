const express = require('express')
const router = express.Router()

const controller = require('./controller')

/**
 * @api {get} /dashboard/ 대시보드 기본정보
 * @apiName getDashboard
 * @apiGroup dashboard
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *     "userCount": 27,
 *     "todaysUser": 0,
 *     "todayActivateWekin": 3,
 *     "todaysOrderCount": 2
 * }
 */
router.get('/', controller.getDashboard)

/**
 * @api {get} /dashboard/activity 최근 활동정보
 * @apiName getActivity
 * @apiGroup dashboard
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * [
 *     {
 *         "activity_key": 7,
 *         "status": 0,
 *         "create_date": 2017-06-14T13:38:25.000Z,
 *         "title": "단양 패러글라이딩",
 *         "Host": {
 *             "host_key": 4,
 *             "user_key": 0,
 *             "host_name": "위키너"
 *         }
 *     }
 * ]
 */
router.get('/activity', controller.getActivity)

/**
 * @api {get} /dashboard/host 호스트 신청정보
 * @apiName getHost
 * @apiGroup dashboard
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * [
 *     {
 *         "host_key": 4,
 *         "host_name": "위키너"
 *     }
 * ]
 */
router.get('/host', controller.getHost)

/**
 * @api {get} /dashboard/refund 최신 환불요청 보기
 * @apiName getRefundRequest  
 * @apiGroup dashboard
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * [
 *     {
 *         "user_name": "김진형",
 *         "created_at": "2018-04-02T19:54:40.000Z",
 *         "order_at": "2018-04-04T21:02:00.000Z",
 *         "status": "reqRef"
 *     }
 * ]
 */
router.get('/refund', controller.getRefundRequest)

/**
 * @api {get} /dashboard/doc 최신 피드&후기
 * @apiName getDocument
 * @apiGroup dashboard
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * [
 *     {
 *         "doc_key": 78,
 *         "create_date": "2017-06-14T13:38:25.000Z",
 *         "type": 1,
 *         "User": {
 *             "user_key": 24,
 *             "name": "위킴"
 *         }
 *     }
 * ]
 */
router.get('/doc', controller.getDocument)

module.exports = router