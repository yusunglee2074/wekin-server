const model = require('../../../model')

exports.getWekinByKey = (wekin_key) => {
  return new Promise((resolve, reject) => {
    model.WekinNew.findOne({
      where: { wekin_key: wekin_key },
      include: [{ model: model.ActivityNew, include: { model: model.Host } }, { model: model.Order }]
    })
    .then(resolve).catch(reject)
  })
}
