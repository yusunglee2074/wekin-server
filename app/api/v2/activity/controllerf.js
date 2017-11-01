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
  let keyword = req.query.keyword ? req.query.keyword : '%'
  model.ActivityNew.findAll({
    where: {
      status: 3 || 5,
      title: { $like: `%${keyword}%` }
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
        required: false,
      }],
    attributes: {
      include: [
        [model.Sequelize.fn('AVG', model.Sequelize.col('Docs.activity_rating')), 'rating_avg'],
        [model.Sequelize.fn('COUNT', model.Sequelize.col('Docs.doc_key')), 'review_count']
      ]
    },
    group: ['ActivityNew.activity_key', model.Sequelize.col('Docs.activity_key'), 'Host.host_key'],
  })
    .then( activities => {
      res.json(activities)
    })
    .catch( error => next(error) )
}

exports.findAllActivityForAdmin = (req, res, next) => {
  model.ActivityNew.findAll({
    include: [
      {
        model: model.Host,
        include: {
          model: model.User,
        },
      }, {
        model: model.WekinNew,
        where: { state: 'ready' || 'paid' },
        required: false,
        include: [
          {
            model: model.User,
          },
          {
            model: model.Order,
            attributes: ['order_key']
          },
        ],
      }],
    attributes: {
      include: [
        [model.Sequelize.fn('COUNT', model.Sequelize.fn('DISTINCT', model.Sequelize.col('WekinNews.wekin_key'))), 'wekinnew_count']
      ]
    },
    group: ['ActivityNew.activity_key', 'Host.host_key', 'Host->User.user_key', 'WekinNews.wekin_key', 'WekinNews->Order.order_key', 'WekinNews->User.user_key'],
  })
    .then( activities => {
      res.json(activities)
    })
    .catch( error => next(error) )
}
// 카테고리에 해당하는 acitivity만 불러옴
// category = {
// 0(특별한 경험): [ 투어/여행, 익스트림(레저), 스포츠(구기종목), 힐링, 아웃도어],
// 1(새로운 모임): [ 투어/여행, 익스트림(레저), 스포츠(구기종목), 음악, 댄스, 뷰티, 요리, 아트, 힐링, 아웃도어, 요가/피트니스, 소품제작 ],
// 2(일상탈출): [ 투어/여행, 익스트림(레저), 스포츠(구기종목), 힐링,  아웃도어 ],
// 3(자기관리): [ 힐링, 아웃도어, 요가/피트니스 ],
// 4(실력향상): [ 스포츠(구기종목), 음악, 댄스, 뷰티, 요리, 아트, 아웃도어, 요가/피트니스, 소품제작 ],
// 5(아이템 제작): [ 뷰티, 아트, 소품제작 ],
// 6(전문가 과정): [ 음악, 댄스, 뷰티, 요리, 아트, 요가/피트니스, 소품제작 ],
// }
exports.getActivityWithCateogry = (req, res, next) => {
  let category = {
    0: [ '투어/여행', '익스트림(레저)', '스포츠(구기종목)', '힐링', '아웃도어'],
    1: [ '투어/여행', '익스트림(레저)', '스포츠(구기종목)', '음악', '댄스', '뷰티', '요리', '아트', '힐링', '아웃도어', '요가/피트니스', '소품제작' ],
    2: [ '투어/여행', '익스트림(레저)', '스포츠(구기종목)', '힐링',  '아웃도어' ],
    3: [ '힐링', '아웃도어', '요가/피트니스' ],
    4: [ '스포츠(구기종목)', '음악', '댄스', '뷰티', '요리', '아트', '아웃도어', '요가/피트니스', '소품제작' ],
    5: [ '뷰티', '아트', '소품제작' ],
    6: [ '음악', '댄스', '뷰티', '요리', '아트', '요가/피트니스', '소품제작' ],
  }
  let categoryKey = req.params.key
  model.ActivityNew.findAll({
    where: {
      category: {
        $in: category[categoryKey]
      }
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
  .then( result => {
    res.json({ message: 'success', data: result })
  })
}

// 리펙토링
//엑티비티 생성
exports.createActivity = (req, res, next) => {
  let user = req.user
  let requestData = req.body
  let data= {
    host_key: user.Host.host_key,
    main_image: requestData.main_image,
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
    status: requestData.status || service.activityStatus.request.code,
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
    comision: requestData.comision,
    detail_question: requestData.detail_question
  }
  let start_date_list = []
  let count_days = moment(data.end_date).diff(data.start_date, 'days')
  let week = {}
  let close_dates = []
  for (let i = 0; i < data.close_dates.length; i++) {
    close_dates.push(Number(moment(data.close_dates[i]).format('YYMMDD')))
  }
  for (i in data.base_week_option) {
    if (data.base_week_option[i].min_user > 0) {
      week[i] = 1
    } else {
      week[i] = 0
    }
  }
  var start_day = moment(data.start_date).clone()
  for (let a = 0; a < count_days; a++) {
    if (week[start_day.format('dddd').slice(0, 2)] === 1 && !close_dates.includes(Number(start_day.format('YYMMDD')))) {
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
    host_key: requestData.host_key,
    main_image: requestData.main_image,
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
    status: requestData.status,
    category: requestData.category1,
    category_two: requestData.category2,
    start_date: moment(requestData.start_date),
    end_date: moment(requestData.end_date),
    due_date: requestData.due_date,
    base_start_time: requestData.base_start_time,
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
    comision: requestData.comision,
    start_date_list: requestData.start_date_list
  }
  return model.ActivityNew.update(activityModelData, { returning: true, where: { host_key: requestData.host_key || user.Host.host_key, activity_key: req.params.activity_key } })
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
  model.ActivityNew.update({ status: 5 }, queryOptions)
    .then(result => res.json(result))
    .catch(err => next(err))
}

exports.forceDeleteActivity = (req, res, next) => {
  let queryOptions = {
    where: { activity_key: req.params.activity_key }
  }
  model.ActivityNew.destroy(queryOptions)
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
    where: { activity_key: req.params.activity_key },
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
    model.ActivityNew.sum('count', queryOptions)
      .then(result => res.json(result))
      .catch(err => next(err))
  } else {
    model.ActivityNew.findAll(queryOptions)
      .then(result => res.json(result))
      .catch(err => next(err))
  }
}
exports.findAllRecentlyActivityOfHost = (req, res, next) => {
  let queryOptions = {
    limit: 2,
    order: [['created_at', 'DESC']],
    where: { host_key: req.params.host_key, status: 3 },
    attributes: ['activity_key', 'host_key', 'main_image', 'title', 'base_price']
  }
  model.ActivityNew.findAll(queryOptions)
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
    where: { activity_key: req.params.wekin_key, state: 'paid' },
    include: [
      { model: model.User, attributes: ['profile_image', 'user_key'] }
    ]
  }
  model.WekinNew.findAll(queryOptions)
    .then(result => {
      res.json({ message: 'success', data: result })
    })
    .catch(err => next(err))
}

// 검색 api
exports.searchAllactivies = (req, res, next) => {
  model.ActivityNew.findAll({
    order: [['count', 'DESC']],
    where: {
      status: 3
    },
    attributes: ['title', 'activity_key'],
  })
  .then( results => {
    model.ActivityNew.findAll({
      where: {
        status: 3
      },
      include: [
        { model: model.WekinNew, attributes: [], required: true, duplicating: false }
      ],
      attributes: ['title', 'activity_key', [model.Sequelize.fn('count', model.Sequelize.col('WekinNews.wekin_key')), 'wekins']],
      group: ['ActivityNew.activity_key'],
      order: [[model.Sequelize.col('ActivityNew.count'), 'DESC']]

    })
    .then(recommends => {
      let popularActivities = []
      let recommendActivities = []
      res.json({ popularActivities: results.slice(0, 10), recommendActivities: recommends, allActivities: results })
    })
  })

}
