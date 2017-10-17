const model = require('../../../model')
const service = require('../service')
const moment = require('moment')

/*
// activity 조회
exports.findAllActivity = (req, res, next) => {
  let keyword = req.query.keyword ? req.query.keyword : '%'
  let nextMonth = moment().add('months', 1).format('YYYY-MM-DD')
  let period  = 3 || req.params.key
  let periodNextMonth = moment().add('months', period).format('YYYY-MM-DD')
  

  if (period) {
    model.Activity.findAll({
      group: ['Activity.activity_key', 'Host.host_key', 'Favorites.fav_key', 'Wekins.wekin_key', 'Wekins->Orders.order_key'],
      order: [['Wekins', 'start_date', 'ASC']],
      attributes: [
        'activity_key', 'status', 'host_key', 'main_image', 'title', 'intro_summary', 'address', 'address_detail', 'price', 'category', 'created_at', 'isteamorpeople',
        [model.Sequelize.fn('AVG', model.Sequelize.col('Docs.activity_rating')), 'rating_avg'],
        [model.Sequelize.fn('COUNT', model.Sequelize.col('Docs.doc_key')), 'review_count']
      ],
      where: { title: { $like: `%${keyword}%` }, status: service.activityStatus.activity.code },
      include: [
        {
          where: {
            activity_key: { $in: model.Sequelize.literal(`(SELECT DISTINCT "activity_key" FROM "wekin" WHERE "start_date" > '${moment().format('YYYY-MM-DD')}')`) },
            start_date: {$gt: new Date()}, $and: {start_date: {$lt: periodNextMonth }}
          },
          model: model.Wekin,
          attributes: ['wekin_key', 'activity_key', 'min_user', 'max_user', 'start_date', 'due_date', 'commission',
            [model.Sequelize.fn('SUM', model.Sequelize.col('Wekins->Orders.wekin_amount')), 'current_user']
          ],
          include: { model: model.Order, attributes: [], where: { status: { $in: ['order', 'ready', 'paid'] } }, required: false },
          required: true
        },
        { model: model.Host }, { model: model.Favorite }, { model: model.Doc, attributes: [], where: { type: service.docType.review.code }, required: false }
      ]
    })
      .then(results => res.json({ results: results }))
      .catch(err => next(err)) 
  } else {
    model.Activity.findAll({
      group: ['Activity.activity_key', 'Host.host_key', 'Favorites.fav_key', 'Wekins.wekin_key', 'Wekins->Orders.order_key'],
      order: [['Wekins', 'start_date', 'ASC']],
      attributes: [
        'activity_key', 'status', 'host_key', 'main_image', 'title', 'intro_summary', 'address', 'address_detail', 'price', 'category', 'created_at', 'isteamorpeople',
        [model.Sequelize.fn('AVG', model.Sequelize.col('Docs.activity_rating')), 'rating_avg'],
        [model.Sequelize.fn('COUNT', model.Sequelize.col('Docs.doc_key')), 'review_count']
      ],
      where: { title: { $like: `%${keyword}%` }, status: service.activityStatus.activity.code },
      include: [
        {
          where: {
            activity_key: { $in: model.Sequelize.literal(`(SELECT DISTINCT "activity_key" FROM "wekin" WHERE "start_date" > '${moment().format('YYYY-MM-DD')}')`) },
            start_date: {$gt: new Date()}, $and: {start_date: {$lt: nextMonth}}
          },
          model: model.Wekin,
          attributes: ['wekin_key', 'activity_key', 'min_user', 'max_user', 'start_date', 'due_date', 'commission',
            [model.Sequelize.fn('SUM', model.Sequelize.col('Wekins->Orders.wekin_amount')), 'current_user']
          ],
          include: { model: model.Order, attributes: [], where: { status: { $in: ['order', 'ready', 'paid'] } }, required: false },
          required: true
        },
        { model: model.Host }, { model: model.Favorite }, { model: model.Doc, attributes: [], where: { type: service.docType.review.code }, required: false }
      ]
    })
      .then(results => res.json({ results: results }))
      .catch(err => next(err))
  }
}
*/

