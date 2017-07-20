const { Iamporter, IamporterError } = require('iamporter')
const { utilService, orderService } = require('../../service')
const iamporter = new Iamporter({
  apiKey: '4401466536780514',
  secret: 'PDNJ0Cws2yDvdk5AXOp0nxu5kbKh70gWE3GEFc6ILKdY4iy26Y2uwwzQHk8PkoMYrsC7FJQqt3oxmXAs'
})
exports.importHook = (req, res) => {
  let body = req.body
  let tmp = {}

  iamporter.findByImpUid(req.body.imp_uid)
  .then(r => {
    this.tmp.import = r
    utilService.slackLog('/iamporthook')
    utilService.slackLog(r)
    utilService.slackLog('iamporthook/')
    if (r.status === 200) {
      return orderService.findOneOrderById(r.merchant_uid)
    } else {
      returnMsg.error400InvalidCall(res, 'ERROR_INVALID_PARAM', 'ERROR_INVALID_PARAM')
      throw 'hook error'
    }
  })
  .then(r => {
    return orderService.updateOrderById(r.order_key, {
      status: tmp.import.status,
      order_pay_price	: r.order_receipt_price
    })
  })
  .then(r => {
    if (r[1][0].status === 'paid') {
      utilService.sendOrderConfirmSms(r[1][0])
    } else if (r[1][0].status === 'ready') {
      utilService.sendOrderReadySms(r[1][0])
    }
    returnMsg.success200RetObj(res, {success: true})
  })
  .catch(val => { returnMsg.error400InvalidCall(res, 'ERROR_INVALID_PARAM', val) })
}

