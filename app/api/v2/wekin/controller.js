const model = require('../../../model')
const moment = require('moment')
const returnMsg = require('../../../return.msg')
const { wekinService, activityService, utilService } = require('../service')

exports.getFrontWekin = (req, res, next) => {
  model.Wekin.findAll()
  .then(results => res.json(results))
  .catch(err => next(err))
}

exports.postFrontWekin = (req, res, next) => {
  let options = req.fetchParameter(['title', 'maker'])
  if (req.checkParamErr(options)) return next(options)

  model.Wekin.create({
    title: options.title,
    maker: options.maker
  }).then(result => {
    res.json(result)
  }).catch(err => next(err))
}

exports.adjustCommission = (req, res) => {
  
  model.Wekin.update({
    commission: req.body.commission
  }, {
    where: { wekin_key: req.params.wekin_key }
  })
  .then(result => returnMsg.success200RetObj(res, result))
  .catch(val => {
    returnMsg.error400InvalidCall(res, val.code, val.msg)
  })
}

exports.putWekin = (req, res) => {
  
  model.Wekin.update({
    commission: req.body.commission,
    start_date: req.body.start_date,
    due_date: req.body.due_date,
    min_user: req.body.min_user,
    max_user: req.body.max_user,
  }, {
    where: { wekin_key: req.params.wekin_key }
  })
  .then(result => returnMsg.success200RetObj(res, result))
  .catch(val => {
    returnMsg.error400InvalidCall(res, val.code, val.msg)
  })
}

exports.getOneIncludeOrder = (req, res) => {
  
  model.Wekin.findOne({
    where: { wekin_key: req.params.key },
    include: [{ model: model.Activity, include: {model: model.Host} }, { model: model.Order}]
  })
  .then(result => returnMsg.success200RetObj(res, result))
  .catch(val => {
    returnMsg.error400InvalidCall(res, val.code, val.msg)
  })
} 

exports.getList = (req, res, next) => {
  model.WekinNew.findAll({
    include: [
      {
        model: model.ActivityNew,
        include: { model: model.Host },
      },
      { model: model.Order, where: { status: { $not: 'order' } } }],
    where: {
      user_key: req.params.user_key,
      state: {
        $notIn: ['booking']
      }
    },
    order: [['created_at', 'DESC']]
  })
  .then(result => 
    for (let i = 0, length = result.length; i < length; i++) {
      let item = result[i]
      item.start_time = moment(item.start_time).add(-9, 'hour')
    }
    res.json({ message: 'success', data: result }))
  .catch(val => next(val))
}

/*
exports.postWekin = (req, res) => {
  let user = req.user
  model.WekinNew.create({
    activity_key: req.body.activity_key,
    user_key: user.user_key,
  })
  .then(result => returnMsg.success200RetObj(res, result))
  .catch(val => {console.log(val)})
}

exports.getFinishList = (req, res) => {
  
  model.Wekin.findAll({
    where: {
      start_date: {$lt: new Date()}
    },
    include: [{
      model: model.Activity,
      include: { model: model.Host },
      where: {
        status: { $in: [3, 5] } }
    },
    { model: model.Order }]
  })
  .then(result => returnMsg.success200RetObj(res, result))
  .catch(val => {console.log(val)})
}
*/

