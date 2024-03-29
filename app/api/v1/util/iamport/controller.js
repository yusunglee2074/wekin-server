const model = require('./../../../../model')
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
        model.Order.update({ status: r.data.status, order_pay_price: r.data.amount }, { where: { order_id: r.data.merchant_uid }, returning: true })
          .then(r => {
            if (r.status === 'ready') {
              utilService.sendOrderReadySms(r[1][0])
            }
            returnMsg.success200RetObj(res, {success: true})
          })
      }
    })
    .catch(val => { returnMsg.error400InvalidCall(res, 'ERROR_INVALID_PARAM', val) })
}

