const express = require('express')
const model = require('../../../model')
const router = express.Router()
const { authChk } = require('../service')
const fireHelper = require('../../../util/firebase')

let getUserByToken = (req) => {
  return new Promise((resolve, reject) => {
    fireHelper.verifyFireToken(req.headers['x-access-token'])
      .then(token => model.User.findOne({ where: { uuid: token.uid }}, {include: {model: model.Host}}))
      .then(resolve).catch(reject)
  })
}

router.post('/create',
  function (req, res, next) {
    console.log(req.body)
    // 헤더에 있는 토큰으로 어드민 유저인지 판단 후 
    // TODO 어드민 유저라면 적립 승인
    getUserByToken(req).then( user => { console.log("야호" + user) } )
    // 어드민 유저라면 날라오는 유저키를 이용해서 포인트 적립
    model.Point.create({
      user_key: req.body.user_key,
      point_change: req.body.value,
      due_date_be_written_days: req.body.due_date,
      point_use_percentage: req.body.percentage
    }).then( Point => {
      res.send('success')
    }).catch(err => {
      next(err) 
    })
})

module.exports = router
