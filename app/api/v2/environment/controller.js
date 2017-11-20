const model = require('../../../model')
const returnMsg = require('../../../return.msg')

/**
 * environment 타입 리스트
 */
const NAME_MAP = ['notice', 'faq', 'main', 'conf', 'mobile']

// type 
exports.getData = (req, res) => {
  typeConverter(req)
  .then(val => model.Env.findAll({
    where: { type: val, name: req.params.name},
    attributes: ['value', 'env_key', 'description']
  }))
  .then(result => returnMsg.success200RetObj(res, result))
  .catch(val => {
    returnMsg.error400InvalidCall(res, val.code, val.msg)
  })
}

exports.postData = (req, res) => {

  typeConverter(req)
  .then(val => model.Env.create({
    type: val,
    name: req.params.name,
    value: req.body.value,
    description: req.body.description
  }))
  .then(result => returnMsg.success200RetObj(res, result))
  .catch(val => { console.log(val) })
}

exports.putData = (req, res) => { 
  typeConverter(req)
  .then(val => model.Env.update({
    value: req.body.value
  }, {
    where: {
      env_key: req.body.env_key
    },
    returning: true
  }))
  .then(result => returnMsg.success200RetObj(res, result))
  .catch(val => { console.log(val) })
  
}

exports.deleteData = (req, res) => {
  typeConverter(req)
  .then(val => model.Env.destroy({
    where: {
      env_key: req.params.key
    },
    returning: true
  }))
  .then(result => returnMsg.success200RetObj(res, result))
  .catch(val => { console.log(val) })
  
}


/**
 * 경로 패스와 일치하는 타입의 int 값을 리턴
 * @param {Request} req 
 */
let typeConverter = req => {
  return new Promise((resolve, reject) => {
    NAME_MAP.includes(req.params.type) ? 
    resolve(req.params.type) :
    reject({
      code: 'ERROR_INVALID_type of param ',
      msg: 'ERROR_INVALID_type of param'})
  })
}
