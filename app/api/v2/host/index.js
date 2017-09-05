const express = require('express')
const router = express.Router()
const { authChk } = require('../service')
const model = require('../../../model')

const controller = require('./controller')
const controllerf = require('./controllerf')

router.route('/front')
  .get(controllerf.findAllHost)
  
router.route('/front/request')
  .post(authChk, controllerf.createHost)
  
router.route('/front/:host_key/qna')
  .get(authChk, controllerf.findAllQna)

router.route('/front/qna/:doc_key')
  .put(authChk, controllerf.updateAnswer)

router.route('/front/:host_key')
  .get(controllerf.findHost)
  .post(controllerf.updateHost)

router.route('/front/:host_key/activity')
  .get(controllerf.findAllActivity)

router.route('/front/:host_key/review')
  .get(controllerf.findAllReview)

router.route('/front/:host_key/feed')
  .get(controllerf.findAllHostFeed)

router.route('/front/:host_key/reservation')
  .get(controllerf.findAllReservation)

router.route('/front/:host_key/rating')
  .get((req, res, next) => {
    let queryOptions = {
      where: { host_key: req.params.host_key },
      attributes: ['activity_key']
    }
    model.Activity.findAll(queryOptions)
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

router.route('/front/:host_key/favorite')
  .get((req, res, next) => {
    let queryOptions = {
      where: { host_key: req.params.host_key },
      attributes: ['activity_key']
    }
    model.Activity.findAll(queryOptions)
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



/** @api {get} /host/ 호스트 목록
 * 
 * @apiName getList
 * @apiGroup host
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *  [
 *     {
 *         Host
 *     }
 *   ]
 * 
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 403 Bad Request
 * { "result": "err" }
 */
router.get('/', controller.getList)

/** @api {get} /host/approve/ 승인대기 호스트 목록
 * 
 * @apiName getApproveList
 * @apiGroup host
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *  [
 *     {
 *         Host
 *     }
 *   ]
 * 
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 403 Bad Request
 * { "result": "err" }
 */
router.get('/approve/', controller.getApproveList)

/** @api {get} /host/:/key 호스트 상세정보
 * @apiParam {Number} key 호스트 키
 * 
 * @apiName getOne
 * @apiGroup host
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         Host
 *     }
 * 
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 403 Bad Request
 * { "result": "err" }
 */
router.get('/:key', controller.getOne)

/** @api {put} /host/update/:host_key 호스트 정보 수정
 * @apiParam {Number} host_key 호스트 키
 * @apiParam {String} email 이메일
 * @apiParam {String} history 연혁
 * @apiParam {String} address 주소
 * @apiParam {String} home_page 홈페이지
 * @apiParam {String} name 호스트이름
 * @apiParam {String} sns 호스트sns
 * @apiParam {String} tel 호스트 전화번호
 * @apiParam {String} introduce 소개
 * @apiParam {String} join_method 호스트 키
 * @apiParam {Number} type 호스트 타입
 * @apiParam {String} business_registration 사업자등록증
 * @apiParam {String} license 자격증
 * 
 * @apiName putOne
 * @apiGroup host
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
router.put('/update/:host_key', controller.putOne)


/** @api {put} /host/update/:host_key 호스트신청 승인
 * @apiParam {Number} host_key 호스트 키
 * 
 * @apiName approveHost
 * @apiGroup host
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
router.put('/approve/:host_key', controller.approveHost)

/** @api {delete} /host/delete/:host_key 호스트 삭제
 * @apiParam {Number} host_key 호스트 키
 * 
 * @apiName deleteHost
 * @apiGroup host
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
router.delete('/delete/:host_key', controller.deleteHost)




module.exports = router