// 리펙토링
// 신청하기 눌렀을떄 위킨 생성
// TODO: 로직 이상함 작동은 하나 코드가 비효율
exports.postWekin = (req, res, next) => {
  let data = req.body.params
  let cloneData = Object.assign({}, data)
  delete cloneData.finalPrice
  delete cloneData.selectedDate
  delete cloneData.activity_key
  let amount = 0
  for (i in data.selectedExtraOption) {
    amount += data.selectedExtraOption[i]
  }
  // event Activity List
  let eventAvtivityKeyList = [471]
  if (eventAvtivityKeyList.includes(data.activity_key)) {
    model.WekinNew.count({
      where: {
        activity_key: data.activity_key,
        user_key: req.user.user_key,
        state: {
          $in: ['paid', 'ready']
        }
      }
    })
      .then(number => {
        if (number > 0 || amount > 1) {
          res.json({ message: 'fail/Not possible to booking twice to eventActivity', data: null })
          throw Error
        } else {
          return model.WekinNew.count({
            where: {
              activity_key: data.activity_key,
              start_date: {
                $and: {
                  $lt: moment(data.selectedDate).set('hour', 23).set('minute', 59).set('second', 59),
                  $gt: moment(data.selectedDate).set('hour', 0).set('minute', 0).set('second', 0)
                }
              },
              state: {
                $in: ['booking', 'paid', 'ready']
              },
              start_time: {
                $and: {
                  $gt: moment('1991-04-12').set('hour', data.startTime[0].slice(0, 2)).set('minute', data.startTime[0].slice(3, 5)).add(-10, 'minutes'),
                  $lt: moment('1991-04-12').set('hour', data.startTime[0].slice(0, 2)).set('minute', data.startTime[0].slice(3, 5)).add(10, 'minutes')
                }
              }
            }
          })
        }
      })
      .then(count => {
        if (count + amount < data.max_user) {
          model.WekinNew.findOne({
            where: {
              user_key: req.user.user_key,
              activity_key: req.body.params.activity_key,
              state: 'booking'
            }
          })
            .then(wekin => {
             let tmpTime = moment('1991-04-12')
              if (wekin === null) {
                model.WekinNew.create({
                  activity_key: data.activity_key,
                  user_key: req.user.user_key,
                  final_price: data.finalPrice,
                  start_date: moment(data.selectedDate).format(),
                  start_time: tmpTime.set('hour', data.startTime[0].slice(0, 2)).set('minute', data.startTime[0].slice(3, 5)),
                  select_option: cloneData,
                  pay_amount: amount,
                  state: 'booking' 
                })
                  .then(result => res.json({ message: 'success', data: [0, [result]] }))
                  .catch(error => next(error))
              } else {
                let value = {}
                value.final_price = data.finalPrice
                value.start_date = moment(data.selectedDate).format()
                value.start_time = tmpTime.set('hour', data.startTime[0].slice(0, 2)).set('minute', data.startTime[0].slice(3, 5)),
                value.select_option = cloneData
                value.pay_amount = amount
                model.WekinNew.update(value, { where: { wekin_key: wekin.wekin_key }, returning: true })
                  .then(result => {
                    res.json({ message: 'success', data: result })
                  })
                  .catch(error => next(error))
              }
            })
            .catch(error => next(error))
        } else {
          res.json({ message: "error", data: "Already full in this date" })
        }
      })
      .catch(error => next(error))
    // 한 사람당 한 엑티비티에 대해서 하나의 북킹 위킨만 생성가능
  } else {
    console.log("여기들어옴")

    model.WekinNew.count({
      where: {
        activity_key: data.activity_key,
        start_date: {
          $and: {
            $lt: moment(data.selectedDate).set('hour', 23).set('minute', 59).set('second', 59),
            $gt: moment(data.selectedDate).set('hour', 0).set('minute', 0).set('second', 0)
          }
        },
        state: {
          $in: ['booking', 'paid', 'ready']
        },
        start_time: {
          $and: {
            $gt: moment('1991-04-12').set('hour', data.startTime[0].slice(0, 2)).set('minute', data.startTime[0].slice(3, 5)).add(-10, 'minutes'),
            $lt: moment('1991-04-12').set('hour', data.startTime[0].slice(0, 2)).set('minute', data.startTime[0].slice(3, 5)).add(10, 'minutes')
          }
        }
      }
    })
      .then(count => {
        if (count + amount < data.max_user) {
          model.WekinNew.findOne({
            where: {
              user_key: req.user.user_key,
              activity_key: req.body.params.activity_key,
              state: 'booking'
            }
          })
            .then(wekin => {
              console.log('시작시각####', data.startTime[0])
              let tmpTime = moment('1991-04-12')
              if (wekin === null) {
                model.WekinNew.create({
                  activity_key: data.activity_key,
                  user_key: req.user.user_key,
                  final_price: data.finalPrice,
                  start_date: moment(data.selectedDate),
                  start_time: tmpTime.set('hour', data.startTime[0].slice(0, 2)).set('minute', data.startTime[0].slice(3, 5)),
                  select_option: cloneData,
                  pay_amount: amount,
                  state: 'booking' 
                })
                  .then(result => res.json({ message: 'success', data: [0, [result]] }))
                  .catch(error => next(error))
              } else {
                let value = {}
                value.final_price = data.finalPrice
                value.start_date = moment(data.selectedDate).format()
                value.start_time = tmpTime.set('hour', data.startTime[0].slice(0, 2)).set('minute', data.startTime[0].slice(3, 5)),
                value.select_option = cloneData
                value.pay_amount = amount
                model.WekinNew.update(value, { where: { wekin_key: wekin.wekin_key }, returning: true })
                  .then(result => {
                    res.json({ message: 'success', data: result })
                  })
                  .catch(error => next(error))
              }
            })
            .catch(error => next(error))
        } else {
          res.json({ message: "error", data: "Already full in this date" })
        }
      })
      .catch(error => next(error))

  }
}

// 엑티비티 디테일 페이지 들어왔을때 activity_key, start_date 인자로 넘겨주면 남은 인원수 보여주는 api 작성
// selected_time까지 로직 작성
exports.getCurrentNumberOfBookingUsers = (req, res, next) => {
  let activity_key = req.params.key
  let date = req.params.date
  let time = req.params.time
  model.WekinNew.findAll(
    {
      where: {
        activity_key: activity_key,
        start_date: {
          $and: {
            $lt: moment(date).set('hour', 23).set('minute', 59).set('second', 59),
            $gt: moment(date).set('hour', 0).set('minute', 0).set('second', 0)
          }
        },
        state: {
          $in: ['booking', 'paid', 'ready']
        },
        start_time: {
          $and: {
            $gt: moment('1991-04-12').set('hour', time.slice(0, 2)).set('minute', time.slice(3, 5)).add(-10, 'minutes'),
            $lt: moment('1991-04-12').set('hour', time.slice(0, 2)).set('minute', time.slice(3, 5)).add(10, 'minutes')
          }
        }
      }
    }
  )
    .then(wekins => {
      let count = 0
      let length = wekins.length
      for (let i = 0; i < length; i++) {
        let wekin = wekins[i]
        count += wekin.pay_amount
      }
      res.json({ message: 'success', data: count })
    })
    .catch(error => next(error))
}

