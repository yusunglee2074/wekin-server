const express = require('express')
const router = express.Router()
const { authChk } = require('../service')
const model = require('../../../model')

const controller = require('./controller')
const controllerf = require('./controllerf')

/** @api {get} /host/front 모든 호스트 조회
 * 
 * @apiName findAllHost 
 * @apiGroup host
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * [
 *    {{ hosts }}
 * ]
 */
router.route('/front')
  .get(controllerf.findAllHost)
  
/** @api {post} /host/front/request 호스트 신청
 * 
 * @apiName createHost
 * @apiGroup host
 * @apiParam {String} introduce 자기소개
 * @apiParam {String} history 경력사항
 * @apiParam {String} profile_image 프로필 이미지 url
 * @apiParam {String} name 이름
 * @apiParam {String} tel 전화번호 
 * @apiParam {String} address 주소
 * @apiParam {String} home_page 홈페이지주소
 * @apiParam {String} sns sns주소 
 * @apiParam {String} email 이메일 주소 
 * @apiParam {String} business_registration 사업자등록증 이미지 주소 
 * @apiParam {String} license 자격증 이미지 주소 
 * @apiParam {Number} type 전문가, 일반인등...
 * @apiParam {Number} join_method 가입경로 type
 * @apiParam {String} language 진행가능언어
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *    {{ host }}
 * }
 */
router.route('/front/request')
  .post(authChk, controllerf.createHost)
  
/** @api {get} /host/front/:host_key/qna 호스트 qna조회
 * 
 * @apiName findAllQna
 * @apiGroup host
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *     "results": [
 *         {
 *             "doc_key": 658,
 *             "activity_key": 455,
 *             "user_key": 37,
 *             "activity_title": "결제테스트",
 *             "activity_rating": null,
 *             "content": "궁금해요\n",
 *             "images": null,
 *             "image_url": null,
 *             "medias": null,
 *             "tags": null,
 *             "private_mode": false,
 *             "status": 0,
 *             "type": 2,
 *             "answer": "나는 안궁금 ㅅㄱ",
 *             "host_key": 20,
 *             "share_count": 0,
 *             "created_at": "2017-11-23T11:08:30.585Z",
 *             "updated_at": "2017-11-24T07:10:47.778Z",
 *             "User": {
 *                 "user_key": 37,
 *                 "uuid": "8pPmvczfckWMIaJfou8KLO7xxOj2",
 *                 "profile_image": "httpseom/o/img%2Fimage730%2F2017%2F7%2F20%2F21323.png?alt=media",
 *                 "name": "유니",
 *                 "gender": 1,
 *                 "introduce": null,
 *                 "email": "cheyja@naver.com",
 *                 "email_valid": false,
 *                 "email_noti": null,
 *                 "sms_noti": true,
 *                 "push_noti": true,
 *                 "phone": "01093666639",
 *                 "phone_valid": false,
 *                 "notification": null,
 *                 "last_login_date": "2017-06-29T06:06:12.000Z",
 *                 "point": {
 *                     "point": 0,
 *                     "point_special": 0,
 *                     "percentage": 100
 *                 },
 *                 "birthday": null,
 *                 "email_company": null,
 *                 "email_company_valid": false,
 *                 "country": "Korea",
 *                 "work_balance_point": 0,
 *                 "work_balance_point_history": [],
 *                 "created_at": "2017-06-29T06:06:12.488Z",
 *                 "updated_at": "2017-11-29T01:24:30.660Z",
 *                 "deleted_at": null
 *             }
 *         }, ....
 *     ]
 * }
 */
router.route('/front/:host_key/qna')
  .get(authChk, controllerf.findAllQna)

/** @api {put} /host/front/qna/:doc_key 답변달기
 * 
 * @apiName updateAnswer
 * @apiGroup host
 * @apiParam {String} answer 답변내용
 * @apiParam {Number} doc_key 독키 
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * [
 *     1
 * ]
 */
