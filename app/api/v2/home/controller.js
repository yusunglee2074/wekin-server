const model = require('../../../model')
const returnMsg = require('../../../return.msg')
const moment = require('moment')
const { wekinService, activityService } = require('../service')
const { getMainActivityModel } = require('./service')

/*
// 검색일시 기준, 일정이 남아있는 위킨만 대상으로 누적 관심(즐겨찾기) 수 상위 5개 단, 한달이내
exports.popularActivity = (req, res) => {
  let nextMonth = moment().add('months', 1).format('YYYY-MM-DD')
  let now = moment().format('YYYY-MM-DD')

  model.Activity.findAll({
    order: [[model.Sequelize.fn('COUNT', model.Sequelize.col('Docs.doc_key')), 'desc'], ['Wekins', 'start_date', 'asc']],
    group: ['Activity.activity_key', 'Host.host_key', 'Favorites.fav_key', 'Wekins.wekin_key', 'Wekins->Orders.order_key'],
    attributes: [
      'activity_key', 'status', 'host_key', 'main_image', 'title', 'intro_summary', 'address', 'address_detail', 'price', 'created_at',
      [model.Sequelize.fn('AVG', model.Sequelize.col('Docs.activity_rating')), 'rating_avg'],
      [model.Sequelize.fn('COUNT', model.Sequelize.col('Docs.doc_key')), 'review_count']
    ],
    where: { status: 3 },
    include: [
      {
        where: {
          activity_key: { $in: model.Sequelize.literal(`(SELECT DISTINCT "activity_key" FROM "wekin" WHERE "start_date" > '${now}' and "start_date" < '${nextMonth}')`) },
          start_date: {$gt: new Date()}, $and: {start_date: {$lt: nextMonth}}
        },
        model: model.Wekin,
        order: [['start_date', 'desc']],
        attributes: ['wekin_key', 'activity_key', 'min_user', 'max_user', 'start_date', 'due_date', 'commission',
          [model.Sequelize.fn('SUM', model.Sequelize.col('Wekins->Orders.wekin_amount')), 'current_user']
        ],
        include: 
          { model: model.Order, attributes: [], where: { status: { $in: ['order', 'ready', 'paid'] } }, required: false },
      },
      { model: model.Host }, { model: model.Favorite }, { model: model.Doc, attributes: [], where: { type: 1 }, required: false }
    ]
  })
  .then(results => {
    returnMsg.success200RetObj(res, results)
  })
  .catch(err => console.log(err))
  /*
  model.Wekin.findAll({
    order: [[model.Sequelize.fn('COUNT', model.Sequelize.col('Activity->Favorites.fav_key')), 'DESC']],
    attributes: [
      [model.Sequelize.fn('COUNT', model.Sequelize.col('Activity->Favorites.fav_key')), 'fav_count']
    ],
    group: ['Wekin.wekin_key', 'Activity.activity_key'],
    where: {
      start_date: {$gt: new Date()}, $and: {start_date: {$lt: nextMonth}}},
    include: [{
      attributes: ['activity_key'],
      model: model.Activity,
      include: { model: model.Favorite, attributes: [] }}]
  })
  .then(r => {
    let act = new Set()
    r.forEach(v => { act.add(v.Activity.activity_key) })
    return act
  })
  .then(r => {
    let arr = []
    r.forEach(v => {
      arr.push(getMainActivityModel(v))
    })
    return Promise.all(arr)
  })
  .then(r => {
    returnMsg.success200RetObj(res, r.slice(0, 5))
  })
  .catch(r => { console.log(r) })
}
*/

// 리펙토링
// 인기 위킨
// 달려있는 위킨 갯수(결제 횟수) 상위 30 위킨을 뽑아 보여줌 단
exports.popularActivity = (req, res, next) => {
  model.ActivityNew.findAll({
    order: [[model.Sequelize.fn('COUNT', model.Sequelize.col('WekinNews.wekin_key')), 'desc']],
    group: ['ActivityNew.activity_key', 'Host.host_key', 'Favorites.fav_key'],
    attributes: {
      include: [
        [model.Sequelize.fn('AVG', model.Sequelize.col('Docs.activity_rating')), 'rating_avg'],
        [model.Sequelize.fn('COUNT', model.Sequelize.col('Docs.doc_key')), 'review_count']
      ]
    },
    where: { status: 3 },
    include: [
      { model: model.Doc, attributes: [], where: { type: 1 }, required: false },
      { model: model.WekinNew, attributes: [], required: false },
      { model: model.Host, attributes: ['host_key', 'profile_image'] }, { model: model.Favorite, attributes: ['fav_key'] }
    ]
  })
  .then(results => {
    returnMsg.success200RetObj(res, results)
  })
  .catch(err => next(err))
}


/** 누적 팔로우수 기준으로 상위 20개 선정 후, 10개를 랜덤으로 표시
 * host: profile, name
 * activity: image, title
 */ 
