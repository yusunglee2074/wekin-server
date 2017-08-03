const model = require('../../../model')
const service = require('../service')
const moment = require('moment')
// activity 조회
exports.findAllActivity = (req, res, next) => {
  let keyword = req.query.keyword ? req.query.keyword : '%'
  let nextMonth = moment().add('months', 1).format('YYYY-MM-DD')
  let period = req.params.key
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
      where: { title: { like: `%${keyword}%` }, status: service.activityStatus.activity.code },
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
      where: { title: { like: `%${keyword}%` }, status: service.activityStatus.activity.code },
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
