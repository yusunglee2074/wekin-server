const express = require('express')
const { authChk, adminChk } = require('../service')
const router = express.Router()

const controller = require('./controller')

/** @api {get} /order/host/:host_key/:month 호스트 대시보드
 * @apiParam {Number} host_key 호스트 key
 * @apiParam {Number} month 조회 월 key
 * 
 * @apiName getHostsInfo
 * @apiGroup order
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * 
 * {
 *    "total": 100000,
 *    "commission": 0,
 *    "result": 100000,
 *    "list": [
 *        {
 *            "order_key": 142,
 *            "order_total_price": 7900,
 *            "order_receipt_price": 7900,
 *            "order_pay_price": 7900,
 *            "status": "cancelled",
 *            "commission": 10,
 *            "order_refund_price": 7900
 *        }
 *    ]
 *}
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
router.get('/host/:host_key/:month', controller.getHostsInfo)

/** @api {get} /order/pageing/ 주문리스트 페이징 출력
 * 
 * @apiName getOrderListPageing
 * @apiGroup order
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *     "content": [
 *         {
 *           Order
 *         }
 *     ],
 *     "totalPages": 100,
 *     "last": false,
 *     "totalElements": 100,
 *     "size": 1,
 *     "number": 1,
 *     "sort": [],
 *     "offset": 0,
 *     "first": false,
 *     "numberOfElements": 1
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
router.get('/pageing/', adminChk, controller.getOrderListPageing)

// router.get('/order/excel/pageing/', controller.getOrderListPageingExcel)

/** @api {get} /order/refund/ 환불예정리스트 페이징 출력
 * 
 * @apiName getRefundOrderListPageing
 * @apiGroup order
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *     "content": [
 *         {
 *           Order
 *         }
 *     ],
 *     "totalPages": 100,
 *     "last": false,
 *     "totalElements": 100,
 *     "size": 1,
 *     "number": 1,
 *     "sort": [],
 *     "offset": 0,
 *     "first": false,
 *     "numberOfElements": 1
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
router.get('/refund/', adminChk, controller.getRefundOrderListPageing)

/** @api {put} /order/refund/:order_key 환불요청 상태 변경
 * @apiParam {Number} order_key order key
 * 
 * @apiName setOrderRefundRequest
 * @apiGroup order
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
router.put('/refund/:order_key', authChk, controller.setOrderRefundRequest)

/** @api {post} /order/refund/:order_key 환불(주문취소)
 * @apiParam {Number} order_key order key
 * @apiParam {Number} order_refund_price 환불금액
 * 
 * @apiName setOrderCancelled
 * @apiGroup order
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
router.post('/refund/:order_key', adminChk, controller.setOrderCancelled)

/** @api {post} /order/been/:order_id 주문정보 추가
 * @apiParam {Number} order_id order id
 * @apiName setOrderBeen
 * @apiGroup order
 *
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {"result": "done"}
 *
 * @apiError Bad Request 잘못된 요청
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "errorCode": -2,
 *       "data": "ERROR_INVALID_PARAM"
 *     }
 * 
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *     }
 */
router.post('/been/:order_id', controller.setOrderBeen)

router.delete('impid/:imp_uid', authChk, controller.deleteOrderImpUid)
router.get('impid/:imp_uid', authChk, controller.getOrderImpUid)


/** @api {get} /order/:order_key 주문정보 조회
 * 
 * @apiName getOneOrder
 * @apiGroup order
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *    Order
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
router.get('/:order_key', controller.getOneOrder)

/**
 * @api {delete} /order/:order_key 임시결제 삭제
 * @apiParam {Number} order_key order 키
 * @apiName deleteOrder
 * @apiGroup order
 *
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {"result": "done"}
 *
 * @apiError Bad Request 잘못된 요청
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "errorCode": -2,
 *       "data": "ERROR_INVALID_PARAM"
 *     }
 * 
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *     }
 */
router.delete('/:order_key', authChk, controller.deleteOrder)

// router.get('/', controller.getList)

/**
 * 아임포트 훅
 */
router.post('/import', controller.importHook)

/**
 * @api {put} /order/confirm/:order_key 결제 검증
 * @apiParam {Number} order_key order 키
 * @apiParam {String} imp_uid imp_uid
 * @apiName putOrder
 * @apiGroup order
 *
 * @apiParam {String} imp_uid 검증받을 ipm uid
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
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
router.put('/confirm/:order_key', controller.confirmOrder)

/**
 * @deprecated 별도의 수정은 없도록
 * 
 * @api {put} /order/:order_key 주문 수정
 * @apiParam {Number} order_key order 키
 * @apiName putOrder
 * @apiGroup order
 *
 * @apiParam {String} status 주문상태
 * @apiParam {Json} extra json타입의 부가데이터 (optional)
 * 
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
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
router.put('/:order_key', adminChk, controller.putOrder)

/**
 * @api {get} /order/user/:user_key 유저의 주문 리스트
 * @apiParam {string} user_key 유저키
 * @apiName getOneByUser
 * @apiGroup order
 *
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
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
router.get('/user/:user_key', controller.getOneByUser)

/**
 * @api {post} /order/:type 주문 생성
 * @apiParam {string} type 타입[order, refund]
 * @apiName postOrder
 * @apiGroup order
 *
 * @apiParam {Number} user_key 회원키
 * @apiParam {Number} wekin_key 위킨키
 * @apiParam {Numbern} amount 구매 갯수
 * @apiParam {Jso} extra 추가데이터
 * 
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
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
router.post('/:type', controller.postOrder)

/**
 * @api {get} /order/:type/:wekin_key 해당하는 타입 주문 리스트
 * @apiParam {string} type 타입[order, refund]
 * @apiParam {number} wekin_key 해당 위킨 키
 * @apiName getOrderByWekin
 * @apiGroup order
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *  [
 *   {
 *       "order_key": 1,
 *       "order_id": "4dc051f3-82b9-42f5-bb13-d2e39417c9e2",
 *       "user_key": 0,
 *       "wekin_key": 1,
 *       "status": 1,
 *       "price": 30000,
 *       "amount": 2,
 *       "created_at": "2017-06-14T15:04:20.626Z",
 *       "updated_at": "2017-06-14T15:04:20.626Z",
 *       "deleted_at": null,
 *       "Wekin": {
 *           "wekin_key": 1,
 *           "activity_key": 3,
 *           "min_user": 5,
 *           "max_user": 30,
 *           "current_user": 7,
 *           "start_date": "2017-05-09T15:00:00.000Z",
 *           "end_date": "2017-05-19T15:00:00.000Z"
 *       }
 *   },
 *   {
 *       "order_key": 2,
 *       "order_id": "1cc37cf5-9a63-44ba-a840-232fbe7ba187",
 *       "user_key": 0,
 *       "wekin_key": 1,
 *       "status": 1,
 *       "price": 30000,
 *       "amount": 2,
 *       "created_at": "2017-06-14T15:12:05.257Z",
 *       "updated_at": "2017-06-14T15:12:05.257Z",
 *       "deleted_at": null,
 *       "Wekin": {
 *           "wekin_key": 1,
 *           "activity_key": 3,
 *           "min_user": 5,
 *           "max_user": 30,
 *           "current_user": 7,
 *           "start_date": "2017-05-09T15:00:00.000Z",
 *           "end_date": "2017-05-19T15:00:00.000Z"
 *       }
 *   }
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
router.get('/:type/:wekin_key', controller.getOrderByWekin)







module.exports = router