router.route('/front/qna/:doc_key')
  .put(authChk, controllerf.updateAnswer)

/** @api {get} /host/:host_key 답변달기
 * 
 * @apiName findHost
 * @apiGroup host
 * @apiParam {Number} host_key 호스트키 
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *     "host_key": 20,
 *     "user_key": 37,
 *     "introduce": "나도 메이커다",
 *     "email": "lys0333@gmail.com",
 *     "history": null,
 *     "profile_image": "https://firebasestorage.googleapis.com/v0/b/wekin-9111d.appspot.com/o/img%2Fimage730%2F2017%2F6%2F29%2F27260.png?alt=media",
 *     "name": "위킨메이커_채윤",
 *     "tel": "111",
 *     "address": null,
 *     "sns": null,
 *     "business_registration": null,
 *     "license": "https://firebasestorage.googleapis.com/v0/b/wekin-9111d.appspot.com/o/img%2Fimage730%2F2017%2F6%2F29%2F54601.png?alt=media",
 *     "license_list": null,
 *     "type": 0,
 *     "join_method": "지인소개",
 *     "home_page": null,
 *     "status": 3,
 *     "language": null,
 *     "created_at": "2017-06-29T06:39:05.582Z",
 *     "updated_at": "2017-08-09T05:42:57.887Z",
 *     "User": {
 *         "user_key": 37,
 *         "uuid": "8pPmvczfckWMIaJfou8KLO7xxOj2",
 *         "profile_image": "https://firebasestorage.googleapis.com/v0/b/wekin-9111d.appspot.com/o/img%2Fimage730%2F2017%2F7%2F20%2F21323.png?alt=media",
 *         "name": "유니",
 *         "gender": 1,
 *         "introduce": null,
 *         "email": "cheyja@naver.com",
 *         "email_valid": false,
 *         "email_noti": null,
 *         "sms_noti": true,
 *         "push_noti": true,
 *         "phone": "01093666639",
 *         "phone_valid": false,
 *         "notification": null,
 *         "last_login_date": "2017-06-29T06:06:12.000Z",
 *         "point": {
 *             "point": 0,
 *             "point_special": 0,
 *             "percentage": 100
 *         },
 *         "birthday": null,
 *         "email_company": null,
 *         "email_company_valid": false,
 *         "country": "Korea",
 *         "work_balance_point": 0,
 *         "work_balance_point_history": [],
 *         "created_at": "2017-06-29T06:06:12.488Z",
 *         "updated_at": "2017-11-29T01:24:30.660Z",
 *         "deleted_at": null
 *     }
 * }
 */
/** @api {post} /host/front/:host_key 호스트수정
 * 
 * @apiName updateHost
 * @apiGroup host
 * @apiParam {Number} host_key 호스트키 
 * @apiParam {String} params 호스트 생성과 동일
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *    {{ host }}
 * }
 */
router.route('/front/:host_key')
  .get(controllerf.findHost)
  .post(controllerf.updateHost)

/** @api {get} /host/front/:host_key/activity 호스트 엑티비티 조회
 * 
 * @apiName findAllActivity
 * @apiGroup host
 * @apiParam {Number} host_key 호스트키 
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * [
 *    {{ Activities }}
 * ]
 */
router.route('/front/:host_key/activity')
  .get(controllerf.findAllActivity)

/** @api {get} /host/front/:host_key/review 호스트 리뷰 조회
 * 
 * @apiName findAllreview
 * @apiGroup host
 * @apiParam {Number} host_key 호스트키 
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * [
 *    {{ Docs }}
 * ]
 */
router.route('/front/:host_key/review')
  .get(controllerf.findAllReview)

/** @api {get} /host/front/:host_key/feed 호스트 소통 조회
 * 
 * @apiName findAllHostFeed
 * @apiGroup host
 * @apiParam {Number} host_key 호스트키 
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * [
 *    {{ Docs }}
 * ]
 */
