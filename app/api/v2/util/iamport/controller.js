const model = require('./../../../../model')
const { Iamporter, IamporterError } = require('iamporter')
const { utilService, orderService } = require('../../service')
const returnMsg = require('../return.msg')
const iamporter = new Iamporter({
  apiKey: '4401466536780514',
  secret: 'PDNJ0Cws2yDvdk5AXOp0nxu5kbKh70gWE3GEFc6ILKdY4iy26Y2uwwzQHk8PkoMYrsC7FJQqt3oxmXAs'
})



exports.getResponse = (req, res, next) => {
  iamporter.findByImpUid(req.params.imp_uid)
    .then(r => res.json({ message:'success', data: r }))
    .catch(e => next(e))
}


exports.importHook = (req, res, next) => {
  let body = req.body
  iamporter.findByImpUid(req.body.imp_uid)
    .then(r => {
      let data = r
      let dataForVerify = r.data
      let orderModel = {
        imp_uid: dataForVerify.imp_uid,
        order_pay_method: dataForVerify.pay_method,
        order_total_price: dataForVerify.amount,
        user_email: dataForVerify.buyer_email,
        user_name: dataForVerify.buyer_name,
        user_phone: dataForVerify.buyer_tel,
        order_pay_pg: dataForVerify.pg_provider,
        receipt_url: dataForVerify.receipt_url,
        pg_tid: dataForVerify.pg_tid,
        status: dataForVerify.status,
        order_at: dataForVerify.paid_at*1000 || new Date(),
        order_extra: {
          vbank_date: dataForVerify.vbank_date*1000,
          vbank_holder: dataForVerify.vbank_holder,
          vbank_name: dataForVerify.vbank_name,
          vbank_num: dataForVerify.vbank_num,
          user_agent: dataForVerify.user_agent
        }
      }
      if (dataForVerify.pay_method !== 'vbank') {
        orderModel.order_pay_price = dataForVerify.amount
      } else {
        orderModel.order_pay_price = 0
      }
      model.Order.update(orderModel, {
        where: { order_id: dataForVerify.merchant_uid },
        returning: true
      })
      if (r.status === 200) {
        model.Order.update({ status: r.data.status, order_pay_price: r.data.status === 'paid' ? r.data.amount : 0 }, { where: { order_id: r.data.merchant_uid }, returning: true })
          .then(r => {
            if (r[1][0].status === 'paid') {
              model.WekinNew.update({ state: 'paid' }, { where: { wekin_key: r[1][0].wekin_key } })
                .then(result => {
                  if (r[1][0].order_pay_method === 'vbank') {
                    utilService.sendOrderConfirmSms(r[1][0])
                    utilService.sendOrderConfirmSmsToMaker(r[1][0])
                  } else {
                    utilService.sendOrderConfirmSms(r[1][0])
                    utilService.sendOrderConfirmSmsToMaker(r[1][0])
                  }
                })
                .catch(error => next(error))
            } else if (r[1][0].status === 'ready') {
              utilService.sendOrderReadySms(r[1][0])
            }
            returnMsg.success200RetObj(res, {success: true})
          })
      }
    })
    .catch(val => { returnMsg.error400InvalidCall(res, 'ERROR_INVALID_PARAM', val) })
}

