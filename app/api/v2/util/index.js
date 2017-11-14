const express = require('express')
const router = express.Router()
const model = require('./../../../model')

const controller = require('./controller')

/** @api {post} /util/mail/ 메일 전송
 * @apiParam {String} target 대상 이메일
 * @apiParam {String} title 제목
 * @apiParam {String} message 이메일 내용
 * 
 * @apiName sendMail
 * @apiGroup util
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * 
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
router.post('/mail', controller.sendMail)

/** @api {post} /util/sms/ 문자 전송
 * @apiParam {String} target 대상번호 (010-1111-2222)
 * @apiParam {String} message 내용
 * 
 * @apiName sendSms
 * @apiGroup util
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * 
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
router.post('/sms', controller.sendSms)


router.post('/join/sms', controller.joinSms)

router.post('/join/mail', controller.joinMail)

router.post('/wekin', controller.confirmWekin)

router.get('/share/doc/:doc_key', 
  function (req, res, next) {
    // 엑티비티 공유를 위한 정보 가져온다.
    model.Doc.findOne({
      where: {
        doc_key: req.params.doc_key
      }
    })
    .then(activity => {
      res.send(activity)
    })
  }
)

router.get('/share/:activity_key', 
  function (req, res, next) {
    // 엑티비티 공유를 위한 정보 가져온다.
    model.ActivityNew.findOne({
      where: {
        activity_key: req.params.activity_key
      },
      attributes: [ 'title', 'detail_question', 'main_image' ]
    })
    .then(activity => {
      res.send(activity)
    })
  }
)

module.exports = router