router.route('/front/:host_key/feed')
  .get(controllerf.findAllHostFeed)

/** @api {get} /host/front/:host_key/reservation 호스트 예약자 수 조회
 * 
 * @apiName  findAllReservation
 * @apiGroup host
 * @apiParam {Number} host_key 호스트키 
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *     "results": [
 *         {
 *             "date": "2017-12-05",
 *             "count": "6"
 *         },
 *         {
 *             "date": "2017-12-01",
 *             "count": "3"
 *         }
 *     ]
 * }
 */
router.route('/front/:host_key/reservation')
  .get(controllerf.findAllReservation)

/** @api {get} /host/front/:host_key/rating 호스트 별점
 * 
 * @apiName  findAllRating
 * @apiGroup host
 * @apiParam {Number} host_key 호스트키 
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *     "results": [
 *         {
 *             "doc_key": 667,
 *             "activity_key": 465,
 *             "activity_rating": 5
 *         },
 *         {
 *             "doc_key": 666,
 *             "activity_key": 455,
 *             "activity_rating": 3
 *         },
 *         {
 *             "doc_key": 665,
 *             "activity_key": 455,
 *             "activity_rating": 5
 *         },
 *         {
 *             "doc_key": 664,
 *             "activity_key": 455,
 *             "activity_rating": 5
 *         }
 *     ]
 * }
 */
router.route('/front/:host_key/rating')
  .get((req, res, next) => {
    let queryOptions = {
      where: { host_key: req.params.host_key },
      attributes: ['activity_key']
    }
    model.ActivityNew.findAll(queryOptions)
      .then((results) => {
        let activityKeys = results.map(activity => {
          return activity.activity_key
        })
        let queryOptions = {
          where: { activity_key: { in: activityKeys }, type: 1 },
          order: [['created_at', 'DESC']],
          group: ['Doc.doc_key'],
          attributes: [
            'doc_key',
            'activity_key',
            'activity_rating'
          ]
        }
        model.Doc.findAll(queryOptions)
          .then(results => res.json({ results: results }))
          .catch(err => next(err))
      })
      .catch((err) => next(err))
  })

/** @api {get} /host/front/:host_key/favorite 호스트 좋아요
 * 
 * @apiName  findAllFavorite
 * @apiGroup host
 * @apiParam {Number} host_key 호스트키 
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *     "results": [
 *         {
 *             "fav_key": 224,
 *             "user_key": 1748,
 *             "activity_key": 234,
 *             "created_at": "2017-09-29T04:54:57.470Z",
 *             "updated_at": "2017-09-29T04:54:57.470Z"
 *         },
 *         {
 *             "fav_key": 251,
 *             "user_key": 1899,
 *             "activity_key": 234,
 *             "created_at": "2017-10-21T15:44:25.464Z",
 *             "updated_at": "2017-10-21T15:44:25.464Z"
 *         }
 *     ]
 * }
 */
router.route('/front/:host_key/favorite')
  .get((req, res, next) => {
    let queryOptions = {
      where: { host_key: req.params.host_key },
      attributes: ['activity_key']
    }
    model.ActivityNew.findAll(queryOptions)
      .then((results) => {
        let activityKeys = results.map(activity => {
          return activity.activity_key
        })
        let queryOptions = {
          where: { activity_key: { in: activityKeys } }
        }
        model.Favorite.findAll(queryOptions)
          .then(results => res.json({ results: results }))
          .catch(err => next(err))
      })
      .catch((err) => next(err))
  })



router.get('/', controller.getList)

/** @api {get} /host/approve [어드민]신청승인신청목록
 * 
 * @apiName getApproveList
 * @apiGroup host
 * @apiParam {Number} host_key 호스트키 
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * [ 
 *   {{ hosts }}
 * ]
 */
router.get('/approve/', controller.getApproveList)

