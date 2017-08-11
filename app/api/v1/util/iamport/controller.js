const { Iamporter, IamporterError } = require('iamporter')
const { utilService, orderService } = require('../../service')
const returnMsg = require('../return.msg')
const iamporter = new Iamporter({
  apiKey: '4401466536780514',
  secret: 'PDNJ0Cws2yDvdk5AXOp0nxu5kbKh70gWE3GEFc6ILKdY4iy26Y2uwwzQHk8PkoMYrsC7FJQqt3oxmXAs'
})
exports.importHook = (req, res) => {
  let body = req.body

  iamporter.findByImpUid(req.body.imp_uid)
  .then(r => {
    let data = r
    if (r.status === 200) {
      return orderService.findOneOrderById(r.data.merchant_uid)
    } else {
      returnMsg.error400InvalidCall(res, 'ERROR_INVALID_PARAM', 'ERROR_INVALID_PARAM')
      throw 'hook error'
    }
  })
  .then(r => {
    return orderService.updateOrderById(r.order_key, {
      status: r.data.status,
      order_pay_price	: r.order_receipt_price
    })
  })
  .then(r => {
    if (r[1][0].status === 'paid') {
      utilService.sendOrderConfirmSms(r[1][0])
      utilService.sendOrderConfirmSmsToMaker(r[1][0])
    } else if (r[1][0].status === 'ready') {
      utilService.sendOrderReadySms(r[1][0])
    }
    returnMsg.success200RetObj(res, {success: true})
  })
  .catch(val => { returnMsg.error400InvalidCall(res, 'ERROR_INVALID_PARAM', val) })
}

