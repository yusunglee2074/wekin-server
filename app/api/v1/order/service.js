const model = require('../../../model')

exports.cancellOrderAndNotiWaitingUser = () => {
  return new Promise((resolve, reject) => {
    
  })
}

exports.findOneOrderByKey = (order_key) => {
  return new Promise((resolve, reject) => {
    model.Order.findById(order_key)
    .then(resolve).catch(reject)
  })
}

exports.findOneOrderById = (order_id) => {
  return new Promise((resolve, reject) => {
    model.Order.findOne({where: {order_id: order_id}})
    .then(resolve).catch(reject)
  })
}

exports.updateOrderById = (order_key, value) => {
  return new Promise((resolve, reject) => {
    model.Order.update(value, {where: {order_id: order_id}, returning: true})
    .then(resolve).catch(reject)
  })
}

exports.getPaidListByWekinKey = (wekin_key) => {
  return new Promise((resolve, reject) => {
    model.Order.findAll({where: {
      wekin_key: wekin_key,
      status: {$in: ['paid']}
    }})
    .then(resolve).catch(reject)
  })
  
}