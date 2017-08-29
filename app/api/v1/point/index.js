const express = require('express')
const sequelize = require('sequelize')
const model = require('../../../model')
const router = express.Router()
const { authChk } = require('../service')
const fireHelper = require('../../../util/firebase')

let getUserByToken = (req) => {
  return new Promise((resolve, reject) => {
    fireHelper.verifyFireToken(req.headers['x-access-token'])
      .then(token => { 
        model.User.findOne({ where: { uuid: token.uid }}, {include: {model: model.Host}})
          .then(resolve)
          .catch(reject)
      })
  })
}

router.post('/create',
  function (req, res, next) {
    // 헤더에 있는 토큰으로 어드민 유저인지 판단 후 
    getUserByToken(req)
      .then( user => {
        // 어드민 유저라면 날라오는 유저키를 이용해서 포인트 적립
        // TODO: admin 유저인가? 판단해야함
        model.Point.create({
          user_key: req.body.user_key,
          point_change: req.body.value,
          due_date_be_written_days: req.body.due_date,
          point_use_percentage: req.body.percentage,
          type: req.body.type
        })
          .then( point => {
            model.User.findById(point.user_key)
              .then( user => {
                if (req.body.type === '1') {
                  user.point.point_special += point.point_change
                  user.save()
                  res.send('success')
                } else if (req.body.type === '0') {
                  user.point.point += point.point_change
                  user.save()
                  res.send('success')
                } else {
                  res.send('fail')
                }
              })
              .catch( err => {
                next(err)
              })
          })
          .catch(err => {
            next(err) 
          })
      })
      .catch( err => { 
        next(err) 
      })
  })

router.get('/front/:user_key',
  function (req, res, next) {
    // 주소의 파라미터로 유저를 가져온다. 
    model.User.findById(req.params.user_key)
      .then( user => {
        res.send(JSON.stringify(user.point))
      })
      .catch( err => {
        next(err)
      })
  })

router.post('/front/use', 
  function (req, res, next) {
    // 사용할 유저의 정보를 헤더의 토큰을 통해서 가져온다.
    getUserByToken(req)
      .then( user => {
        // 유저의 포인트를 깎은 후 포인트 모델 오브젝트를 만든다.
        // 만약 스페셜 포인트이면 프론트 딴에서 포인트 조회와 같이 전달된 사용률을 이용해서 해당 금액만큼만 끊는다.
        // 밸류가 -이다.
        model.Point.create({
          user_key: user.user_key,
          point_change: req.body.value,
          due_date_be_written_days: -1,
          point_use_percentage: -1,
          type: req.body.type
        })
          .then( point => {
            if (req.body.type === '1') {
              user.point.point_special -= req.body.value
              user.save()
              res.send("success")
            } else if (req.body.type === '0') {
              user.point.point -= req.body.value
              user.save()
              res.send("success")
            } else {
              res.send("fail")
            }
          })
          .catch( err => {
            next(err)
          })
      })
      .catch(err => {
        next(err)
      })
  })

router.post('/delete', 
  function (req, res, next) {
    model.Point.create({
      user_key: req.body.user_key,
      point_change: req.body.value,
      due_date_be_written_days: -1,
      point_use_percentage: -1,
      type: req.body.type
    })
      .then( point => {
        model.User.findOne({ where: { user_key: req.body.user_key }})
          .then( user => {
            if (req.body.type === '1') {
              user.point.point_special -= req.body.value
              user.save()
              res.send("success")
            } else if (req.body.type === '0') {
              user.point.point -= req.body.value
              user.save()
              res.send("success")
            } else {
              point.destroy({ force: true })
                .then( () => {
                  res.send("fail")
                })
            }
          })
          .catch( err => {
            next(err)
          })
      })
      .catch( err => {
        next(err)
      })
  })

router.get('/detail/:user_key/:month', 
  function (req, res, next) {
    // 포인트 변동내역을 반환해야한다.
    // 기간 1달, 최대 3달 까지의 내역을 반환한다.
    // 유저키만 입력하면 누구든지 볼 수 있다.
    function getDate (month) {
      let date = new Date()
      date.setMonth(date.getMonth() - month)      
      return date
    }
    model.Point.findAll({
      where: {
        user_key: req.params.user_key,
        created_at: { $gt: getDate(req.params.month) }
      }
    })
    .then( points => {
      res.json(points)
    })
    .catch( err => {
      next(err)
    })
  })

router.get('/percentage/:user_key', 
  function (req, res, next) {
    model.Point.findOne({
      where: {
        user_key: req.params.user_key,
        type: 1,
        point_change: { $gt: 0 }
      },
      order: [[ 'created_at', 'DESC' ]]
    })
    .then( point => {
      if (point) {
        res.json(point)
      } else {
        res.send('존재 하지 않습니다.')
      }
    })
    .catch( err => {
      next(err)
    })
  })

module.exports = router
