const model = require('../../../model')
const request = require('request')
const returnMsg = require('../../../return.msg')
const { Iamporter, IamporterError } = require('iamporter')
const { utilService, userService, waitingService, notiService } = require('../service')
const moment = require('moment')
const iamporter = new Iamporter({
  apiKey: '4401466536780514',
  secret: 'PDNJ0Cws2yDvdk5AXOp0nxu5kbKh70gWE3GEFc6ILKdY4iy26Y2uwwzQHk8PkoMYrsC7FJQqt3oxmXAs'
})
const { pageable } = require('../util/page')

/**
 * environment 타입 리스트
 */
const TYPE_MAP = {
  refund: 0,
  order: 'order'
}

exports.getHostsInfo = (req, res, next) => {
  if (!req.params.year || !req.params.month) {
    return
  }
  let monthStart = moment(req.params.month, 'MM').set('year', req.params.year)
  let monthEnd = monthStart.clone().endOf('month')
  model.Order.findAll({
    attributes: ['order_key', 'order_total_price', 'order_receipt_price', 'order_pay_price', 'status', 'commission', 'order_refund_price'],
    where: {
      host_key: req.params.host_key,
      order_at: {$gt: monthStart}, $and: {order_at: {$lt: monthEnd}}
    }
  })
  .then(r => {
    let tmp = {
      total: 0,
      commission: 0,
      result: 0
    }
    r.forEach(v => {
      if(v.status === 'paid') {
        // FIXME: 정책확인
        // NOTICE: 쿠폰등의 손해를 위킨이 감수함
        tmp.total += v.order_total_price
        tmp.commission += v.order_total_price * v.commission
      }
      if (v.status === 'cancelled') {
        tmp.total += (v.order_total_price - v.order_refund_price)
      }
    })
    tmp.result = tmp.total - tmp.commission
    tmp.list = r
    returnMsg.success200RetObj(res, tmp)
  })
  .catch(e => next(e))
}

exports.importHook = (req, res, next) => {
  let body = req.body

  iamporter.findByImpUid(req.body.imp_uid)
  .then(r => {
    if (r.status === 200) {
      let data = r.data
      if (r.data.status === body.status) {
        return model.Order.update({ status: body.status }, { where: { order_id: data.merchant_uid } })
      }
    } else {
      returnMsg.error400InvalidCall(res, 'ERROR_INVALID_PARAM', 'ERROR_INVALID_PARAM')
    }
  })
  .then(r => {
    returnMsg.success200RetObj(res, r)
  })
  .catch(val => { next(val) })
}


exports.confirmOrder = (req, res, next) => {
  let body = req.body
  let tmp = {}

  iamporter.findByImpUid(req.body.imp_uid)
  .then(r => {
    tmp = r
    if (r.status !== 200) return 'confirmError'
    let data = r.data
    let orderModel = {
      imp_uid: data.imp_uid,
      order_pay_method: data.pay_method,
      order_total_price: data.amount,
      user_email: data.buyer_email,
      user_name: data.buyer_name,
      user_phone: data.buyer_tel,
      order_pay_pg: data.pg_provider,
      receipt_url: data.receipt_url,
      pg_tid: data.pg_tid,
      status: data.status,
      order_at: data.paid_at*1000 || new Date(),
      order_extra: {
        vbank_date: data.vbank_date*1000,
        vbank_holder: data.vbank_holder,
        vbank_name: data.vbank_name,
        vbank_num: data.vbank_num,
        user_agent: data.user_agent
      }
    }
    if (data.pay_method !== 'vbank') {
      orderModel.order_pay_price = data.amount
    } else {
      orderModel.order_pay_price = 0
    }
    return model.Order.update(orderModel, {
      where: { order_id: data.merchant_uid },
      returning: true
    })
  })
  .then(r => {
    // notiService.wekinPay(r[1][0])
    if (r[1][0].status === 'paid') {
      r[1][0].getWekinNew()
        .then( wekin => {
          wekin.update( { state: 'paid' })
        })
        .catch(error => next(error))
    } else if (r[1][0].status === 'ready') {
      r[1][0].getWekinNew()
        .then( wekin => {
          wekin.update( { state: 'ready' })
        })
        .catch(error => next(error))
    }
    // utilService.slackLog(r)
    return tmp
  })
  .then(r => {
    returnMsg.success200RetObj(res, r)
  })
  .catch(val => {
    next(val)
  })
}