// 리펙토링
// 엑티비티 리스트
exports.findAllActivity = (req, res, next) => {
  model.ActivityNew.findAll({
    where: {
    },
    include: [
      {
        model: model.Host,
        include: {
          model: model.User,
          attributes: []
        },
        group: ['User.user_key']
      }, {
        model: model.Doc,
        attributes: [],
        where: { type: service.docType.review.code },
        required: false
      }],
    attributes: {
      include: [
        [model.Sequelize.fn('AVG', model.Sequelize.col('Docs.activity_rating')), 'rating_avg'],
        [model.Sequelize.fn('COUNT', model.Sequelize.fn('DISTINCT', model.Sequelize.col('Docs.doc_key'))), 'review_count']
      ]
    },
    group: ['ActivityNew.activity_key', 'Docs.doc_key', 'Host.host_key'],
  })
    .then( activities => {
      res.json(activities)
    })
    .catch( error => next(error) )
}

// 리펙토링
//엑티비티 생성
exports.createActivity = (req, res, next) => {
  let user = req.user
  let requestData = req.body
  let data= {
    host_key: user.Host.host_key,
    main_image: { image: requestData.main_image },
    title: requestData.title,
    intro_summary: requestData.intro_summary,
    intro_detail: requestData.intro_detail,
    schedule: requestData.schedule,
    inclusion: requestData.inclusion,
    preparation: requestData.preparation,
    address_detail: requestData.address_detail,
    refund_policy: requestData.refund_policy,
    price: requestData.price,
    isteamorpeople: requestData.isteamorpeople,
    status: service.activityStatus.request.code,
    category: requestData.category1,
    category_two: requestData.category2,
    start_date: moment(requestData.start_date).format(),
    end_date: moment(requestData.end_date).format(),
    due_date: requestData.due_date,
    base_start_time: moment().set(1, 'hours').set(00, 'minites'),
    base_price: requestData.base_price,
    base_min_user: requestData.base_min_user,
    base_max_user: requestData.base_max_user,
    base_price_option: requestData.base_price_option,
    base_extra_price_option: requestData.base_extra_price_option,
    base_week_option: requestData.base_week_option,
    close_dates: requestData.close_dates,
    is_it_ticket: requestData.is_it_ticket,
    ticket_due_date: requestData.ticket_due_date,
    ticket_max_apply: requestData.ticket_max_apply,
    comision: requestData.comision
  }
  let start_date_list = []
  let count_days = moment(data.end_date).diff(data.start_date, 'days')
  let week = {}
  let close_dates = []
  for (let i = 0; i < data.close_dates.length; i++) {
    close_dates.push(moment(data.close_dates[i]).format('YYMMDD'))
  }
  for (i in data.base_week_option) {
    if (data.base_week_option[i].min_user > 0) {
      week[i] = 1
      let time = data.base_week_option[i].start_time
      for (let y in time) {
        data.base_week_option[i].start_time[y] = moment().set('hour', time[y].split(':')[0]).set('minute', time[y].split(':')[1]).format()
      }
    } else {
      week[i] = 0
    }
  }
  var start_day = moment(data.start_date).clone()
  for (let a = 0; a < count_days; a++) {
    if (week[start_day.format('dddd').slice(0, 2)] === 1 && !close_dates.includes(start_day.format('YYMMDD'))) {
      let clone_start_day = start_day.clone()
      start_date_list.push(clone_start_day.format())
      start_day = start_day.add(1, 'days')
    } else {
      start_day = start_day.add(1, 'days')
    }
  }
  data.close_dates = close_dates
  data.start_date_list = start_date_list

  return model.sequelize.transaction(t => {
    return model.ActivityNew.create(data, { transaction: t })
    .then( result => {
      res.json({ message: 'success', data: result })
      
    })
    .catch( error => next(error) )
  })
}
/*
exports.createActivity = (req, res, next) => {
  let user = req.user
  let requestData = req.body
  let activityModelData = {
    host_key: user.Host.host_key,
    main_image: { image: requestData.main_image },
    title: requestData.title,
    intro_summary: requestData.intro_summary,
    intro_detail: requestData.intro_detail,
    schedule: requestData.schedule,
    inclusion: requestData.inclusion,
    preparation: requestData.preparation,
    address_detail: requestData.address_detail,
    refund_policy: requestData.refund_policy,
    price: requestData.price,
    category: requestData.category,
    isteamorpeople: requestData.isteamorpeople,
    status: service.activityStatus.request.code
  }
  return model.sequelize.transaction(t => {
    return model.Activity.create(activityModelData, { transaction: t })
      .then(results => {
        let wekins = requestData.wekins.filter(w => w)
        wekins = wekins.map(wekin => {
          wekin.activity_key = results.activity_key
          return wekin
        })
        return model.Wekin.bulkCreate(wekins, { transaction: t })
      }).then(results => res.json({ results: results }))
      .then(r => {
        let msg = `[위킨] ${user.Host.name} 메이커가 ${requestData.title} 위킨 승인을 요청하였습니다.`
        service.utilService.sendWekinMail(msg, msg)
      })
      .catch(err => next(err))
  }).catch(err => next(err))
}
*/

