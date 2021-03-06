const model = require('../../../model')
const service = require('../service')
const moment = require('moment')
const cache = require('memory-cache')

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
      ttributes: [
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


// 검색 api 따로 뺌
//
exports.searchActivityWithTitle = (req, res, next) => {
  model.ActivityNew.findAll({
    where: {
      status: 3 || 5,
      title: { $like: `%${req.query.keyword}%` }
    },
    include: ['Host']
  })
    .then(activities => {
      res.json(activities)
    })
    .catch(error => next(error))
}

// 리펙토링
// 엑티비티 리스트
exports.findAllActivity = (req, res, next) => {
  if (cache.get('allActivities')) {
    res.json(cache.get('allActivities'))
  } else {
    model.ActivityNew.findAll({
      where: {
        status: 3 || 5,
      },
      include: [
        {
          attributes: ['host_key', 'profile_image', 'user_key', 'name'],
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
        }, {
          model: model.WekinNew,
          attributes: [],
          where: { state: 'paid' },
          required: false,
          duplicating: false
        }, {
          model: model.Favorite,
          attributes: ['fav_key'],
          required: false,
        }
      ],
      attributes: {
        include: [
          [model.Sequelize.fn('COUNT', model.Sequelize.col('Docs.doc_key')), 'review_count'],
          [model.Sequelize.fn('sum', model.Sequelize.col('WekinNews.pay_amount')), 'wekinnew_count']
        ],
        exclude: ['intro_detail', 'schedule', 'inclusion', 'preparation', 'refund_policy', 'category_two', 'start_date', 'end_date', 'base_start_time', 'base_min_user', 'base_max_user', 'base_price_option', 'base_extra_price_option', 'base_week_option', 'close_dates', 'is_it_ticket', 'ticket_due_date', 'ticket_max_apply', 'comision', 'detail_question', 'deleted_at', 'intro_summary']
      },
      group: ['ActivityNew.activity_key', model.Sequelize.col('Docs.activity_key'), 'Host.host_key', 'Favorites.fav_key'],
    })
      .then(activities => {
        cache.put('allActivities', activities, 30000)
        res.json(activities)
      })
      .catch(error => next(error))
  }
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
        where: { state: { $in: ['ready', 'paid'] } },
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
// ['투어/여행', '익스트림', '스포츠', '음악', '댄스', '뷰티', '요리', '아트', '축제', '힐링', '아웃도어', '요가/피트니스', '소품제작']
// categoryDetail = {
//0: '투어/여행',
//1: '익스트림',
//2: '스포츠',
//3: '음악',
//4: '댄스',
//5: '뷰티',
//6: '요리',
//7: '아트',
//8: '축제',
//9: '힐링',
//10: '아웃도어',
//11: '요가/피트니스',
//12: '소품제작'
// }
exports.getActivityWithDetailCateogry = (req, res, next) => {
  let categoryDetail = {
    0: '투어/여행',
    1: '익스트림',
    2: '스포츠',
    3: '음악',
    4: '댄스',
    5: '뷰티',
    6: '요리',
    7: '아트',
    8: '축제',
    9: '힐링',
    10: '아웃도어',
    11: '요가/피트니스',
    12: '소품제작',
    13: '한국체험'
  }
  model.ActivityNew.findAll({
    where: {
      category: categoryDetail[req.params.key]
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
        duplicating: false
      }],
    attributes: {
      include: [
        [model.Sequelize.fn('AVG', model.Sequelize.col('Docs.activity_rating')), 'rating_avg'],
        [model.Sequelize.fn('COUNT', model.Sequelize.fn('DISTINCT', model.Sequelize.col('Docs.doc_key'))), 'review_count']
      ]
    },
    group: ['ActivityNew.activity_key', 'Docs.doc_key', 'Host.host_key'],
    limit: req.params.how_many || 1000,
    offset: req.params.offset * req.params.how_many || 0,
    order: [['created_at', 'DESC']],
  })
    .then(results => {
      res.json({ message: 'success', data: results})
    })
    .catch(error => next(error))
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
        $in: category[categoryKey],
      },
      status: 3
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
        duplicating: false
      }],
    attributes: {
      include: [
        [model.Sequelize.fn('AVG', model.Sequelize.col('Docs.activity_rating')), 'rating_avg'],
        [model.Sequelize.fn('COUNT', model.Sequelize.fn('DISTINCT', model.Sequelize.col('Docs.doc_key'))), 'review_count']
      ]
    },
    group: ['ActivityNew.activity_key', 'Docs.doc_key', 'Host.host_key'],
    limit: req.params.how_many || 1000,
    offset: req.params.offset * req.params.how_many || 0,
    order: [['created_at', 'DESC']],
  })
  .then(result => {
    res.json({ message: 'success', data: result })
  })
  .catch(error => next(error))
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
    start_date: moment(requestData.start_date),
    end_date: moment(requestData.end_date),
    due_date: requestData.due_date,
    base_start_time: moment().set(1, 'hours').set(00, 'minites'),
    base_price: requestData.base_price,
    price_before_discount: null,
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
    close_dates.push(Number(moment(data.close_dates[i]).add(9, 'hour').format('YYMMDD')))
  }
  for (i in data.base_week_option) {
    if (data.base_week_option[i].start_time.length) {
      week[i] = 1
    } else {
      week[i] = 0
    }
  }
  var start_day = moment(data.start_date).add(9, 'hour').clone()
  for (let a = 0; a < count_days + 1; a++) {
    if (week[start_day.format('dddd').slice(0, 2)] === 1 && !close_dates.includes(Number(start_day.format('YYMMDD')))) {
      let clone_start_day = start_day.clone()
      start_date_list.push(clone_start_day.add(-9, 'hour'))
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
    address: requestData.address,
    refund_policy: requestData.refund_policy,
    price: requestData.price,
    isteamorpeople: requestData.isteamorpeople,
    status: requestData.status,
    category: requestData.category,
    category_two: requestData.category2,
    start_date: moment(requestData.start_date),
    end_date: moment(requestData.end_date),
    due_date: requestData.due_date,
    base_start_time: requestData.base_start_time,
    base_price: requestData.base_price,
    base_min_user: requestData.base_min_user,
    base_max_user: requestData.base_max_user,
    base_price_option: requestData.base_price_option,
    price_before_discount: null,
    base_extra_price_option: requestData.base_extra_price_option,
    base_week_option: requestData.base_week_option,
    close_dates: requestData.close_dates,
    is_it_ticket: requestData.is_it_ticket,
    ticket_due_date: requestData.ticket_due_date,
    ticket_max_apply: requestData.ticket_max_apply,
    comision: requestData.comision,
    start_date_list: requestData.start_date_list,
    status_wetiful: requestData.status_wetiful,
    detail_question: requestData.detail_question,
    confirm_date: requestData.confirm_date,
  }
  if (requestData.point_rate) activityModelData.point_rate = requestData.point_rate
  for (let i = 0; i < activityModelData.close_dates.length; i++) {
    let item = activityModelData.close_dates
    item[i] = Number(moment(item[i]).add(9, 'hour').format('YYMMDD'))
  }

  let start_date_list = []
  let count_days = moment(activityModelData.end_date).diff(activityModelData.start_date, 'days')
  let week = {}
  for (i in activityModelData.base_week_option) {
    if (activityModelData.base_week_option[i].start_time.length) {
      week[i] = 1
    } else {
      week[i] = 0
    }
  }
  var start_day = moment(activityModelData.start_date).add(9, 'hour').clone()
  for (let a = 0; a < count_days + 1; a++) {
    if (week[start_day.format('dddd').slice(0, 2)] === 1 && !activityModelData.close_dates.includes(Number(start_day.format('YYMMDD')))) {
      let clone_start_day = start_day.clone()
      start_date_list.push(clone_start_day.add(-9, 'hour'))
      start_day = start_day.add(1, 'days')
    } else {
      start_day = start_day.add(1, 'days')
    }
  }
  activityModelData.start_date_list = start_date_list

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
  model.ActivityNew.destroy(queryOptions)
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
    group: ['ActivityNew.activity_key', 'Host.host_key', 'Host->User.user_key', 'Docs.doc_key'],
    where: { activity_key: req.params.activity_key },
    attributes: {
      include: [
        [model.Sequelize.fn('AVG', model.Sequelize.col('Docs.activity_rating')), 'rating_avg'],
        [model.Sequelize.fn('COUNT', model.Sequelize.col('Favorites.fav_key')), 'fav_count'],
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
        attributes: ['doc_key'],
        where: { type: service.docType.review.code },
        required: false
      },
      {
        model: model.Favorite,
        attributes: [],
        where: { activity_key: req.params.activity_key },
        required: false
      }
    ]
  }
  model.ActivityNew.findOne(queryOptions)
    .then(result => {
      model.ActivityNew.increment('count', { where: { activity_key: req.params.activity_key } })
        .then(r => {
          result.dataValues.review_count = result.Docs.length
          res.json(result)
        })
        .catch(err => {
          if (err.message == "Cannot read property 'dataValues' of null") {
            res.status(502).json({ message: "Given activity_key is not match any activity in DB", data: null})
            return
          }
          next(err)
        })
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

exports.findWekiner = (req, res, next) => {
  let queryOptions = {
    where: { activity_key: req.params.wekin_key, state: 'paid' },
    include: [
      { model: model.User, attributes: ['profile_image', 'user_key', 'name', 'phone'] },
      { model: model.ActivityNew }
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
      status: {
        $in: [3,5]
      }
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