exports.popularMaker = (req, res) => {
  model.Host.findAll({
    order: [
      [model.Sequelize.fn('COUNT', model.Sequelize.col('User->Follows.follow_key')), 'DESC']
    ],
    attributes: ['host_key', 'profile_image', 'name', 'introduce',
      [ model.Sequelize.fn('COUNT', model.Sequelize.col('User->Follows.follow_key')), 'follow_count' ]
    ],
    group: ['Host.host_key', 'Activities.activity_key', 'User.user_key', 'Activities->Wekins.wekin_key'],
    where: {status: 3},
    include: [
      {
        where: {status: 3 },
        attributes: ['activity_key', 'title', 'main_image'],
        model: model.Activity,
        required: true,
        include: {
          model: model.Wekin,
          where: {
            due_date: {
              $gt: new Date()
            }
          }
        }
      }, {
        attributes: ['user_key', 'name'],
        model: model.User,
        include: { model: model.Follow, attributes: [] }
       }
    ]
  })
  .then(r => {
    r.slice(0, 20 )
    r = shuffleArray(r)
    returnMsg.success200RetObj(res, r.slice(0, 10)) 
  })
  .catch(r => { console.log(r) })
}

/** 검색일시 기준, 이전 한달 내에 작성 또는 좋아요가 눌러진 피드를 대상으로 누적 좋아요수 상위 10개 선정 후, 5개를 랜덤으로 표시
 * doc : 내용
 * user : 이름, 프로필
 * like : 좋아요수
 * comment : 댓글수
 */ 
exports.popularFeed = (req, res) => {
  let daybefore30 = moment().add({days: -30})
  
  model.Doc.findAll({
    // order: [[model.Sequelize.fn('COUNT', model.Sequelize.col('Likes.like_key')), 'DESC']],
    group: ['Doc.doc_key', 'User.user_key', 'Likes.like_key'],
    attributes: ['doc_key', 'content', 'tags', 'created_at', 'image_url',
      // [model.Sequelize.fn('COUNT', model.Sequelize.col('Likes.like_key')), 'like_count'],
      [model.Sequelize.fn('COUNT', model.Sequelize.col('Comments.comment_key')), 'comment_count']
    ],
    include: [
      {
        attributes: ['user_key', 'profile_image', 'name'],
        model: model.User
      }, {
        model: model.Like, attributes: ['user_key']
      }, {
        model: model.Comment, attributes: []
      }],
    where: {created_at : {$gt: daybefore30}, private_mode: false, type: 0}
  })
  .then(r => {
    r.slice(0, 10)
    r = shuffleArray(r)
    returnMsg.success200RetObj(res, r.slice(0, 5))
  })
  .catch(r => { console.log(r) })

}


/*
// 위킨 승인 완료 일시 기준으로 7개 표시
exports.newestActivity = (req, res) => {
  model.Activity.findAll({
    order: [['confirm_date', 'desc'], ['Wekins', 'start_date', 'asc']],
    group: ['Activity.activity_key', 'Host.host_key', 'Favorites.fav_key', 'Wekins.wekin_key', 'Wekins->Orders.order_key'],
    attributes: [
      'activity_key', 'status', 'host_key', 'main_image', 'title', 'intro_summary', 'address', 'address_detail', 'price', 'created_at', 'confirm_date',
      [model.Sequelize.fn('AVG', model.Sequelize.col('Docs.activity_rating')), 'rating_avg'],
      [model.Sequelize.fn('COUNT', model.Sequelize.col('Docs.doc_key')), 'review_count']
    ],
    where: { status: 3 },
    include: [
      {
        model: model.Wekin,
        attributes: ['wekin_key', 'activity_key', 'min_user', 'max_user', 'start_date', 'due_date', 'commission',
          [model.Sequelize.fn('SUM', model.Sequelize.col('Wekins->Orders.wekin_amount')), 'current_user']
        ],
        include: 
          { model: model.Order, attributes: [], where: { status: { $in: ['order', 'ready', 'paid'] } }, required: false }
      },
      { model: model.Host }, { model: model.Favorite }, { model: model.Doc, attributes: [], where: { type: 1 }, required: false }
    ]
  })
  .then(results => {
    returnMsg.success200RetObj(res, results.slice(0, 7))
  })
  .catch(err => console.log(err))
}

function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1))
    var temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
  return array
}
*/
// 리펙토링
// 최신 위킨 승인날짜 기준 7개 가져옴 
exports.newestActivity = (req, res, next) => {
  model.ActivityNew.findAll({
    order: [['confirm_date', 'desc']],
    group: ['ActivityNew.activity_key', 'Host.host_key', 'Favorites.fav_key'],
    attributes: {
      include: [
        [model.Sequelize.fn('AVG', model.Sequelize.col('Docs.activity_rating')), 'rating_avg'],
        [model.Sequelize.fn('COUNT', model.Sequelize.col('Docs.doc_key')), 'review_count']
      ]
    },
    where: { status: 3 },
    include: [
      { model: model.Doc, attributes: [], where: { type: 1 }, required: false },
      { model: model.WekinNew, attributes: [], required: false },
      { model: model.Host, attributes: ['host_key', 'profile_image'] }, { model: model.Favorite, attributes: ['fav_key'] }
    ]
  })
  .then(results => {
    returnMsg.success200RetObj(res, results)
  })
  .catch(err => next(err))
}

function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1))
    var temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
  return array
}