/*
exports.updateActivity = (req, res, next) => {
  let user = req.user
  let requestData = req.body
  let activityModelData = {
    host_key: user.Host.host_key,
    main_image: { image: requestData.main_image },
    title: requestData.title,
    intro_summary: requestData.intro_summary,
    intro_detail: requestData.intro_detail,
    schedule: requestData.schedule,
    inclusion: requestData.inclusion,
    preparation: requestData.preparation,
    address_detail: requestData.address_detail,
    refund_policy: requestData.refund_policy,
    price: requestData.price,
    status: service.activityStatus.request.code,
    category: requestData.category,
    isteamorpeople: requestData.isteamorpeople
  }

  return model.sequelize.transaction(t => {
    return model.Activity.update(activityModelData, { transaction: t, where: { host_key: user.Host.host_key, activity_key: req.params.activity_key, status: { $ne: service.activityStatus.activity.code } } })
      .then(results => { // FIXME: 위킨 삭제에서 bulk upsert로 바꾸기
        return model.Wekin.destroy({
          where: { activity_key: req.params.activity_key },
          transaction: t
        })
      }).then(results => {
        let wekins = requestData.wekins.filter(w => w)
        wekins = wekins.map(wekin => {
          wekin.activity_key = req.params.activity_key
          return wekin
        })
        return model.Wekin.bulkCreate(wekins, { transaction: t })
      }).then(results => res.json({ results: results }))
      .catch(err => console.error(err))
  }).catch(err => console.error(err))
}
*/

// 리펙토링
// 엑티비티 수정
exports.updateActivity = (req, res, next) => {
  let user = req.user
  let requestData = req.body
  let activityModelData = {
    host_key: user.Host.host_key,
    main_image: { image: requestData.main_image },
    title: requestData.title,
    intro_summary: requestData.intro_summary,
    intro_detail: requestData.intro_detail,
    schedule: requestData.schedule,
    inclusion: requestData.inclusion,
    preparation: requestData.preparation,
    address_detail: requestData.address_detail,
    refund_policy: requestData.refund_policy,
    price: requestData.price,
    isteamorpeople: requestData.isteamorpeople,
    status: service.activityStatus.request.code,
    category: requestData.category1,
    category_two: requestData.category2,
    start_date: moment(requestData.start_date),
    end_date: moment(requestData.end_date),
    due_date: requestData.due_date,
    base_start_time: requestData.base_start_time,
    base_price: requestData.base_price,
    base_min_user: requestData.base_min_user,
    base_max_user: requestData.base_max_user,
    base_price_option: JSON.parse(requestData.base_price_option),
    base_extra_price_option: requestData.base_extra_price_option,
    base_week_option: requestData.base_week_option,
    close_dates: JSON.parse(requestData.close_dates),
    is_it_ticket: requestData.is_it_ticket,
    ticket_due_date: requestData.ticket_due_date,
    ticket_max_apply: requestData.ticket_max_apply,
    comision: requestData.comision
  }
  return model.ActivityNew.update(activityModelData, { returning: true, where: { host_key: user.Host.host_key, activity_key: req.params.activity_key } })
    .then( result => {
      res.json({ message: "success", data: result[1][0] })
    })
    .catch( error => next(error) )
}