/** @api {get} /host/:key 호스트상세
 * 
 * @apiName getOne
 * @apiGroup host
 * @apiParam {Number} key 호스트키 
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *     "host_key": 20,
 *     "user_key": 37,
 *     "introduce": "나도 메이커다",
 *     "email": "lys0333@gmail.com",
 *     "history": null,
 *     "profile_image": "https://firebasestorage.googleapis.com/v0/b/wekin-9111d.appspot.com/o/img%2Fimage730%2F2017%2F6%2F29%2F27260.png?alt=media",
 *     "name": "위킨메이커_채윤",
 *     "tel": "111",
 *     "address": null,
 *     "sns": null,
 *     "business_registration": null,
 *     "license": "https://firebasestorage.googleapis.com/v0/b/wekin-9111d.appspot.com/o/img%2Fimage730%2F2017%2F6%2F29%2F54601.png?alt=media",
 *     "license_list": null,
 *     "type": 0,
 *     "join_method": "지인소개",
 *     "home_page": null,
 *     "status": 3,
 *     "language": null,
 *     "created_at": "2017-06-29T06:39:05.582Z",
 *     "updated_at": "2017-08-09T05:42:57.887Z",
 *     "User": {
 *         "user_key": 37,
 *         "uuid": "8pPmvczfckWMIaJfou8KLO7xxOj2",
 *         "profile_image": "https://firebasestorage.googleapis.com/v0/b/wekin-9111d.appspot.com/o/img%2Fimage730%2F2017%2F7%2F20%2F21323.png?alt=media",
 *         "name": "유니",
 *         "gender": 1,
 *         "introduce": null,
 *         "email": "cheyja@naver.com",
 *         "email_valid": false,
 *         "email_noti": null,
 *         "sms_noti": true,
 *         "push_noti": true,
 *         "phone": "01093666639",
 *         "phone_valid": false,
 *         "notification": null,
 *         "last_login_date": "2017-06-29T06:06:12.000Z",
 *         "point": {
 *             "point": 0,
 *             "point_special": 0,
 *             "percentage": 100
 *         },
 *         "birthday": null,
 *         "email_company": null,
 *         "email_company_valid": false,
 *         "country": "Korea",
 *         "work_balance_point": 0,
 *         "work_balance_point_history": [],
 *         "created_at": "2017-06-29T06:06:12.488Z",
 *         "updated_at": "2017-11-29T01:24:30.660Z",
 *         "deleted_at": null
 *     }
 * }
 */
router.get('/:key', controller.getOne)

/** @api {put} /host/:host_key 호스트 수정
 * 
 * @apiName updateOne
 * @apiGroup host
 * @apiParam {Number} host_key 호스트키 
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *     "host_key": 20,
 *     "user_key": 37,
 *     "introduce": "나도 메이커다",
 *     "email": "lys0333@gmail.com",
 *     "history": null,
 *     "profile_image": "https://firebasestorage.googleapis.com/v0/b/wekin-9111d.appspot.com/o/img%2Fimage730%2F2017%2F6%2F29%2F27260.png?alt=media",
 *     "name": "위킨메이커_채윤",
 *     "tel": "111",
 *     "address": null,
 *     "sns": null,
 *     "business_registration": null,
 *     "license": "https://firebasestorage.googleapis.com/v0/b/wekin-9111d.appspot.com/o/img%2Fimage730%2F2017%2F6%2F29%2F54601.png?alt=media",
 *     "license_list": null,
 *     "type": 0,
 *     "join_method": "지인소개",
 *     "home_page": null,
 *     "status": 3,
 *     "language": null,
 *     "created_at": "2017-06-29T06:39:05.582Z",
 *     "updated_at": "2017-08-09T05:42:57.887Z",
 *     "User": {
 *         "user_key": 37,
 *         "uuid": "8pPmvczfckWMIaJfou8KLO7xxOj2",
 *         "profile_image": "https://firebasestorage.googleapis.com/v0/b/wekin-9111d.appspot.com/o/img%2Fimage730%2F2017%2F7%2F20%2F21323.png?alt=media",
 *         "name": "유니",
 *         "gender": 1,
 *         "introduce": null,
 *         "email": "cheyja@naver.com",
 *         "email_valid": false,
 *         "email_noti": null,
 *         "sms_noti": true,
 *         "push_noti": true,
 *         "phone": "01093666639",
 *         "phone_valid": false,
 *         "notification": null,
 *         "last_login_date": "2017-06-29T06:06:12.000Z",
 *         "point": {
 *             "point": 0,
 *             "point_special": 0,
 *             "percentage": 100
 *         },
 *         "birthday": null,
 *         "email_company": null,
 *         "email_company_valid": false,
 *         "country": "Korea",
 *         "work_balance_point": 0,
 *         "work_balance_point_history": [],
 *         "created_at": "2017-06-29T06:06:12.488Z",
 *         "updated_at": "2017-11-29T01:24:30.660Z",
 *         "deleted_at": null
 *     }
 * }
 */
