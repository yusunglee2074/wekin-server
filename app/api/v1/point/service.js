const model = require('../../../model')
const fireHelper = require('../../../util/firebase')

exports.getUserByKey = (key) => {
  return new Promise((resolve, reject) => {
    model.User.findOne({ where: {user_key: key}}, {include: {model: model.Host}}).then(resolve).catch(reject)
  })
}

exports.getUserByToken = (req) => {
  return new Promise((resolve, reject) => {
    fireHelper.verifyFireToken(req.headers['x-access-token'])
    .then(token => model.User.findOne({ where: { uuid: token.uid }}, {include: {model: model.Host}}))
    .then(resolve).catch(reject)
  })
}

exports.getUserByFirebaseToken = token =>
  new Promise((resolve, reject) => {
    model.User.findOne({ where: { uuid: token.uid }, include: { model: model.Host }})
    .then(resolve).catch(reject)
  })
  