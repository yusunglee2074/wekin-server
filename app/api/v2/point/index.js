const express = require('express')
const sequelize = require('sequelize')
const model = require('./../../../model')
const { authChk } = require('../service')
const fireHelper = require('../../../util/firebase')
const moment = require('moment')
const Model = require('./../../../model')

const router = express.Router()

// TODO: 에러처리 해야함 에러 났을때 기존 만든 모든 객체 삭제해야함
// TODO: 모든 처리 Transaction 처리해야함

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

/** @api {post} /point/create [어드민]포인스 생성
 * @apiParam {Number} user_key userkey
 * @apiParam {Number} value 포인트 변화량 양수음수
 * @apiParam {String} due_date 유효기간 StringDate
 * @apiParam {Number} type 타입(기업포인트, 일반포인트)
 * 
 * @apiName createPoint
 * @apiGroup point
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *     "message": "success",
 * }
 */
router.post('/create',
  function (req, res, next) {
   // 헤더에 있는 토큰으로 어드민 유저인지 판단 후 
    getUserByToken(req)
      .then(user => {
        // 어드민 유저라면 날라오는 유저키를 이용해서 포인트 적립
        // TODO: admin 유저인가? 판단해야함
        return Model.sequelize.transaction( t => {
          return model.Point.create({
            user_key: req.body.user_key,
            point_change: req.body.value,
            due_date_be_written_days: moment(req.body.due_date),
            type: req.body.type
          }, { transaction: t })
            .then(point => {
              return Promise.all([point, model.User.findOne({
                where: {
                  user_key: req.body.user_key,
                },
                transaction: t
              })
              ])
            })
            .then(result => {
              if (req.body.type == 1) {
                return result[1].updateAttributes({ "point.point_special": result[1].point.point_special + result[0].point_change }, { transaction: t } )
              } else if (req.body.type == 0) {
                return result[1].updateAttributes({ "point.point": result[1].point.point + result[0].point_change }, { transaction: t } )
              } else {
                throw new Error()
              }
            })
            .then(result => {
              if (req.body.type == 1) {
                return model.Point.create({
                  user_key: req.body.user_key,
                  point_change: req.body.value,
                  due_date_be_written_days: moment(req.body.due_date),
                  type: 20
                },
                  { transaction: t }
                )
              } else if (req.body.type == 0) {
                return model.Point.create({
                  user_key: req.body.user_key,
                  point_change: req.body.value,
                  due_date_be_written_days: moment(req.body.due_date),
                  type: 10
                },
                  { transaction: t }
                )
              } else {
                throw new Error()
              }
            })
        })
      })
      .then(result => res.json({ message: 'success' }))
      .catch(err => next(err) )
  })

/** @api {get} /point/refund/:order_key 포인트 환불
 * @apiParam {Number} order_key orderkey
 * 
 * @apiName refundPoint
 * @apiGroup point
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *     "point": {
 *         "point": 0,
 *         "point_special": 0,
 *         "percentage": 100
 *     }
 * }
 */
router.post('/refund/:order_key',
  function (req, res, next) {
    let refundPointAmount = req.body.refundAmount
    let refundPointDueDate
    model.Order.findOne({ 
      where: { 
        order_key: 661 
      }, include: [{ 
        model: model.WekinNew, 
        include: [{
          model: model.Point,
          where: {
            type: {
              $in: [21, 11]
            }
          }
        }, {
          model: model.User
        }] 
      }] 
    })
      .then(order => {
        // 포인트 재적립 해줘야 한다.
        // 1. 유저 포인트 변동해주기, 2. 포인트 객체 생성하기, 포인트 로깅하기
        let promiseList = []
        model.User.findOne({ where: { user_key: order.WekinNew.User.user_key } })
          .then(user => {
            if (order.WekinNew.Point.type === 11) {
              user.set("point.point", Number(user.point.point) + Number(refundPointAmount))
            } else {
              user.set("point.point_special", Number(user.point.point_special) + Number(refundPointAmount))
            }
            promiseList.push(model.Point.create({
              user_key: order.WekinNew.User.user_key,
              point_change: refundPointAmount,
              due_date_be_written_days: order.WekinNew.Point.due_date_be_written_days,
              type: order.WekinNew.Point.type === 11 ? 0 : 1
            }))
            promiseList.push(model.Point.create({
              user_key: order.WekinNew.User.user_key,
              point_change: refundPointAmount,
              due_date_be_written_days: order.WekinNew.Point.due_date_be_written_days,
              type: order.WekinNew.Point.type === 11 ? 10 : 20
            }))
            promiseList.push(user.save())
            return Promise.all(promiseList)
          })
          .then(result => {
            console.log('하핫#################')
            res.json({ message: 'success', data: null })
          })
          .catch(error => next(error))
      })
  })

/** @api {get} /point/create 포인트 조회
 * @apiParam {Number} user_key userkey
 * 
 * @apiName getPoint
 * @apiGroup point
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *     "point": {
 *         "point": 0,
 *         "point_special": 0,
 *         "percentage": 100
 *     }
 * }
 */
