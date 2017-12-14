const express = require('express')
const router = express.Router()
const { authChk } = require('../service')
const model = require('./../../../model')

const controller = require('./controller')

/** @api {get} /user/ 전체 유저 
 * 
 * @apiName getList
 * @apiGroup user 
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *     {{ user DATA }}, ...
 * }
 */
router.get('/', controller.getList)

/** @api {get} /user/email/:email 이메일 가입한 유저 존재유무
 * 
 * @apiName existwithEmail
 * @apiGroup user 
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *    message: 'notExist' or 'exist'
 * }
 */
router.get('/email/:email', 
  function (req, res, next) {
    model.User.findOne({ where: { email: req.params.email } })
      .then(result => {
        if (result === null) {
          res.json({ message: 'notExist' })
        } else {
          res.json({ message: 'exist' })
        }
      })
      .catch(err => next(err))
})

/** @api {get} /user/:user_key 유저 디테일
 * 
 * @apiName getOne 
 * @apiGroup user 
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *     "user_key": 37,
 *     "uuid": "8pPmvczfckWMIaJfou8KLO7xxOj2",
 *     "profile_image": "https://firebasestorage.googleapis.com/v0/b/wekin-9111d.appspot.com/o/img%2Fimage730%2F2017%2F7%2F20%2F21323.png?alt=media",
 *     "name": "유니",
 *     "gender": 1,
 *     "introduce": null,
 *     "email": "cheyja@naver.com",
 *     "email_valid": true,
 *     "email_noti": null,
 *     "sms_noti": true,
 *     "push_noti": true,
 *     "phone": "01093666639",
 *     "phone_valid": false,
 *     "notification": null,
 *     "last_login_date": "2017-06-29T06:06:12.000Z",
 *     "point": {
 *         "point": 2000,
 *         "point_special": 0,
 *         "percentage": 100
 *     },
 *     "birthday": null,
 *     "email_company": null,
 *     "email_company_valid": false,
 *     "country": "Korea",
 *     "work_balance_point": 0,
 *     "work_balance_point_history": [],
 *     "created_at": "2017-06-29T06:06:12.488Z",
 *     "updated_at": "2017-12-06T08:56:03.000Z",
 *     "deleted_at": null
 * }
 */
router.get('/:user_key', controller.getOne)

/** @api {delete} /user/ 유저삭제
 * 
 * @apiName withdraw
 * @apiGroup user 
 * @apiParam {Number} user_key 삭제할 유저키 
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *     "user_key": 37,
 *     "uuid": "8pPmvczfckWMIaJfou8KLO7xxOj2",
 *     "profile_image": "https://firebasestorage.googleapis.com/v0/b/wekin-9111d.appspot.com/o/img%2Fimage730%2F2017%2F7%2F20%2F21323.png?alt=media",
 *     "name": "유니",
 *     "gender": 1,
 *     "introduce": null,
 *     "email": "cheyja@naver.com",
 *     "email_valid": true,
 *     "email_noti": null,
 *     "sms_noti": true,
 *     "push_noti": true,
 *     "phone": "01093666639",
 *     "phone_valid": false,
 *     "notification": null,
 *     "last_login_date": "2017-06-29T06:06:12.000Z",
 *     "point": {
 *         "point": 2000,
 *         "point_special": 0,
 *         "percentage": 100
 *     },
 *     "birthday": null,
 *     "email_company": null,
 *     "email_company_valid": false,
 *     "country": "Korea",
 *     "work_balance_point": 0,
 *     "work_balance_point_history": [],
 *     "created_at": "2017-06-29T06:06:12.488Z",
 *     "updated_at": "2017-12-06T08:56:03.000Z",
 *     "deleted_at": null
 * }
 */
router.delete('/', controller.withdraw)

