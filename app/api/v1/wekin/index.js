const express = require('express')
const router = express.Router()

const controller = require('./controller')


router.get('/front', controller.getFrontWekin)

router.post('/front/post', controller.postFrontWekin)

/** @api {put} /wekin/approve/:wekin_key 위킨 수수료 조절
 * @apiParam {Number} wekin_key 위킨키
 * 
 * @apiParam {Number} commission 수수료율
 * @apiName adjustCommission
 * @apiGroup wekin
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *  1
 * }
 *
 * @apiError Bad Request 잘못된 요청
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "errorCode": -2,
 *       "data": "ERROR_INVALID_PARAM"
 *     }
 */
router.put('/approve/:wekin_key', controller.adjustCommission)


router.get('/order/:key', controller.getOneIncludeOrder)

router.get('/finish', controller.getFinishList)

router.post('/finish/:wekin_key', controller.setFinish)

/**
 * @api {get} /wekin/activity/:key 위킨 스케줄리스트
 * @apiParam {Number} key 위킨키
 * @apiName getSameActivity
 * @apiGroup wekin
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * [
 * ]
 *
 * @apiError Bad Request 잘못된 요청
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "errorCode": -2,
 *       "data": "ERROR_INVALID_PARAM"
 *     }
 */
router.get('/activity/:key', controller.getSameActivity)


/**
 * @api {delete} /:wekin_key 위킨 삭제
 * @apiParam {Number} wekin_key 위킨키
 * @apiName deleteWekin
 * @apiGroup wekin
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *  1
 * 
 * 
 * @apiErrorExample 삭제 실패:
 *     HTTP/1.1 403 Forbidden
 *     {
 *       "msg": "예약중인 회원이 있는경우엔 불가능 합니다."
 *     }
 */
router.delete('/:wekin_key', controller.deleteWekin)

router.get('/', controller.getList)

router.post('/', controller.postWekin)

router.get('/:key', controller.getOne)

router.put('/:wekin_key', controller.putWekin)




module.exports = router