exports.deleteActivity = (req, res, next) => {
  let modelData = {
    status: service.activityStatus.deletion.code
  }
  let queryOptions = {
    where: { activity_key: req.params.activity_key }
  }
  model.Activity.update(modelData, queryOptions)
    .then(result => res.json(result))
    .catch(err => next(err))
}
/*
exports.findOneActivity = (req, res, next) => {
  let queryOptions = {
    group: ['Activity.activity_key', 'Host.host_key', 'Host->User.user_key'],
    where: { activity_key: req.params.activity_key, status: { $in: [service.activityStatus.activity.code, service.activityStatus.end.code] } },
    attributes: [
      'activity_key', 'status', 'host_key', 'main_image', 'title', 'intro_summary', 'intro_detail', 'inclusion', 'schedule', 'preparation', 'refund_policy', 'address', 'address_detail', 'price', 'created_at', 'count', 'isteamorpeople',
      [model.Sequelize.fn('COUNT', model.Sequelize.col('Docs.doc_key')), 'review_count']
    ],
    include: [
      {
        model: model.Host,
        include: {
          model: model.User,
          attributes: ['email']
        }
      }, {
        model: model.Doc,
        attributes: [],
        where: { type: service.docType.review.code },
        required: false
      }]
  }
  model.Activity.findOne(queryOptions)
    .then(result => {
      model.Activity.update({ count: result.count + 1 }, { where: { activity_key: req.params.activity_key, status: service.activityStatus.activity.code } })
        .then(r => res.json(result))
        .catch(err => next(err))
    }).catch(err => {
      next(err)
    })
}
*/

//리펙토링
// 엑티비티 디테일
exports.findOneActivity = (req, res, next) => {
  let queryOptions = {
    group: ['ActivityNew.activity_key', 'Host.host_key', 'Host->User.user_key'],
    where: { activity_key: req.params.activity_key, status: { $in: [service.activityStatus.activity.code, service.activityStatus.end.code] } },
    attributes: {
      include: [
        [model.Sequelize.fn('COUNT', model.Sequelize.col('Docs.doc_key')), 'review_count'],
        [model.Sequelize.fn('AVG', model.Sequelize.col('Docs.activity_rating')), 'rating_avg']
      ]
    },
    include: [
      {
        model: model.Host,
        include: {
          model: model.User,
          attributes: ['email']
        }
      }, {
        model: model.Doc,
        attributes: [],
        where: { type: service.docType.review.code },
        required: false
      }]
  }
  model.ActivityNew.findOne(queryOptions)
    .then(result => {
      model.ActivityNew.update({ count: result.count + 1 }, { where: { activity_key: req.params.activity_key, status: service.activityStatus.activity.code } })
        .then(r => res.json(result))
        .catch(err => next(err))
    }).catch(err => {
      next(err)
    })
}

