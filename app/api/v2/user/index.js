const express = require('express')
const router = express.Router()
const { authChk } = require('../service')
const model = require('./../../../model')

const controller = require('./controller')

router.get('/', controller.getList)
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

router.get('/:user_key', controller.getOne)

router.delete('/', controller.withdraw)

router.post('/front/join', controller.createUser)
router.get('/front/list', controller.getFrontList)
router.post('/front/signUp', controller.getFrontSignUp)
router.get('/front/signUp/kakao/:code/:type', controller.kakaoLogin)
router.post('/front/createCustomToken', controller.createCustomToken)
router.post('/front/signUpWithCustomToken', controller.signUpWithCustomToken)
router.get('/front/verify', authChk, controller.verify)
router.put('/front/verify/phone', controller.verifyPhone)
router.post('/front/verify/phone', controller.postVerifyPhone)
router.post('/front', controller.postFrotUser)
router.get('/front/:user_key', controller.getFrontUserInfo)
router.put('/front/:user_key', controller.putFrontUserInfo)
router.get('/front/:user_key/activity', controller.getUsersActiviry)
router.get('/front/:user_key/qna', controller.getUsersQna)
router.post('/front/signUp/dbCreateWithIdtoken', controller.dbCreateWithIdtoken)

module.exports = router
