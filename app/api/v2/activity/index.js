const express = require('express')
const router = express.Router()
const { authChk } = require('../service')

const controller = require('./controller')
const controllerf = require('./controllerf')

router.route('/front')
  .get(controllerf.findAllActivity)
  .post(authChk, controllerf.createActivity)

router.route('/front/period/:key/')
  .get(controllerf.findAllActivity)

router.route('/front/wekin')
  .get(controllerf.findAllWekinWithActivity)

router.route('/front/:activity_key')
  .get(controllerf.findOneActivity)
  .put(authChk, controllerf.updateActivity)
  .delete(authChk, controllerf.deleteActivity)

router.route('/front/:activity_key/wekin')
  .get(controllerf.findAllWekin)

router.route('/front/:activity_key/wekin/:wekin_key')
  .get(controllerf.findOneWekin)

router.route('/front/wekin/:wekin_key/wekiner')
  .get(controllerf.findWekiner)

router.route('/front/host/:host_key/')
  .get(controllerf.findAllActivityOfHost)

router.route('/front/host/:host_key/recently')
  .get(controllerf.findAllRecentlyActivityOfHost)

/** @api {get} /activity/wekin/:activity_key 같은 액티비티의 위킨 리스트
 * @apiParam {Number} activity_key 액티비티 키
 * 
 * @apiName getChildWekin
 * @apiGroup activiry
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *  [
 *     {
 *         "wekin_key": 13,
 *         "activity_key": 9,
 *         "min_user": 10,
 *         "max_user": 20,
 *         "start_date": "2017-07-08T10:00:00.000Z",
 *         "due_date": "2017-07-07T10:00:00.000Z",
 *         "commission": 16,
 *         "status": "show",
 *         "created_at": "2017-06-20T10:03:40.956Z",
 *         "updated_at": "2017-06-20T13:08:26.499Z"
 *     }
 *   ]
 * 
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 403 Bad Request
 * { "result": "err" }
 */
router.get('/wekin/:activity_key', controller.getChildWekin)

/** @api {get} /activity/approve/ 승인대상 예정의 액티비티 리스트
 * 
 * @apiName getApproveList
 * @apiGroup activiry
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * [
 *     {
 *         "activity_key": 11,
 *         "host_key": 4,
 *         "status": 1,
 *         "main_image": {
 *             "image": "https://firebasestorage.googleapis.com/v0/b/wekin-9111d.appspot.com/o/img%2Fimage730%2F2017%2F6%2F21%2F8197.png?alt=media"
 *         },
 *         "title": "묘기자전거 대행진!!",
 *         "intro_summary": "묘기 자전거는 어른,아이 모두에게 좋은 스포츠 입니다. 집중력 향상과 근력향상에 도움을 줍니다.",
 *         "intro_detail": "내용~",
 *         "schedule": "· 08:30~18:30\n※ 매주 월요일 휴무\n※ 수업 진행 최소 2주 전 문의 바랍니다.\n",
 *         "inclusion": "포함 사항\n\n- 초보자를 위한 이론 강습\n- 장갑, 승마 조끼, 승마 모자\n- 온수 샤워\n불포함 사항\n\n- 청바지, 운동화\n- 세면도구\n- 수건",
 *         "preparation": "청바지, 운동화, 샤워 도구, 수건",
 *         "address": "대한민국 인천광역시 남동구 장수서창동 444",
 *         "address_detail": {
 *             "text": "인천광역시 남동구 장수동 444-28번지",
 *             "location": {
 *                 "lat": 37.4578227,
 *                 "lng": 126.7477583
 *             },
 *             "mapImg": "https://maps.googleapis.com/maps/api/staticmap?key=AIzaSyBmH8xZ6avKGaILXaCLujhU7J3WLL3cwJU&center=37.4578227%2C126.7477583&zoom=16&size=600x300&maptype=roadmap&markers=color%3Ablue%7Clabel%3AW%7C37.4578227%2C126.7477583"
 *         },
 *         "refund_policy": "티켓 구매 후 2주 이내 100% 환불, 2주 후에는 환불 불가",
 *         "price": 55000,
 *         "count": 0,
 *         "confirm_date": "2017-06-21T06:25:41.000Z",
 *         "created_at": "2017-06-21T06:25:41.492Z",
 *         "updated_at": "2017-06-21T06:29:51.798Z",
 *         "Host": {
 *             "host_key": 4,
 *             "user_key": 19,
 *             "introduce": "저는 롤을 가르치는 메이커입니다.",
 *             "email": "sungkyoum@naver.com",
 *             "history": "인천시배 2017 롤프리미어 우승\n2017 롤 드컵 우승 \n2016 롤 드컵 우승 \n2015 롤 드컵 우승 \n2014 롤 드컵 우승 \n\n",
 *             "profile_image": "https://firebasestorage.googleapis.com/v0/b/wekin-9111d.appspot.com/o/img%2Fimage730%2F2017%2F6%2F22%2F50398.png?alt=media",
 *             "name": "롤티처",
 *             "tel": "01077571933",
 *             "address": "서울시 서초구 방배로 89",
 *             "sns": "",
 *             "business_registration": null,
 *             "license": null,
 *             "type": 1,
 *             "join_method": "지인소개",
 *             "home_page": "www.naver.com",
 *             "status": 3,
 *             "created_at": "2017-06-21T06:13:37.397Z",
 *             "updated_at": "2017-06-22T08:48:11.853Z"
 *         }
 *     }
 * ]
 * 
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 403 Bad Request
 * { "result": "err" }
 */
