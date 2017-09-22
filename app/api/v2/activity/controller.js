const model = require('../../../model')
const returnMsg = require('../../../return.msg')
const { activityService, utilService, notiService } = require('../service')



exports.getChildWekin = (req, res) => {
  model.Wekin.findAll({
    order: [['wekin_key', 'desc']],
    where: { activity_key: req.params.activity_key },
  }).then((result) => {
    returnMsg.success200RetObj(res, result)
  }).catch((err) => {
    console.log(err)
  })
}

/*
exports.getApproveList = (req, res) => {
  model.Activity.findAll({
    order: [['created_at', 'DESC']],
    where: { status: { $in: [1] } },
    include: {
      model: model.Host 
  }}).then((results) => {
    res.json(results)
  }).catch((err) => {
    console.log(err)
  })
}
*/
// 리펙토링
// 승인해야할 엑티비티 가져오기
exports.getApproveList = (req, res, next) => {
  model.ActivityNew.findAll({
    order: [['created_at', 'DESC']],
    where: { status: { $in: [1] } },
    include: {
      model: model.Host
    }
  })
    .then( result => {
      res.json(result)
    })
    .catch( error => next(error) )
}

exports.getList = (req, res) => {
  model.Activity.findAll({
    order: [['created_at', 'DESC']],
    include: { model: model.Host },
    where: { status: { $in: [3, 4, 5] }}
  }).then((results) => {
    res.json(results)
  }).catch((err) => {
    console.log(err)
  })
}

exports.getOne = (req, res) => {
  model.Activity.findById(req.params.key)
  .then(result => res.json(result))
  .catch(err => console.log(err))
}
  
exports.putOne = (req, res) => {
  let body = req.body
  model.Activity.update({
    title: body.title,
    intro_summary: body.intro_summary,
    intro_detail: body.intro_detail,
    schedule: body.schedule,
    inclusion: body.inclusion,
    preparation: body.preparation,
    address: body.address,
    address_detail: body.address_detail,
    refund_policy: body.refund_policy,
    main_image: body.main_image,
    price: body.price,
    category: body.category
  }, {
    where: {
      activity_key: body.activity_key
    } 
  })
  .then(result => { returnMsg.success200RetObj(res, req.body) })
  .catch(err => console.log(err))
  
}

//리펙토링
// 위킨 승인
exports.getApproveActivity = (req, res, next) => {
  model.ActivityNew.update({
    status: 3,
    confirm_date: new Date()
  }, {
    where: {
      activity_key: req.params.activity_key
    },
    returning: true
  })
    .then(result => {
      notiService.activityNotiToFollow(result[1][0])
      utilService.sendWekinConfirmSuccess(result[1][0].host_key)
      res.json({ message: 'success', data: result[1][0] })
    })
    .catch(err => next(err))
}

/*
exports.getApproveActivity = (req, res) => {
  model.Activity.update({
    status: 3,
    confirm_date: new Date()
  }, {
    where: {
      activity_key: req.params.activity_key
    },
    returning: true
  })
  .then(result => {
    notiService.activityNotiToFollow(result[1][0])
    utilService.sendWekinConfirmSuccess(result[1][0].host_key)
    returnMsg.success200RetObj(res, req.body)
  })
  .catch(err => console.log(err))
}
*/

exports.deleteAvtivity = (req, res) => {

  model.Activity.find({
    where: {
      activity_key: req.params.activity_key,
    },
    include: { model: model.Wekin }
  })
  .then(result => {

    if (result.Wekins.length === 0 ) {
      return model.Activity.update({
        status: 5
      }, {
        where: {
          activity_key: req.params.activity_key
        }
      })
    }
  })
  .then(v => {
    if (v == undefined) {
      returnMsg.error403Forbidden(res, {msg: '위킨을 먼저 삭제해주세요'})
    } else {
      returnMsg.success200RetObj(res, {msg: '액티비티 삭제 완료'})
    }
  })
  .catch(err => console.log(err))
}

exports.rejectActivity = (req, res) => {

  activityService.getActivityByKey(req.params.activity_key)
  .then(r => activityService.putActivity(r.activity_key, { status: 2 }) )
  .then(v => { returnMsg.success200RetObj(res, {msg: '액티비티 반려 완료'}) })
  .catch(err => console.log(err))
}