/** @api {post} /user/front/join 이메일 유저가입
 * 
 * @apiName createUser
 * @apiGroup user 
 * @apiParam {Object} user_object {
 *           email: 이메일,
 *           email_company: 회사이메일 || null,
 *           email_company_valid: true or false,
 *           birthday: { year(Number), month, day },
 *           gender: 0(남자), 1(여자),
 *           phone: 폰번,
 *           displayName: 닉네임,
 *           photo: 프로필이미지,
 *           country: 국가 || 'Korea'
 *           }
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *     "user_key": 37,
 *     "uuid": "8pPmvczfckWMIaJfou8KLO7xxOj2",
 *     "profile_image": "https://firebasestorage.googleapis.com/v0/b/wekin-9111d.appspot.com/o/img%2Fimage730%2F2017%2F7%2F20%2F21323.png?alt=media",
 *     "name": "유니",
 *     "gender": 1,
 *     "introduce": null,
 *     "email": "cheyja@naver.com",
 *     "email_valid": true,
 *     "email_noti": null,
 *     "sms_noti": true,
 *     "push_noti": true,
 *     "phone": "01093666639",
 *     "phone_valid": false,
 *     "notification": null,
 *     "last_login_date": "2017-06-29T06:06:12.000Z",
 *     "point": {
 *         "point": 2000,
 *         "point_special": 0,
 *         "percentage": 100
 *     },
 *     "birthday": null,
 *     "email_company": null,
 *     "email_company_valid": false,
 *     "country": "Korea",
 *     "work_balance_point": 0,
 *     "work_balance_point_history": [],
 *     "created_at": "2017-06-29T06:06:12.488Z",
 *     "updated_at": "2017-12-06T08:56:03.000Z",
 *     "deleted_at": null
 * }
 */
router.post('/front/join', controller.createUser)

router.get('/front/list', controller.getFrontList)
router.post('/front/signUp', controller.getFrontSignUp)

/** @api {get} /user/front/signUp/kakao/:code/:type SNS토큰 발급, 소셜유저정보
 * 
 * @apiName kakaoLogin
 * @apiGroup user 
 * @apiParam {String} code 소셜accessToken
 * @apiParam {Number} type Naver or Kakao
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *     customToken: 129083712893y12893h12893h128gbf937,
 *     userInfo: {{ 소셜별 유저인포 }}
 * }
 */
router.get('/front/signUp/kakao/:code/:type', controller.kakaoLogin)

/** @api {post} /user/front/signUp/dbCreateWithIdtoken 파배Id토큰으로 DB생성
 * 
 * @apiName dbCreateWithIdtoken
 * @apiGroup user 
 * @apiParam {String} idToken 셜accessToken
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *     {{ 파이어베이스 유저인포 }}
 * }
 */
router.post('/front/signUp/dbCreateWithIdtoken', controller.dbCreateWithIdtoken)
/** @api {post} /user/front/signUp/dbCreateWithIdtoken 파배Id토큰으로 DB생성
 * 
 * @apiName dbCreateWithIdtoken
 * @apiGroup user 
 * @apiParam {String} idToken 셜accessToken
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *     {{ 파이어베이스 유저인포 }}
 * }
 */
router.post('/front/createCustomToken', controller.createCustomToken)
router.post('/front/signUpWithCustomToken', controller.signUpWithCustomToken)
router.get('/check/email', controller.isThereAnyEmailAddress)