router.get('/approve/', controller.getApproveList)

/** @api {put} /activity/approve/:activity_key 액티비티 관리자 승인
 * @apiParam {Number} activity_key 액티비티 키
 * 
 * @apiName getApproveActivity
 * @apiGroup activiry
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *      1
 * 
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 403 Bad Request
 * { "result": "err" }
 */
router.put('/approve/:activity_key', controller.getApproveActivity)

/** @api {delete} /activity/approve/:activity_key 액티비티 삭제
 * @apiParam {Number} activity_key 액티비티 키
 * 
 * @apiName deleteAvtivity
 * @apiGroup activiry
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *  1
 * 
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 403 Bad Request
 * { "result": "err" }
 */
router.delete('/approve/:activity_key', controller.deleteAvtivity)

/** @api {delete} /activity/approve/:activity_key 액티비티 반려
 * @apiParam {Number} activity_key 액티비티 키
 * 
 * @apiName rejectActivity
 * @apiGroup activiry
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *  1
 * 
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 403 Bad Request
 * { "result": "err" }
 */
router.post('/approve/:activity_key', controller.rejectActivity)

/** @api {get} /activity/ 액티비티 리스트
 * 
 * @apiName getList
 * @apiGroup activiry
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *  [
 *     {
 *         Activity
 *     }
 *   ]
 * 
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 403 Bad Request
 * { "result": "err" }
 */
router.get('/', controller.getList)

/** @api {get} /activity/:activity_key 액티비티 정보
 * @apiParam {Number} activity_key 액티비티 키
 * 
 * @apiName getList
 * @apiGroup activiry
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         Activity
 *     }
 * 
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 403 Bad Request
 * { "result": "err" }
 */
router.get('/:key', controller.getOne)

/** @api {put} /activity/:activity_key 액티비티 수정
 * @apiParam {Number} activity_key 액티비티 키
 * @apiParam {Number} title 제목
 * @apiParam {Number} intro_summary 요약
 * @apiParam {Number} intro_detail 상세설명
 * @apiParam {Number} schedule 세부일정
 * @apiParam {Number} inclusion 포함사항
 * @apiParam {Number} preparation 준비물
 * @apiParam {Number} address 주소
 * @apiParam {Number} address_detail 기타 주소정보
 * @apiParam {Number} refund_policy 환불정책
 * @apiParam {Number} main_image 이미지
 * 
 * @apiName putOne
 * @apiGroup activiry
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *          1
 *     }
 * 
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 403 Bad Request
 * { "result": "err" }
 */
router.put('/:key', controller.putOne)

module.exports = router 