exports.putOrder = (req, res, next) => {
  let body = req.body

  model.Order.update({
      status: req.body.status,
      refund_extra: req.body.extra
    }, {
      where: {
        order_key: req.params.order_key
      }
    })
  .then(result => returnMsg.success200RetObj(res, result))
  .catch(val => next(val) )
}

/**
 * 예약취소 요청
 */
exports.setOrderRefundRequest = (req, res, next) => {
  model.Order.update({
    status: 'reqRef'
  }, {
    where: {
      order_key: req.params.order_key
    },
    returning: true
  })
    .then(r => { 
      utilService.sendOrderCancellRequest(r[1][0])
      return model.WekinNew.update({ state: 'reqRef' }, { where: { wekin_key: r[1][0].wekin_key }, returning: true })
    })
    .then(wekin => {
      let userName, start_date, ActivityName, hostTel, hostName
      start_date = moment(wekin[1][0].start_date).add(9, 'hour').format('YYYY-MM-DD')
      model.User.findOne({ 
        where: {
          user_key: wekin[1][0].user_key
        } 
      })
        .then(user => {
          userName = user.name
          return model.ActivityNew.findOne({ where: { activity_key: wekin[1][0].activity_key }, include: [{ model: model.Host }] })
        })
        .then(activity => {
          ActivityName = activity.title
          hostTel = activity.Host.tel
          hostName = activity.Host.name
          return utilService.sendOrderCancellRequestToHost(userName, start_date, ActivityName, hostTel, hostName)
        })
        .then(result => {
          returnMsg.success200RetObj(res, result)
        })
        .catch(error => next(error))
    })
    .catch(e => {
      next(e)
    })
}

let cancelVbank = (imp_uid) => {
  return new Promise((resolve, reject) => {
    iamporter.getToken()
    .then(r => r.data.access_token)
    .then(r => {
      request({url: `http://api.iamport.kr/vbanks/${imp_uid}`, headers: {
        Authorization: r
      }}, (e ,r, b) => {
        resolve(b)
      })
    })
    .catch(reject)
  })
  
}

exports.setOrderCancelled = (req, res, next) => {
  // utilService.slackLog('주문취소')
  model.Order.findById(req.params.order_key)
  .then(orderObj => {
    if (!orderObj.order_extra) {
      orderObj.order_extra = {} 
    }
    if((orderObj.order_pay_price === 0) && (orderObj.order_pay_method === 'vbank')) {
      // utilService.slackLog('0원 무통장')
      return cancelVbank(orderObj.imp_uid)
    } else if ((orderObj.order_pay_price !== 0) && (orderObj.order_pay_method === 'vbank')) {
      // 돈이 들어온 무통장
      return {status: '무통장 취소처리'}
    } else {
      // utilService.slackLog('가격이 있거나 무통장외')
      if (orderObj.order_pay_method === 'point') {
        return
      }
      return iamporter.cancel({
        imp_uid: orderObj.imp_uid,
        merchant_uid: orderObj.order_id,
        amount: req.body.order_refund_price,
        reason: orderObj.order_extra.reason,
        refund_holder: orderObj.order_extra.refund_holder,
        refund_bank: orderObj.order_extra.refund_bank,
        refund_account: orderObj.order_extra.refund_account
      })
    }
  })
  .then(r => {
    return model.Order.update({
      status: 'cancelled',
      order_refund_price: req.body.order_refund_price
    }, {
      where: {
        order_key: req.params.order_key
      }, returning: true
    })
  })
  .then(r => {
    model.WekinNew.update({ state: 'cancelled' }, { where: { wekin_key: r[1][0].wekin_key } })
    utilService.sendOrderConcellSuccess(r[1][0])
    return r
  })
  .then(r => {
    // utilService.slackLog('대기자 전송')
    // TODO: 환불 취소시 대기자들에게 문자 돌리는 로직 수정해야됨
    //notiService.waitingBookable(r[1][0])
    //return waitingService.sendNoti(r[1][0].wekin_key)
  })
  .then(r => {
    returnMsg.success200RetObj(res, {result: 'done'})
  })
  .catch(e => {
    next(e)
  })
}