router.get('/front/:user_key',
  function (req, res, next) {
    // 주소의 파라미터로 유저를 가져온다. 
    model.User.findOne({ where: { user_key: 37 } })
      .then(user => {
        model.Point.findOne({
          where: {
            type: 20,
            user_key: user.user_key
          },
          order: [['created_at', 'DESC']],
          limit: 1
        })
          .then(point => {
            let result = {}
            if (point == null) {
              result.point = user.point
              res.json(result)
              return
            }
            result.point = user.point
            res.json(result)
          })
          .catch( err => {
            next(err)
          })
      })
      .catch( err => {
        next(err)
      })
  })

/** @api {post} /point/front/use 포인트 사용
 * @apiParam {Number} value 포인트 변화량 양수음수
 * @apiParam {Number} type 타입(기업포인트, 일반포인트)
 * @apiName usePoint
 * @apiGroup point
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *     "point": {
 *         "point": 0,
 *         "point_special": 0,
 *         "percentage": 100
 *     }
 * }
 */
router.post('/front/use', 
  function (req, res, next) {
    // 사용할 유저의 정보를 헤더의 토큰을 통해서 가져온다.
    getUserByToken(req)
      .then(user => {
        if (req.body.type === '1') {
          if (user.point.point_special < -1 * req.body.value) {
            let err = "User's point_special is not enough"
            next(err)
            return
          }
          // 포인트 사용할때 유저의 포인트를 먼저 깎고 적립된 포인트를 전부 가져와서 하나씩 지워나가면서 
          user.set("point.point_special", Number(user.point.point_special) + Number(req.body.value))
          model.Point.findAll({
            where: {
              type: 1,
              user_key: user.user_key,
              point_change: { $gt: 0 }
            },
            order: [['created_at', 'ASC']]
          })
            .then(points => {
              let usePoint = Number(req.body.value)
              let due_date_be_written_days = 0
              return Model.sequelize.transaction( t => {
                let promises = []
                for (let i = 0; i < points.length; i++) {
                  if (usePoint < 0) {
                    due_date_be_written_days = points[i].due_date_be_written_days
                    let created_at = points[i].created_at
                    usePoint += Number(points[i].point_change)
                    points[i].destroy()
                    if (usePoint > 0) {
                      promises.push(
                        model.Point.create({
                          user_key: user.user_key,
                          point_change: usePoint,
                          due_date_be_written_days: due_date_be_written_days,
                          type: req.body.type,
                          created_at: created_at,
                          wekin_key: req.body.wekin_key || null
                        }, { transaction: t })
                      )
                      promises.push(
                        model.Point.create({
                          user_key: user.user_key,
                          point_change: req.body.value,
                          due_date_be_written_days: due_date_be_written_days,
                          wekin_key: req.body.wekin_key || null,
                          type: 21
                        }, { transaction: t })
                      )
                    }
                  } 
                }
                return Promise.all(promises) })
                .then( results => {
                  user.save()
                  res.send("success")
                })
                .catch(err => {
                  next(err)
                })
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
          model.Point.findAll({
            where: {
              type: 0,
              user_key: user.user_key,
              point_change: { $gt: 0 }
            },
            order: [['created_at', 'ASC']]
          })
            .then(points => {
              let usePoint = Number(req.body.value)
              let due_date_be_written_days = 0
              return Model.sequelize.transaction( t => {
                let promises = []
                for (let i = 0; i < points.length; i++) {
                  if (usePoint < 0) {
                    due_date_be_written_days = points[i].due_date_be_written_days
                    let created_at = points[i].created_at
                    usePoint += Number(points[i].point_change)
                    points[i].destroy()
                    if (usePoint > 0) {
                      promises.push(model.Point.create({
                        user_key: user.user_key,
                        point_change: usePoint,
                        due_date_be_written_days: due_date_be_written_days,
                        type: req.body.type,
                        created_at: created_at,
                        wekin_key: req.body.wekin_key || null
                      }))
                      promises.push(model.WekinNew.update({ point: -1 * req.body.value }, { where: { wekin_key: req.body.wekin_key } }))
                      promises.push(model.Order.update({ order_method: 'point' }, { where: { wekin_key: req.body.wekin_key, status: 'paid' } }))
                      promises.push(model.Point.create({
                        user_key: user.user_key,
                        point_change: req.body.value,
                        due_date_be_written_days: due_date_be_written_days,
                        type: 11,
                        wekin_key: req.body.wekin_key || null
                      }))
                    }
                  } 
                }
                return Promise.all(promises) 
              })
                .then( results => {
                  user.save()
                  res.send("success")
                })
                .catch(err => {
                  next(err)
                })
            })
        } else {
          next("쏴주신 body.type :" + req.body.type + "'0' or '1'로 주세요")
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
      include: [
        { model: model.WekinNew, include: [{ model: model.ActivityNew, attributes: ['title'] }], attributes: ['wekin_key'] }
      ],
      attributes: [ 'user_key', 'type', 'point_change', 'created_at', 'due_date_be_written_days' ]
    })
    .then( points => {
      res.json(points)
    })
    .catch( err => {
      next(err)
    })
  })

module.exports = router
