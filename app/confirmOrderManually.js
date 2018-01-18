const model = require('./model')
const { Iamporter, IamporterError } = require('iamporter')
const iamporter = new Iamporter({
  apiKey: '4401466536780514',
  secret: 'PDNJ0Cws2yDvdk5AXOp0nxu5kbKh70gWE3GEFc6ILKdY4iy26Y2uwwzQHk8PkoMYrsC7FJQqt3oxmXAs'
})


model.Order.findAll({
  where: {
    status: 'paid',
    order_pay_method: null
  }
})
.then(results => {
  for (let i = 0; i < results.length; i++) {
    let order = results[i]
    iamporter.findByMerchantUid(order.order_id)
    .then(r => {
      console.log(r)
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
            .catch(error => console.log(error))
        } else if (r[1][0].status === 'ready') {
          r[1][0].getWekinNew()
            .then( wekin => {
              wekin.update( { state: 'ready' })
            })
            .catch(error => console.log(error))
        }
        // utilService.slackLog(r)
        return tmp
      })
      .catch(val => {
        console.log(val)
      })
  }
})