exports.setOrderBeen = (req, res, next) => {
  let tmp = {}
  model.Order.findOne({
    where: {order_id :req.params.order_id }} )
  .then(r => {
    tmp.target = r
    return userService.getUserByToken(req)
  })
  .then(r => {
    tmp.myInfo = r
    // utilService.slackLog(r)

    return model.Order.create({
      user_key: r.user_key,
      user_name: r.name,
      user_email: r.email,
      user_phone: r.phone,
      wekin_key: tmp.target.wekin_key,
      wekin_name: tmp.target.wekin_name,
      wekin_price: tmp.target.wekin_price,
      host_key: tmp.target.host_key,
      order_total_price: 0,
      order_receipt_price: 0,
      order_refund_price: 0,
      wekin_amount: 0,
      order_pay_price: 0,
      status: 'been'
    })
  })
  .then(r => {
    returnMsg.success200RetObj(res, r)
  })
  .catch(e => {
    next(e)
  })

/*
  model.Order.update({
    status: 'cancelled',
    order_refund_price: req.body.order_refund_price
  }, {
    where: {
      order_key: req.params.order_key
    }
  })
  .then(r => {
    returnMsg.success200RetObj(res, r)
  })
  .catch(e => {
    returnMsg.error400InvalidCall(res, 'ERROR_INVALID_PARAM', e)
  })
  */
}

/* TODO:결제 리스트 나중에 봐야겠다 재미있는 코드가 있는거 같다.
exports.getOrderListPageing = (req, res) => {
  let param = {
    include: [{ model: model.Wekin, include: { model: model.Activity } }, { model: model.User }],
    where: {status: {$notIn: ['reqRef', 'been']}}
  }

  if(req.query.status) {
    let p = []
    if (param.where == undefined) {
      console.log('und')
      param.where = {status: req.query.status}
    } else {
      console.log('nound')
      let tmp = param.where.status
      p.push(req.query.status)
      Object.assign(tmp, {$in: p})
    }
  }
  if(req.query.method) {
    if (param.where == undefined) {
      param.where = {order_pay_method: req.query.method}
    } else {
      let tmp = param.where
      Object.assign(tmp, {order_pay_method: req.query.method})
      param.where = tmp
    }
  }
  if(req.query.start) {
    let qry = {order_at: {$gt: Date.parse(req.query.start + ' 00:00:00')}}
    if (param.where == undefined) {
      param.where = qry
    } else {
      let tmp = param.where
      Object.assign(tmp, qry)
      param.where = tmp
    }
  }
  if(req.query.end) {
    let qry = {order_at: {$lt: Date.parse(req.query.end + ' 23:59:59')}}
    if (param.where == undefined) {
      param.where = qry
    } else {
      if (param.where.order_at == undefined ) {
        let tmp = param.where
        Object.assign(tmp, qry)
        param.where = tmp
      } else {
        let tmp = param.where.order_at
        Object.assign(tmp, {$lt: qry.order_at.$lt})
        param.where.order_at = tmp
      }
    }
  }
  if(req.query.wekin_key) {
    let qry = {wekin_key: {$in: req.query.wekin_key.split(',').map(Number)}}
    if (param.where == undefined) {
      param.where = qry
    } else {
      let tmp = param.where
      Object.assign(tmp, qry)
      param.where = tmp
    }
  }
  if(req.query.host_key) {
    let qry = {host_key: {$in: req.query.host_key.split(',').map(Number)}}
    if (param.where == undefined) {
      param.where = qry
    } else {
      let tmp = param.where
      Object.assign(tmp, qry)
      param.where = tmp
    }
  }

  // console.log('====================================')
  // console.log(param.where)
  // console.log('====================================')
  // res.json(param)

  pageable(model.Order, req.query, param)
  .then(result => res.json(result))
  .catch(val => { console.log(val) })
}
*/

exports.getOrderListPageing = (req, res, next) => {
  // 전체 오더 정보를 가져온다. TODO: 페이지네이션에 대해 고민해보자 지금은 데이터가 얼마 없어서 상관은 없다.
  model.Order.findAll({
    include: [
      { model: model.User }, { model: model.WekinNew }
    ]
  })
    .then( orders => {
      res.json({ message: "success", data: orders })
    })
    .catch(error => next(error))
}

