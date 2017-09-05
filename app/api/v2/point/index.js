const express = require('express')
const sequelize = require('sequelize')
const model = require('./../../../model')
const { authChk } = require('../service')
const fireHelper = require('../../../util/firebase')
const moment = require('moment')

const router = express.Router()

// TODO: 에러처리 해야함 에러 났을때 기존 만든 모든 객체 삭제해야함

/*
 Point type = {
 0: 일반포인트,
 1: 기업포인트,
 10: 일반 적립포인트 내역,
 11: 일반 사용포인트 내역,
 12: 일반 포인트 유효기간 만료 내역,
 20: 기업 적립포인트 내역,
 21: 기업 사용포인트 내역,
 22: 기업 포인트 유효기간 만료 내역
 }
 */

let getUserByToken = (req) => {
  return new Promise((resolve, reject) => {
    fireHelper.verifyFireToken(req.headers['x-access-token'])
      .then(token => { 
        model.User.findOne({ where: { uuid: token.uid }}, {include: {model: model.Host}})
          .then(resolve)
          .catch(reject)
      })
      .catch(reject)
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
          due_date_be_written_days: moment().add(req.body.due_date, 'M').format(),
          point_use_percentage: req.body.percentage,
          type: req.body.type
        })
          .then( point => {
            model.User.findById(point.user_key)
              .then( user => {
                if (req.body.type === '1') {
                  user.set("point.point_special", user.point.point_special + point.point_change)
                  user.save()
                  model.Point.create({
                    user_key: req.body.user_key,
                    point_change: req.body.value,
                    due_date_be_written_days: moment().format(),
                    point_use_percentage: req.body.percentage,
                    type: 20
                  })
                  res.send('success')
                } else if (req.body.type === '0') {
                  user.set("point.point", user.point.point + point.point_change)
                  user.save()
                  console.log(req.body.value)
                  model.Point.create({
                    user_key: req.body.user_key,
                    point_change: req.body.value,
                    due_date_be_written_days: moment().format(),
                    point_use_percentage: req.body.percentage,
                    type: 10
                  })
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
        model.Point.findOne({
          where: {
            type: 20,
            user_key: user.user_key
          },
          order: [['created_at', 'DESC']],
          limit: 1
        })
          .then( point => {
            let result = {}
            if (point == null) {
              result.point = user.point
              res.send(JSON.stringify(result))
              return
            }
            result.point = user.point
            result.percentage = point.point_use_percentage
            res.send(JSON.stringify(result))
          })
          .catch( err => {
            next(err)
          })
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
        if (req.body.type === '1') {
          if (user.point.point_special < -1 * req.body.value) {
            let err = "User's point_special is not enough"
            next(err)
            return
          }
          // 포인트 사용할때 유저의 포인트를 먼저 깎고 적립된 포인트를 전부 가져와서 하나씩 지워나가면서 
          user.set("point.point_special", Number(user.point.point_special) + Number(req.body.value))
          user.save()
          model.Point.findAll({
            where: {
              type: 1,
              user_key: user.user_key,
              point_change: { $gt: 0 }
            },
            order: [['created_at', 'ASC']]
          })
            .then( points => {
              let usePoint = Number(req.body.value)
              let point_use_percentage = 0
              let due_date_be_written_days = 0
              for (let i = 0; i < points.length; i++) {
                if (usePoint < 0) {
                  point_use_percentage = points[i].point_use_percentage
                  due_date_be_written_days = points[i].due_date_be_written_days
                  let created_at = points[i].created_at
                  usePoint += Number(points[i].point_change)
                  points[i].destroy()
                  if (usePoint > 0) {
                    model.Point.create({
                      user_key: user.user_key,
                      point_change: usePoint,
                      due_date_be_written_days: due_date_be_written_days,
                      point_use_percentage: point_use_percentage,
                      type: req.body.type,
                      created_at: created_at
                    })
                      .then( point => {
                        model.Point.create({
                          user_key: user.user_key,
                          point_change: req.body.value,
                          due_date_be_written_days: due_date_be_written_days,
                          point_use_percentage: point_use_percentage,
                          type: 21
                        })
                        res.send("success")
                      })
                      .catch(err => {
                        next(err)
                      })
                  }
                } 
              }
            })
            .catch(err => {
              next(err)
            })
        } else if (req.body.type === '0') {
          if (user.point.point < -1 * req.body.value) {
            let err = "User's point is not enough"
            next(err)
            return
          }
          user.set("point.point", Number(user.point.point) + Number(req.body.value))
          user.save()
          model.Point.findAll({
            where: {
              type: 0,
              user_key: user.user_key,
              point_change: { $gt: 0 }
            },
            order: [['created_at', 'ASC']]
          })
            .then( points => {
              let usePoint = Number(req.body.value)
              let point_use_percentage = 0
              let due_date_be_written_days = 0
              for (let i = 0; i < points.length; i++) {
                if (usePoint < 0) {
                  point_use_percentage = points[i].point_use_percentage
                  due_date_be_written_days = points[i].due_date_be_written_days
                  let created_at = points[i].created_at
                  usePoint += Number(points[i].point_change)
                  points[i].destroy()
                  if (usePoint > 0) {
                    model.Point.create({
                      user_key: user.user_key,
                      point_change: usePoint,
                      due_date_be_written_days: due_date_be_written_days,
                      point_use_percentage: point_use_percentage,
                      type: req.body.type,
                      created_at: created_at
                    })
                      .then( point => {
                        model.Point.create({
                          user_key: user.user_key,
                          point_change: req.body.value,
                          due_date_be_written_days: due_date_be_written_days,
                          point_use_percentage: point_use_percentage,
                          type: 11
                        })
                        res.send("success")
                      })
                      .catch(err => {
                        next(err)
                      })
                  }
                } 
              }
            })
            .catch(err => {
              next(err)
            })
        } else {
          res.send("fail")
        }
      })
      .catch(err => {
        next(err)
      })
  })


router.get('/detail/:user_key/:month', 
  function (req, res, next) {
    // 포인트 변동내역을 반환해야한다.
    // 기간 1달, 최대 3달 까지의 내역을 반환한다.
    // 유저키만 입력하면 누구든지 볼 수 있다.
    function getDate (month) {
      // 현재보다 파마미터의 값만큼 적은 달의 Date를 반환한다.
      let date = new Date()
      date.setMonth(date.getMonth() - month)      
      return date
    }
    model.Point.findAll({
      where: {
        user_key: req.params.user_key,
        created_at: { $gt: getDate(req.params.month) },
        type: { $in: [10, 11, 20, 21] },
      },
      attributes: [ 'user_key', 'type', 'point_change', 'created_at' ]
    })
    .then( points => {
      res.json(points)
    })
    .catch( err => {
      next(err)
    })
  })

module.exports = router
