const model = require('../../../model')
const returnMsg = require('../../../return.msg')
const { approveHost } = require('../noti/service')
const { utilService } = require('../service')

exports.getList = (req, res) => {
  
  model.Host.findAll({
    include: {
      model: model.User
    },
    where: {
      status: { $in: [3] }
    }
  })
  .then(result => returnMsg.success200RetObj(res, result))
  .catch(val => {console.log(val  )})
}

exports.getOne = (req, res) => {
  
  model.Host.findOne({
    where: { host_key: req.params.key },
    include: [{ model: model.User }]
  })
  .then(result => returnMsg.success200RetObj(res, result))
  .catch(val => {
    returnMsg.error400InvalidCall(res, val.code, val.msg)
  })
}

exports.getApproveList = (req, res) => {
  model.Host.findAll({
    include: {
      model: model.User
    },
    where: {
      status: { $in: [1, 4]}
    }
  })
  .then(result => returnMsg.success200RetObj(res, result))
  .catch(val => {console.log(val  )})
}

exports.putOne = (req, res) => {
  let body = req.body
  model.Host.update({
    email: body.email,
    history: body.history,
    address: body.address,
    home_page: body.home_page,
    name: body.name,
    sns: body.sns,
    tel: body.tel,
    introduce: body.introduce,
    join_method: body.join_method,
    type: body.type,
    business_registration: body.business_registration,
    license: body.license,
    license_list: body.license_list
  }, {
    where: { host_key: req.params.host_key }
  })
  .then(result => returnMsg.success200RetObj(res, result))
  .catch(val => {
    console.log(val)
  })
}

exports.approveHost = (req, res) => {
  let body = req.body
  
  // FIXME: 같은 트랜잭션에 넣어
  model.Host.update({
    status: 3 }, {
    where: { host_key: req.params.host_key }
  })
  .then(result => model.User.update({
    host_key: req.params.host_key }, {
    where: { user_key: body.User.user_key }
  }))
  .then(result => {
    approveHost(body.User.user_key)
    utilService.sendMakerConfirmSuccess(body.User.user_key)
    returnMsg.success200RetObj(res, result)
  })
  .catch(val => {
    console.log(val)
  })
  
}

exports.deleteHost = (req, res) => {
  let body = req.body
  let hasActiveWekin = false

  model.Activity.findAll({
    where: { host_key: req.params.host_key },
    include: {model: model.Wekin }
  })
  .then(r => {
    
    r.forEach(v => {
      if (v.status === 3) { // 진행중 위킨이 하나라도 있는경우
        hasActiveWekin = true
      }
    })
    
    if (!hasActiveWekin) {
      return model.Host.update({
          status: 5
        }, {
          where: {
            host_key: req.params.host_key
          }
        })
    }

  })
  .then(r => {
    if (r == undefined) {
      returnMsg.error403Forbidden(res, {msg: '진행중인 위킨이 있습니다.'})
    } else {
      // TODO: 알림추가
      returnMsg.success200RetObj(res, {msg: '호스트 삭제 완료'})
    }
  })
  .catch(val => { console.log(val) })
}

