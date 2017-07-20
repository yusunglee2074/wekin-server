const model = require('../../../model')
const returnMsg = require('../../../return.msg')
const { wekinService, activityService, utilService } = require('../service')

exports.getFrontWekin = (req, res, next) => {
  model.Wekin
  .findAll()
  .then(results => res.json(results))
  .catch(err => next(err))
}

exports.postFrontWekin = (req, res, next) => {
  let options = req.fetchParameter(['title', 'maker'])
  if (req.checkParamErr(options)) return next(options)

  model.Wekin.create({
    title: options.title,
    maker: options.maker
  }).then(result => {
    res.json(result)
  }).catch(err => next(err))
}


exports.adjustCommission = (req, res) => {
  
  model.Wekin.update({
    commission: req.body.commission
  }, {
    where: { wekin_key: req.params.wekin_key }
  })
  .then(result => returnMsg.success200RetObj(res, result))
  .catch(val => {
    returnMsg.error400InvalidCall(res, val.code, val.msg)
  })
}

exports.putWekin = (req, res) => {

  console.log(req.body.due_date)
  
  model.Wekin.update({
    commission: req.body.commission,
    start_date: req.body.start_date,
    due_date: req.body.due_date,
    min_user: req.body.min_user,
    max_user: req.body.max_user,
  }, {
    where: { wekin_key: req.params.wekin_key }
  })
  .then(result => returnMsg.success200RetObj(res, result))
  .catch(val => {
    returnMsg.error400InvalidCall(res, val.code, val.msg)
  })
}

exports.getOneIncludeOrder = (req, res) => {
  
  model.Wekin.findOne({
    where: { wekin_key: req.params.key },
    include: [{ model: model.Activity, include: {model: model.Host} }, { model: model.Order}]
  })
  .then(result => returnMsg.success200RetObj(res, result))
  .catch(val => {
    returnMsg.error400InvalidCall(res, val.code, val.msg)
  })
} 

exports.getList = (req, res) => {
  
  model.Wekin.findAll({
    include: [{
      model: model.Activity,
      include: { model: model.Host },
      where: { status: { $in: [3] } }
    },
    { model: model.Order }]
  })
  .then(result => returnMsg.success200RetObj(res, result))
  .catch(val => {console.log(val)})
}

exports.postWekin = (req, res) => {
  
  model.Wekin.create({
    activity_key: req.body.activity_key
  })
  .then(result => returnMsg.success200RetObj(res, result))
  .catch(val => {console.log(val)})
}

exports.getFinishList = (req, res) => {
  
  model.Wekin.findAll({
    where: {
      start_date: {$lt: new Date()}
    },
    include: [{
      model: model.Activity,
      include: { model: model.Host },
      where: {
        status: { $in: [3, 5] } }
    },
    { model: model.Order }]
  })
  .then(result => returnMsg.success200RetObj(res, result))
  .catch(val => {console.log(val)})
}

exports.setFinish = (req, res) => {
  let okArray = ['paid', 'cancelled', 'failed']
  
  wekinService.getWekinByKey(req.params.wekin_key)
  .then(result => {
    var hasProblemOrder = false
    
    // 완료되지 않은 주문이 있나 체크
    result.Orders.forEach(v => {
      if (!okArray.includes(v.status)) { hasProblemOrder = true }
    })

    if (hasProblemOrder) { throw 'wekin has problem order yet' }
    return result
  })
  .then(wekinModel => {
    // utilService.sendOrderAfter(wekinModel)  // TODO: 나중에 추가할것
    return model.Wekin.update({status: 'done'}, {
      where: { wekin_key: wekinModel.wekin_key},
      returning: true
    })
  })
  .then(wekinModel => {
    return activityService.getActivityByKey(wekinModel[1][0].activity_key)
  })
  .then(activityModel => {
    let allDone = true

    // 액티비티의 모든 위킨이 완료인지 체크
    activityModel.Wekins.forEach(v => {
      if(v.status !== 'done') {
        allDone = false
      }
    })
    if (allDone) {
      return {activity_key: activityModel.activity_key, status:'5'}
    } else {
      return {activity_key: activityModel.activity_key, status:'3'}
    }
  })
  .then(result => activityService.putActivity(result.activity_key, {status: result.status}))
  .then(r => {
    let result = ''
    result = (r[1][0].status === 5) ? 'allDone': 'oneDone'
    returnMsg.success200RetObj(res, {status: result})
  })
  .catch(val => {
    returnMsg.error400InvalidCall(res, 'ERROR_INVALID_PARAM', val)
  })
}

exports.getOne = (req, res) => {
  
  model.Wekin.findOne({
    where: { wekin_key: req.params.key },
    include: [
      { model: model.Activity, include: {model: model.Host} }, { model: model.Order, attributes: [], where: { status: {$in: ['order', 'ready', 'paid']}} }
    ],
    attributes: ['*', 'wekin_key','activity_key', 'min_user', 'max_user', 'start_date', 'due_date', 'created_at',
      [ model.Sequelize.fn('SUM', model.Sequelize.cast(model.Sequelize.col('Orders.wekin_amount'), 'int')), 'current_user' ]
    ],
    group: ['Wekin.wekin_key', 'Activity.activity_key', 'Activity->Host.host_key']
  })
  .then(result => {
    if (result == null) {
      return model.Wekin.findOne({
        where: { wekin_key: req.params.key },
        include: [
          { model: model.Activity, include: {model: model.Host} }
        ],
      })
    } else {
      return result
    }
  })
  .then(result => {
    returnMsg.success200RetObj(res, result)
  })
  .catch(val => {
    // console.log(val)
    returnMsg.error400InvalidCall(res, 'ERROR_INVALID_PARAM', val)
  })
}

exports.deleteWekin = (req, res) => {
  
  model.sequelize.transaction(t => {
    // transaction start
    return model.Wekin.findOne({
      where: { wekin_key: req.params.wekin_key },
      returning: true,
      include: { model: model.Order }
    }, { transaction: t})
    .then(wekin => {
      if (wekin.Orders.length > 0) {
        returnMsg.error403Forbidden(res, {msg: '예약중인 회원이 있는경우엔 불가능 합니다.'})
      } else {
        return model.Wekin.destroy({
          where: { wekin_key: wekin.wekin_key }
        })
      }
    })
    .then(r => { returnMsg.success200RetObj(res, r) })
    .catch(e => { console.log(e) })

    // transaction end
  })
}

exports.getSameActivity = (req, res) => {
  
  model.sequelize.transaction(t => {
    // transaction start
    return model.Wekin.findById(req.params.key, {
      transaction: t
    })
    .then(v => {
      return model.Wekin.findAll({
        where: { activity_key: v.activity_key },
        include: [
          { model: model.Activity, include: { model: model.Host } }, 
          { required: false, model: model.Order, where: { status: { $notIn: ['cancelled', 'failed', 'reqRef', 'been'] } } }
        ], transaction: t
      })
    })
    .then(result => returnMsg.success200RetObj(res, result))
    .catch(val => { returnMsg.error400InvalidCall(res, 'ERROR_INVALID_PARAM', val.msg) })
    // transaction end
  })
}