exports.getOrderListPageingExcel = (req, res, next) => {
  let param = {
    include: [{ model: model.Wekin, include: { model: model.Activity } }, { model: model.User }],
    where: {status: {$notIn: ['reqRef', 'been']}}
  }

  if(req.query.status) {
    let p = []
    if (param.where == undefined) {
      console.log('und')
      param.where = {status: req.query.status}
    } else {
      console.log('nound')
      let tmp = param.where.status
      p.push(req.query.status)
      Object.assign(tmp, {$in: p})
    }
  }
  if(req.query.method) {
    if (param.where == undefined) {
      param.where = {order_pay_method: req.query.method}
    } else {
      let tmp = param.where
      Object.assign(tmp, {order_pay_method: req.query.method})
      param.where = tmp
    }
  }
  if(req.query.start) {
    let qry = {order_at: {$gt: Date.parse(req.query.start + ' 00:00:00')}}
    if (param.where == undefined) {
      param.where = qry
    } else {
      let tmp = param.where
      Object.assign(tmp, qry)
      param.where = tmp
    }
  }
  if(req.query.end) {
    let qry = {order_at: {$lt: Date.parse(req.query.end + ' 23:59:59')}}
    if (param.where == undefined) {
      param.where = qry
    } else {
      if (param.where.order_at == undefined ) {
        let tmp = param.where
        Object.assign(tmp, qry)
        param.where = tmp
      } else {
        let tmp = param.where.order_at
        Object.assign(tmp, {$lt: qry.order_at.$lt})
        param.where.order_at = tmp
      }
    }
  }
  if(req.query.wekin_key) {
    let qry = {wekin_key: {$in: req.query.wekin_key.split(',').map(Number)}}
    if (param.where == undefined) {
      param.where = qry
    } else {
      let tmp = param.where
      Object.assign(tmp, qry)
      param.where = tmp
    }
  }

  pageable(model.Order, req.query, param)
  .then(result => {
    console.log(result.content)
    res.xls('data.xlsx', result.content)
  })
  .catch(val => { console.log(val) })
}

exports.getRefundOrderListPageing = (req, res) => {
  let param = {
    include: [{ model: model.Wekin, include: { model: model.Activity } }, { model: model.User }],
    where: {status: {$notIn: ['order','ready','paid','failed', 'been']}}
  }

  if(req.query.status) {
    let p = []
    if (param.where == undefined) {
      param.where = {status: req.query.status}
    } else {
      let tmp = param.where.status
      p.push(req.query.status)
      Object.assign(tmp, {$in: p})
    }
  }
  if(req.query.method) {
    if (param.where == undefined) {
      param.where = {order_pay_method: req.query.method}
    } else {
      let tmp = param.where
      Object.assign(tmp, {order_pay_method: req.query.method})
      param.where = tmp
    }
  }
  if(req.query.start) {
    let qry = {order_at: {$gt: Date.parse(req.query.start + ' 00:00:00')}}
    if (param.where == undefined) {
      param.where = qry
    } else {
      let tmp = param.where
      Object.assign(tmp, qry)
      param.where = tmp
    }
  }
  if(req.query.end) {
    let qry = {order_at: {$lt: Date.parse(req.query.end + ' 23:59:59')}}
    if (param.where == undefined) {
      param.where = qry
    } else {
      if (param.where.order_at == undefined ) {
        let tmp = param.where
        Object.assign(tmp, qry)
        param.where = tmp
      } else {
        let tmp = param.where.order_at
        Object.assign(tmp, {$lt: qry.order_at.$lt})
        param.where.order_at = tmp
      }
    }
  }
  if(req.query.wekin_key) {
    let qry = {wekin_key: {$in: req.query.wekin_key.split(',').map(Number)}}
    if (param.where == undefined) {
      param.where = qry
    } else {
      let tmp = param.where
      Object.assign(tmp, qry)
      param.where = tmp
    }
  }

  // console.log('====================================')
  // console.log(param.where)
  // console.log('====================================')
  // res.json(param)

  pageable(model.Order, req.query, param)
  .then(result => res.json(result))
  .catch(val => { next(val) })
}


exports.getList = (req, res, next) => {
  model.Order.findAll({
    include: [{ model: model.Wekin }, { model: model.User }]
  })
  .then(result => returnMsg.success200RetObj(res, result))
  .catch(val => { next(val) })
}

exports.putOrder = (req, res, next) => {
  let body = req.body

  model.Order.update({
      status: req.body.status,
      order_extra: req.body.extra
    }, {
      where: {
        order_key: req.params.order_key
      }
    })
  .then(result => returnMsg.success200RetObj(res, result))
  .catch(val => { next(val) })
}



