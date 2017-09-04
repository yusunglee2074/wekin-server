const express = require('express')
const router = express.Router()
const { authChk } = require('../service')

const controller = require('./controller')

/**
 * @api {get} /user 유저 리스트
 * @apiName getList
 * @apiGroup user
 *
 * @apiSuccessExample 성공시:
 *     HTTP/1.1 200 OK
 * 
 * @apiError Bad Request 잘못된 요청
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 ServerError
 */
router.get('/', controller.getList)

/**
 * @api {get} /user/:user_key 사용자 조회
 * @apiParam {Number} user_key 사용자키
 * @apiName getUserData
 * @apiGroup user
 *
 * @apiSuccessExample 성공시:
 *     HTTP/1.1 200 OK
 * 
 * @apiError Bad Request 잘못된 요청
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 ServerError
 */
router.get('/:user_key', controller.getOne)

/**
 * @api {delete} /user/ 회원 탈퇴
 * @apiName withdraw
 * @apiGroup user
 *
 * @apiSuccessExample 성공시:
 *     HTTP/1.1 200 OK
 * {
 *  result: true
 * }
 * 
 * @apiError Bad Request 이미 삭제된 회원에 대한 요청
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 ServerError
 * 
 * {
 *   "errorCode": -2,
 *   "data": {
 *       "result": false,
 *       "msg": "already deleted"
 *   }
 * }
 * 
 */
router.delete('/', controller.withdraw)

router.post('/front/join', controller.createUser)
router.get('/front/list', controller.getFrontList)
router.post('/front/signUp', controller.getFrontSignUp)
router.post('/front/createCustomToken', controller.createCustomToken)
router.post('/front/signUpWithCustomToken', controller.signUpWithCustomToken)
router.get('/front/verify', authChk, controller.verify)
router.put('/front/verify/phone', authChk, controller.verifyPhone)
router.post('/front/verify/phone', controller.postVerifyPhone)
router.post('/front', controller.postFrotUser)
router.get('/front/:user_key', controller.getFrontUserInfo)
router.put('/front/:user_key', authChk, controller.putFrontUserInfo)
router.get('/front/:user_key/activity', controller.getUsersActiviry)
router.get('/front/:user_key/qna', controller.getUsersQna)

module.exports = router