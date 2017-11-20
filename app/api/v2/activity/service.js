const model = require('../../../model')

exports.getActivityByKey = (key) => {
  return new Promise((resolve, reject) => {
    model.Activity.findOne({
      include: [{ model: model.Wekin }, {model: model.Host, include: {model: model.User}}],
      where: { activity_key: key }
    })
    .then(resolve).catch(reject)
  })
}

exports.putActivity = (key, attr) => {
  return new Promise((resolve, reject) => {
    model.Activity.update(attr, {where: {activity_key: key}, returning: true})
    .then(resolve).catch(reject)
  })
}