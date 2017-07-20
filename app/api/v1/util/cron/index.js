const schedule = require('node-schedule')
const model = require('../../../../model')
const moment = require('moment')

exports.batch = _ => {
  schedule.scheduleJob('*/10 * * * *', orderDelete)
}

function orderDelete () {
  model.Order.findAll({
    where: {
      status: 'order',
      order_at: {
        $lt: moment().add(-1, 'hours')
      }
    }
  })
  .then(r => {
    let stack = []
    
    r.forEach(v => {
      stack.push(
      model.Order.destroy({where: {
        order_key: v.order_key
      }, returning: true}))
    })
    
    return Promise.all(stack)
  })
  .catch(e => {
    console.log(e)
  })
}