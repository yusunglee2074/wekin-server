const model = require('../../../model')
const moment = require('moment')
const returnMsg = require('../../../return.msg')

exports.getDashboard = (req, res, next) => {
  let result = {}
  model.User.count()
    .then(numberOfUser => {
      result.numberOfUser = numberOfUser
      return model.User.count({
        where: {
          created_at: {
            $gt: moment().set('hours', 0).set('minutes', 0)
          }
        }
      })
    })
    .then(NumberOfTodayUser => {
      result.NumberOfTodayUser = NumberOfTodayUser
      return model.ActivityNew.count({
        where: {
          status: 3
        }
      })
    })
    .then(numberOfActiveActivity => {
      result.numberOfActiveActivity = numberOfActiveActivity
      return model.ActivityNew.findAll({
        where: {
          status: 1
        },
      })
    })
    .then(toBeConfirmedActivities => {
      result.toBeConfirmedActivities = toBeConfirmedActivities 
      return model.Host.findAll({
        where: {
          status: 1
        }
      })
    })
    .then(toBeConfirmedMakers => {
      result.toBeConfirmedMakers = toBeConfirmedMakers 
      return model.ActivityNew.findAll({
        where: {
          end_date: {
            $lt: moment().add(11, 'days')
          },
          status: 3
        }
      })
    })
    .then(activityThatEndsSoon => {
      result.activityThatEndsSoon = activityThatEndsSoon
      return model.WekinNew.findAll({
        order: [[ 'wekin_key', 'DESC' ]],
        limit: 10,
        where: {
          state: {
            $in: ['paid', 'reqRef', 'cancelled']
          }
        },
        include: [
          { model: model.User, attributes: ['name'] }
        ]
      })
    })
    .then(recentWekinNew => {
      result.recentWekinNew = recentWekinNew
      return model.Doc.findAll({
        order: [[ 'doc_key', 'DESC' ]],
        limit: 10,
        include: [
          { model: model.User, attributes: ['name'] }
        ]
      })
    })
    .then(recentDoc => {
      result.recentDoc = recentDoc
      res.json({ message: 'success', data: result })
    })
      .catch(error => next(error))
}

exports.getActivity = (req, res) => {
  model.ActivityNew.findAll({
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