// Host 소유의 Activity 조회
exports.findAllActivityOfHost = (req, res, next) => {
  let queryOptions = {
    where: { host_key: req.params.host_key, status: { $ne: service.activityStatus.deletion.code } }
  }
  if (req.query.count === 'true') {
    model.Activity.sum('count', queryOptions)
      .then(result => res.json(result))
      .catch(err => next(err))
  } else {
    queryOptions.attributes = ['activity_key', 'status', 'host_key', 'main_image', 'title', 'intro_summary', 'address', 'address_detail', 'price', 'created_at']
    model.Activity.findAll(queryOptions)
      .then(result => res.json(result))
      .catch(err => next(err))
  }
}
exports.findAllRecentlyActivityOfHost = (req, res, next) => {
  let queryOptions = {
    limit: 2,
    order: [['created_at', 'DESC']],
    where: { host_key: req.params.host_key, status: 3 },
    attributes: ['activity_key', 'host_key', 'main_image', 'title', 'price']
  }
  model.Activity.findAll(queryOptions)
    .then(result => res.json(result))
    .catch(err => next(err))
}
// wekin 조회
exports.findAllWekin = (req, res, next) => {
  let queryOptions = {
    order: [['start_date', 'ASC']],
    group: ['Wekin.wekin_key'],
    attributes: ['wekin_key', 'activity_key', 'min_user', 'max_user', 'start_date', 'due_date', 'commission',
      [model.Sequelize.fn('SUM', model.Sequelize.col('Orders.wekin_amount')), 'current_user']
      // [model.Sequelize.fn('SUM', (model.Sequelize.fn('COALESCE', (model.Sequelize.col('current_user')), 0), model.Sequelize.literal('+'), model.Sequelize.fn('COALESCE', (model.Sequelize.col('Orders.wekin_amount')), 0))), 'current_user']
    ],
    where: { activity_key: req.params.activity_key },
    include: { model: model.Order, attributes: [], where: { status: { $in: ['order', 'ready', 'paid'] } }, required: false }
  }
  model.Wekin.findAll(queryOptions)
    .then(result => res.json(result))
    .catch(err => next(err))
}
exports.findOneWekin = (req, res, next) => {
  let queryOptions = {
    group: ['Wekin.wekin_key'],
    attributes: ['wekin_key', 'activity_key', 'min_user', 'max_user', 'start_date', 'due_date', 'commission',
      [model.Sequelize.fn('SUM', model.Sequelize.col('Orders.wekin_amount')), 'current_user']
      // [model.Sequelize.fn('COUNT', model.Sequelize.col('Orders.order_key')), 'current_user']
    ],
    where: { activity_key: req.params.activity_key, wekin_key: req.params.wekin_key },
    include: { model: model.Order, attributes: [], where: { status: { $in: ['order', 'ready', 'paid'] } } }
  }
  model.Wekin.findOne(queryOptions)
    .then(result => res.json(result))
    .catch(err => next(err))
}
exports.findAllWekinWithActivity = (req, res, next) => {
  let queryOptions = {
    // group: ['Wekin.wekin_key'],
    // attributes: ['wekin_key', 'activity_key', 'min_user', 'max_user', 'start_date', 'due_date', 'commission',
    //   [model.Sequelize.fn('SUM', model.Sequelize.col('Orders.wekin_amount')), 'current_user']
    // [model.Sequelize.fn('COUNT', model.Sequelize.col('Orders.order_key')), 'current_user']
    // ],
    // where: { activity_key: req.params.activity_key, wekin_key: req.params.wekin_key },
    where: { start_date: {$gt: new Date()}, $and: {start_date: {$lt: nextMonth}} },
    include: { model: model.Activity, attributes: ['activity_key', 'main_image', 'title', 'intro_summary', 'address', 'price'], where: { status: service.activityStatus.activity.code } }
  }
  model.Wekin.findAll(queryOptions)
    .then(result => res.json(result))
    .catch(err => next(err))
}
exports.findWekiner = (req, res, next) => {
  let queryOptions = {
    where: { wekin_key: req.params.wekin_key, status: { $in: ['order', 'ready', 'paid'] } },
    include: [
      { model: model.User },
      { model: model.Wekin, include: { model: model.Activity } }
    ]
  }
  model.Order.findAll(queryOptions)
    .then(result => res.json(result))
    .catch(err => next(err))
}
