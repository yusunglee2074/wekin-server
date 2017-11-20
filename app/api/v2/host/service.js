const model = require('../../../model')

exports.getHostByKey = key =>
  new Promise((resolve, reject) => {
    model.Host.findOne({
      where: {host_key: key},
      include: {model: model.User}
    })
    .then(resolve).catch(reject)
  })
  