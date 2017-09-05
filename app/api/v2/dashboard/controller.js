const model = require('../../../model')
const returnMsg = require('../../../return.msg')

exports.getDashboard = (req, res) => {
  let date = new Date()
  date.setHours(0)
  date.setMinutes(0)
  date.setSeconds(0)
  
  let today = date.getTime()
  date.setDate(date.getDate() + 1)
  let tomorrow = date.getTime()  

  let result = {}

  model.sequelize.transaction(t => {
    return model.User.count({
      transaction: t
    })
    .then(r => {
      result.userCount = r
      return model.User.count({
        transaction: t,
        where: {
          created_at: { $gt: today },
          $and: {
            created_at: { $lt: tomorrow }
          }
        }
      })
    })
    .then(r => {
      result.todaysUser = r
      return model.Wekin.count({
        transaction: t,
        include: [{ model: model.Activity, where: {status: 3} }],
        where: {
          due_date: { $gt: date }
        }
      })
    })
    .then(r => {
      result.todayActivateWekin = r
      return model.Order.count({
        transaction: t,
        where: {
          created_at: { $gt: today },
          $and: {
            created_at: { $lt: tomorrow }
          }
        }
      })
    })
    .then(r => {
      result.todaysOrderCount = r
      returnMsg.success200RetObj(res, result)
    })
  })
}

exports.getActivity = (req, res) => {
  model.Activity.findAll({
    order: [['activity_key', 'DESC']],
    attributes: ['activity_key', 'status', 'created_at', 'title'],
    include: {
      attributes: ['host_key','user_key', 'name'],
      model: model.Host
    },
    limit: 5,
    where: {status: { $in: [1]}}
  })
  .then(r => {
    returnMsg.success200RetObj(res, r)
  })
}

exports.getHost = (req, res) => {
  model.Host.findAll({
    order: [['host_key', 'DESC']],
    attributes: ['host_key', 'name'],
    where: {status: { $in: [1]}},
    limit: 5
  })
  .then(r => {
    returnMsg.success200RetObj(res, r)
  })
}

exports.getDocument = (req, res) => {
  model.Doc.findAll({
    include: {
      attributes: ['user_key','name'],
      model: model.User
    },
    order: [['doc_key', 'DESC']],
    attributes: ['doc_key', 'created_at', 'type'],
    where: {type: { $in: [0, 1]}},
    limit: 5,
  })
  .then(r => {
    returnMsg.success200RetObj(res, r)
  })
}

exports.getRefundRequest = (req, res) => {
  model.Order.findAll({
    order: [['order_key', 'DESC']],
    attributes: ['user_name', 'created_at','order_at', 'status'],
    where: {status: 'reqRef'},
    limit: 5,
  })
  .then(r => {
    returnMsg.success200RetObj(res, r)
  })
}