router.put('/update/:host_key', controller.putOne)

/** @api {put} /host/approve/:host_key 호스트 신청승인
 * 
 * @apiName approveeOne
 * @apiGroup host
 * @apiParam {Number} host_key 호스트키 
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *     "host_key": 20,
 *     "user_key": 37,
 *     "introduce": "나도 메이커다",
 *     "email": "lys0333@gmail.com",
 *     "history": null,
 *     "profile_image": "https://firebasestorage.googleapis.com/v0/b/wekin-9111d.appspot.com/o/img%2Fimage730%2F2017%2F6%2F29%2F27260.png?alt=media",
 *     "name": "위킨메이커_채윤",
 *     "tel": "111",
 *     "address": null,
 *     "sns": null,
 *     "business_registration": null,
 *     "license": "https://firebasestorage.googleapis.com/v0/b/wekin-9111d.appspot.com/o/img%2Fimage730%2F2017%2F6%2F29%2F54601.png?alt=media",
 *     "license_list": null,
 *     "type": 0,
 *     "join_method": "지인소개",
 *     "home_page": null,
 *     "status": 3,
 *     "language": null,
 *     "created_at": "2017-06-29T06:39:05.582Z",
 *     "updated_at": "2017-08-09T05:42:57.887Z",
 *     "User": {
 *         "user_key": 37,
 *         "uuid": "8pPmvczfckWMIaJfou8KLO7xxOj2",
 *         "profile_image": "https://firebasestorage.googleapis.com/v0/b/wekin-9111d.appspot.com/o/img%2Fimage730%2F2017%2F7%2F20%2F21323.png?alt=media",
 *         "name": "유니",
 *         "gender": 1,
 *         "introduce": null,
 *         "email": "cheyja@naver.com",
 *         "email_valid": false,
 *         "email_noti": null,
 *         "sms_noti": true,
 *         "push_noti": true,
 *         "phone": "01093666639",
 *         "phone_valid": false,
 *         "notification": null,
 *         "last_login_date": "2017-06-29T06:06:12.000Z",
 *         "point": {
 *             "point": 0,
 *             "point_special": 0,
 *             "percentage": 100
 *         },
 *         "birthday": null,
 *         "email_company": null,
 *         "email_company_valid": false,
 *         "country": "Korea",
 *         "work_balance_point": 0,
 *         "work_balance_point_history": [],
 *         "created_at": "2017-06-29T06:06:12.488Z",
 *         "updated_at": "2017-11-29T01:24:30.660Z",
 *         "deleted_at": null
 *     }
 * }
 */
router.put('/approve/:host_key', controller.approveHost)

router.delete('/delete/:host_key', controller.deleteHost)

router.get('/admin/get-hosts-with-all-orders', controllerf.getHostsWithAllOrders)




module.exports = router