/** @api {get} /user/front/verify 엑세스토큰->DB유저정보
 * 
 * @apiName verify
 * @apiGroup user 
 * @apiParam {String} accessToken [header]엑세스 토큰
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *     "user_key": 37,
 *     "uuid": "8pPmvczfckWMIaJfou8KLO7xxOj2",
 *     "profile_image": "https://firebasestorage.googleapis.com/v0/b/wekin-9111d.appspot.com/o/img%2Fimage730%2F2017%2F7%2F20%2F21323.png?alt=media",
 *     "name": "유니",
 *     "gender": 1,
 *     "introduce": null,
 *     "email": "cheyja@naver.com",
 *     "email_valid": true,
 *     "email_noti": null,
 *     "sms_noti": true,
 *     "push_noti": true,
 *     "phone": "01093666639",
 *     "phone_valid": false,
 *     "notification": null,
 *     "last_login_date": "2017-06-29T06:06:12.000Z",
 *     "point": {
 *         "point": 2000,
 *         "point_special": 0,
 *         "percentage": 100
 *     },
 *     "birthday": null,
 *     "email_company": null,
 *     "email_company_valid": false,
 *     "country": "Korea",
 *     "work_balance_point": 0,
 *     "work_balance_point_history": [],
 *     "created_at": "2017-06-29T06:06:12.488Z",
 *     "updated_at": "2017-12-06T08:56:03.000Z",
 *     "deleted_at": null
 * }
 */
router.get('/front/verify', authChk, controller.verify)

/** @api {put} /user/front/verify/phone 임시저장 인증번호 체크
 * 
 * @apiName verifyPhone
 * @apiGroup user 
 * @apiParam {Number} phoneNumber 폰번
 * @apiParam {Number} verifyCode 인증번호
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *   success: 'success' or 'fail'
 * }
 */
router.put('/front/verify/phone', controller.verifyPhone)

/** @api {post} /user/front/verify/phone 핸드폰 인증번호 전송
 * 
 * @apiName postVerifyPhone
 * @apiGroup user 
 * @apiParam {Number} phoneNumber 폰번
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *   success: 'success' or 'fail'
 * }
 */
router.post('/front/verify/phone', controller.postVerifyPhone)

router.post('/front', controller.postFrotUser)

/** @api {get} /user/front/:user_key 유저디테일
 * 
 * @apiName getFrontUserInfo
 * @apiGroup user 
 * @apiParam {Number} user_key 유저키
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *     "user_key": 37,
 *     "uuid": "8pPmvczfckWMIaJfou8KLO7xxOj2",
 *     "profile_image": "https://firebasestorage.googleapis.com/v0/b/wekin-9111d.appspot.com/o/img%2Fimage730%2F2017%2F7%2F20%2F21323.png?alt=media",
 *     "name": "유니",
 *     "gender": 1,
 *     "introduce": null,
 *     "email": "cheyja@naver.com",
 *     "email_valid": true,
 *     "email_noti": null,
 *     "sms_noti": true,
 *     "push_noti": true,
 *     "phone": "01093666639",
 *     "phone_valid": false,
 *     "notification": null,
 *     "last_login_date": "2017-06-29T06:06:12.000Z",
 *     "point": {
 *         "point": 2000,
 *         "point_special": 0,
 *         "percentage": 100
 *     },
 *     "birthday": null,
 *     "email_company": null,
 *     "email_company_valid": false,
 *     "country": "Korea",
 *     "work_balance_point": 0,
 *     "work_balance_point_history": [],
 *     "created_at": "2017-06-29T06:06:12.488Z",
 *     "updated_at": "2017-12-06T08:56:03.000Z",
 *     "deleted_at": null
 * }
 */
router.get('/front/:user_key', controller.getFrontUserInfo)

/** @api {put} /user/front/:user_key 유저 프로필 업뎃
 * 
 * @apiName putFrontUserInfo
 * @apiGroup user 
 * @apiParam {Number} user_key 유저키
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *   'success'
 * }
 */
router.put('/front/:user_key', controller.putFrontUserInfo)

router.get('/front/:user_key/activity', controller.getUsersActiviry)

/** @api {get} /user/front/:user_key/qna 유저의 qna를 가져옴
 * 
 * @apiName putFrontUserInfo
 * @apiGroup user 
 * @apiParam {Number} user_key 유저키
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * [
 *    {{ USER QNAS }}
 * ]
 */
router.get('/front/:user_key/qna', controller.getUsersQna)

module.exports = router
