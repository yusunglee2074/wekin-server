const model = require('../../../model')

exports.getDocByKey = (key) => {
  return new Promise((resolve, reject) => {
    model.Doc.findOne({ where: {doc_key: key}}, {include: [{model: model.User}, {model: model.Activity, include: {model: model.Host, include: {model: model.User}}}]})
    .then(resolve).catch(reject)
  })
}