exports.getFinishList = (req, res) => {
  model.Wekin.findAll({
    where: {
      start_date: {$lt: new Date()}
    },
    include: [{
      model: model.Activity,
      include: { model: model.Host },
      where: {
        status: { $in: [3, 5] } }
    },
    { model: model.Order }]
  })
  .then(result => returnMsg.success200RetObj(res, result))
  .catch(val => {console.log(val)})
}

exports.setFinish = (req, res) => {
  let okArray = ['paid', 'cancelled', 'failed']
  
  wekinService.getWekinByKey(req.params.wekin_key)
  .then(result => {
    var hasProblemOrder = false
    
    // 완료되지 않은 주문이 있나 체크
    result.Orders.forEach(v => {
      if (!okArray.includes(v.status)) { hasProblemOrder = true }
    })

    if (hasProblemOrder) { throw 'wekin has problem order yet' }
    return result
  })
  .then(wekinModel => {
    // utilService.sendOrderAfter(wekinModel)  // TODO: 나중에 추가할것
    return model.Wekin.update({status: 'done'}, {
      where: { wekin_key: wekinModel.wekin_key},
      returning: true
    })
  })
  .then(wekinModel => {
    return activityService.getActivityByKey(wekinModel[1][0].activity_key)
  })
  .then(activityModel => {
    let allDone = true

    // 액티비티의 모든 위킨이 완료인지 체크
    activityModel.Wekins.forEach(v => {
      if(v.status !== 'done') {
        allDone = false
      }
    })
    if (allDone) {
      return {activity_key: activityModel.activity_key, status:'5'}
    } else {
      return {activity_key: activityModel.activity_key, status:'3'}
    }
  })
  .then(result => activityService.putActivity(result.activity_key, {status: result.status}))
  .then(r => {
    let result = ''
    result = (r[1][0].status === 5) ? 'allDone': 'oneDone'
    returnMsg.success200RetObj(res, {status: result})
  })
  .catch(val => {
    returnMsg.error400InvalidCall(res, 'ERROR_INVALID_PARAM', val)
  })
}

exports.getOne = (req, res) => {
  
  model.Wekin.findOne({
    where: { wekin_key: req.params.key },
    include: [
      { model: model.Activity, include: {model: model.Host} }, { model: model.Order, attributes: [], where: { status: {$in: ['order', 'ready', 'paid']}} }
    ],
    attributes: ['*', 'wekin_key','activity_key', 'min_user', 'max_user', 'start_date', 'due_date', 'created_at',
      [ model.Sequelize.fn('SUM', model.Sequelize.cast(model.Sequelize.col('Orders.wekin_amount'), 'int')), 'current_user' ]
    ],
    group: ['Wekin.wekin_key', 'Activity.activity_key', 'Activity->Host.host_key']
  })
  .then(result => {
    if (result == null) {
      return model.Wekin.findOne({
        where: { wekin_key: req.params.key },
        include: [
          { model: model.Activity, include: {model: model.Host} }
        ],
      })
    } else {
      return result
    }
  })
  .then(result => {
    returnMsg.success200RetObj(res, result)
  })
  .catch(val => {
    // console.log(val)
    returnMsg.error400InvalidCall(res, 'ERROR_INVALID_PARAM', val)
  })
}

exports.deleteWekin = (req, res) => {
  
  model.sequelize.transaction(t => {
    // transaction start
    return model.Wekin.findOne({
      where: { wekin_key: req.params.wekin_key },
      returning: true,
      include: { model: model.Order }
    }, { transaction: t})
    .then(wekin => {
      if (wekin.Orders.length > 0) {
        returnMsg.error403Forbidden(res, {msg: '예약중인 회원이 있는경우엔 불가능 합니다.'})
      } else {
        return model.Wekin.destroy({
          where: { wekin_key: wekin.wekin_key }
        })
      }
    })
    .then(r => { returnMsg.success200RetObj(res, r) })
    .catch(e => { console.log(e) })

    // transaction end
  })
}

exports.getSameActivity = (req, res) => {
  
  model.sequelize.transaction(t => {
    // transaction start
    return model.Wekin.findById(req.params.key, {
      transaction: t
    })
    .then(v => {
      return model.Wekin.findAll({
        where: { activity_key: v.activity_key },
        include: [
          { model: model.Activity, include: { model: model.Host } }, 
          { required: false, model: model.Order, where: { status: { $notIn: ['cancelled', 'failed', 'reqRef', 'been'] } } }
        ], transaction: t
      })
    })
    .then(result => returnMsg.success200RetObj(res, result))
    .catch(val => { returnMsg.error400InvalidCall(res, 'ERROR_INVALID_PARAM', val.msg) })
    // transaction end
  })
}