exports.postOrderWithPoint = (req, res, next) => {
  let body = req.body
  let promiseList = []
  console.log(body.wekin_key, body.amount, '얍')
  promiseList.push(model.WekinNew.update({ point: body.amount, state: 'paid' }, { where: { wekin_key: body.wekin_key } }))
  model.WekinNew.findOne({
    where: {
      wekin_key: body.wekin_key
    },
    include: ['User', { model: model.ActivityNew, include: ['Host'] }]
  })
  .then(wekin => {
    promiseList.push(model.Order.create({
      order_pay_method: 'point',
      user_key: wekin.User.user_key,
      user_email: wekin.User.email,
      user_name: wekin.User.name,
      user_phone: wekin.User.phone,
      wekin_name: wekin.ActivityNew.title,
      wekin_price: wekin.ActivityNew.base_price,
      wekin_amount: wekin.pay_amount,
      order_total_price: wekin.final_price,
      order_receipt_price: 0,
      order_refund_price: 0,
      order_pay_price: wekin.final_price,
      status: 'paid',
      order_at: new Date(),
      order_method: 'point',
      order_refund_policy: wekin.ActivityNew.refund_policy,
      wekin_host_name: wekin.ActivityNew.Host.name,
      commision: 0,
      refund_info: {"account":null,"bank":null,"name":null},
      host_key: wekin.ActivityNew.Host.host_key,
      wekin_key: wekin.wekin_key
    }))
    return Promise.all(promiseList)
  })
  .then(result => {
    utilService.sendOrderConfirm(result[1])
    returnMsg.success200RetObj(res, result[1])
  })
  .catch(error => next(error))

}



exports.postOrder = (req, res, next) => {

  model.sequelize.transaction(t => {
  // transaction start
    let body = req.body
    let tmp = {}

    typeConverter(req)
      .then(v => {
        tmp.status = v
        return model.User.findOne({
          where: { user_key: body.user_key }
        }, {transaction: t})
      })
      .then(v => {
        tmp.user = v
        return model.WekinNew.findOne(
          {
            where: { wekin_key: body.wekin_key},
            include: [
              { model: model.ActivityNew, include: { model: model.Host }, attributes: ['title', 'host_key', 'base_price', 'refund_policy', 'comision'] },
              { required: false, model: model.Order, where: { status: { $in: ['order', 'ready', 'paid'] } }}
            ]
          }, { transaction: t })
      })
      .then(v => {
        model.Order.findOne({ where: { wekin_key: v.wekin_key, status: 'order' } }) 
          .then(order => {
            if (order) {
              order.destroy()
            }
          })
        //인원 내
        // FIXME: create까지 transaction 잡아줘야함
        return model.Order.create({
          user_key: body.user_key,
          user_email: tmp.user.email,
          user_name: tmp.user.name,
          user_phone: tmp.user.phone,
          wekin_key: body.wekin_key,
          status: tmp.status,
          amount: body.amount,
          wekin_name: v.ActivityNew.title,
          wekin_price: v.ActivityNew.base_price,
          wekin_amount: body.amount,
          order_total_price: v.final_price,
          order_receipt_price: v.final_price,
          order_refund_policy: v.ActivityNew.refund_policy,
          wekin_host_name: v.ActivityNew.Host.name,
          host_key: v.ActivityNew.Host.host_key,
          refund_info: body.extra,
          commission: v.ActivityNew.comision
        })
    })
    .then(result => {
      returnMsg.success200RetObj(res, result)
    })
    .catch(val => {
      next(val)
    })
  })
  // transaction end


}

exports.getOneByUser = (req, res, next) => {
  model.Order.findAll({
    where: { user_key: req.params.user_key },
    include: [
      { model: model.WekinNew, include: model.ActivityNew },
      { model: model.User }]
  })
  .then(v => {
    returnMsg.success200RetObj(res, v)
  })
  .catch(err => next(err))
}
exports.getOneOrder = (req, res, next) => {
  model.Order.findOne({
    where: { order_key: req.params.order_key },
    include: [
      { model: model.WekinNew, include: model.ActivityNew },
      { model: model.User }]
  })
  .then(v => {
    returnMsg.success200RetObj(res, v)
  })
  .catch(val => { next(val) })
}
exports.deleteOrder = (req, res, next) => {
  model.Order.findOne({
    where: { order_key: req.params.order_key }
  })
  .then(v => {
    if (v.status === "order") {
      return model.Order.destroy({
        where: {
          order_key: v.order_key
        },
        returning: true
      })
    }
  })
  .then(v => {
    returnMsg.success200RetObj(res, {result: 'done'})
  })
  .catch(val => { next(val) })
}

