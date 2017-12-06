const express = require('express')
const router = express.Router()

const controller = require('./controller')

/** @api {get} /dashboard [어드민] 메인 정보조회 
 * 
 * @apiName getDashboard
 * @apiGroup dashboard
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *     "message": "success",
 *     "data": {
 *         "numberOfUser": 1852,
 *         "NumberOfTodayUser": 6,
 *         "numberOfActiveActivity": 50,
 *         "toBeConfirmedActivities": [],
 *         "toBeConfirmedMakers": [],
 *         "activityThatEndsSoon": [
 * 
 *         {{ activityDATAs }}
 * 
 *         ],
 *         "recentWekinNew": [
 * 
 *         {{ activityDATAs }}
 * 
 *         ],
 *         "recentDoc": [
 *         
 *         {{ doc DATAs }}
 *         ]
 *     }
 * }
 */
router.get('/', controller.getDashboard)

router.get('/activity', controller.getActivity)

router.get('/host', controller.getHost)

router.get('/refund', controller.getRefundRequest)

router.get('/doc', controller.getDocument)

module.exports = router