exports.deleteOrderImpUid = (req, res, next) => {
  model.Order.findOne({
    where: { imp_uid: req.params.imp_uid }
  })
  .then(v => {
    if (v.status === "order") {
      return model.Order.destroy({
        where: {
          imp_uid: v.imp_uid
        },
        returning: true
      })
    }
  })
  .then(v => {
    returnMsg.success200RetObj(res, {result: 'done'})
  })
  .catch(val => { next(val) })
}

exports.getOrderImpUid = (req, res, next) => {
  iamporter.findByImpUid(req.params.imp_uid)
  .then(v => {
    res.json({ message: 'success', data: v })
  })
  .catch(val => { next(val) })
}

exports.getOrderByWekin = (req, res) => {
  typeConverter(req)
  .then(v => {
    return model.Order.findAll({
      // where: { status: {$notIn: ['cancelled', 'failed']}}
      where: [{ wekin_key: req.params.wekin_key }, { status: {$in: ['order', 'ready', 'paid', 'reqRef']}} ],
      include: [
        // { model: model.Wekin, include: model.Activity},
        { model: model.User }]
    })
  })
  .then(v => {
    returnMsg.success200RetObj(res, v)
  })
  .catch(val => { returnMsg.error400InvalidCall(res, 'ERROR_INVALID_PARAM', val) })
}

exports.getDashboard = (req, res) => {

  let result = {}

  model.sequelize.transaction(t => {
    return model.User.count({
      transaction: t
    })
    .then(r => {
      result.userCount = r
      return model.User.count({
        transaction: t
      })
    })
    .then(r => {
      result.todayUserCount = r
      return model.Wekin.count({
        transaction: t
      })
    })
    .then(r => {
      result.activeWekin = r
      returnMsg.success200RetObj(res, result)
    })
  })
}
exports.listData = (req, res, next) => {
  model.Doc.findAll({
    where: { type: { $notIn: [2] } },
    include: [{ model: model.Activity }, { model: model.User }]
  })
  .then(result => returnMsg.success200RetObj(res, result))
  .catch(val => { next(val) })
}

exports.qnaListData = (req, res, next) => {
  model.Doc.findAll({
    where: { type: 2 },
    include: [{ model: model.Activity }, { model: model.User }]
  })
  .then(result => returnMsg.success200RetObj(res, result))
  .catch(val => { next(val) })
}

exports.getData = (req, res, next) => {

  typeConverter(req)
  .then(val => model.Env.findAll({
    where: { type: val, name: req.params.key},
    attributes: ['value', 'env_key']
  }))
  .then(result => returnMsg.success200RetObj(res, result))
  .catch(val => {
    next(val)
  })
}

exports.postData = (req, res, next) => {

  typeConverter(req)
  .then(val => model.Env.create({
    type: val,
    name: req.params.name,
    value: req.body.value
  }))
  .then(result => returnMsg.success200RetObj(res, result))
  .catch(val => { next(val) })
  // .catch(val => { returnMsg.error400InvalidCall(res, val.code, val.msg) })
}

exports.putData = (req, res, next) => {
  typeConverter(req)
  .then(val => model.Env.update({
    value: req.body.value
  }, {
    where: {
      env_key: req.body.value.key
    },
    returning: true
  }))
  .then(result => returnMsg.success200RetObj(res, result))
  .catch(val => { next(val) })

}

exports.deleteData = (req, res, next) => {
  typeConverter(req)
  .then(val => model.Env.destroy({
    where: {
      env_key: req.body.value.key
    },
    returning: true
  }))
  .then(result => returnMsg.success200RetObj(res, result))
  .catch(val => { next(val) })

}


/**
 * 경로 패스와 일치하는 타입의 int 값을 리턴
 * @param {Request} req
 */
let typeConverter = req => {
  return new Promise((resolve, reject) => {
    let returnValue = TYPE_MAP[req.params.type]
    if (returnValue == undefined) {
      reject({
        code: 'ERROR_INVALID_PARAM',
        msg: 'ERROR_INVALID_PARAM'})
    } else {
      resolve(returnValue)
    }
  })
}
