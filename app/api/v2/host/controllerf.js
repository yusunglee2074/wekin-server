const model = require('../../../model')
const service = require('../service')

exports.findAllHost = (req, res, next) => {
  model.Host.findAll({
    attributes: ['host_key', 'profile_image', 'name'],
    where: { status: 3 },
    include: { model: model.Activity }
  }).then((results) => res.json(results))
    .catch((err) => next(err))
}

exports.createHost = (req, res, next) => {
  let requestData = req.body
  let user = req.user
  let modelData = {
    introduce: requestData.introduce,
    history: requestData.history,
    profile_image: requestData.host_profile_image,
    name: requestData.host_name,
    tel: requestData.host_tel,
    address: requestData.host_address,
    home_page: requestData.host_home_page,
    sns: requestData.host_sns,
    email: requestData.host_email,
    business_registration: requestData.business_registration,
    license: requestData.license,
    type: requestData.type,
    join_method: requestData.join_method,
    user_key: user.user_key,
    status: 1,
    language: requestData.language
  }
  model.Host.create(modelData)
    .then(result => {
      let msg = `[위킨] ${result.name} 메이커 등록승인을 요청 하였습니다.`
      service.utilService.sendWekinMail(msg, msg)
      res.json(result)
    })
    .catch(e => {
      next(e)
    })
}

exports.updateHost = (req, res, next) => {
  let host = req.body
  let queryOptions = { where: { host_key: req.params.host_key } }
  let modelData = {
    introduce: host.introduce,
    history: host.history,
    profile_image: host.host_profile_image,
    name: host.host_name,
    tel: host.host_tel,
    address: host.host_address,
    home_page: host.host_home_page,
    sns: host.host_sns,
    email: host.host_email,
    business_registration: host.business_registration,
    license: host.license,
    type: host.type,
    join_method: host.join_method,
    language: host.language
  }
  model.Host.update(modelData, queryOptions)
    .then((results) => res.json(results))
    .catch((err) => next(err))
}

exports.findAllActivity = (req, res, next) => {
  model.ActivityNew.findAll({
    group: ['ActivityNew.activity_key', 'Host.host_key', 'Favorites.fav_key'],
    attributes: [
      'activity_key', 'status', 'host_key', 'main_image', 'title', 'intro_summary', 'address', 'address_detail', 'base_price', 'created_at', 'cagtegory',
      [model.Sequelize.fn('AVG', model.Sequelize.col('Docs.activity_rating')), 'rating_avg'],
      [model.Sequelize.fn('COUNT', model.Sequelize.col('Docs.doc_key')), 'review_count']
    ],
    where: { host_key: req.params.host_key, status: { $ne: service.activityStatus.deletion.code } },
    include: [{ model: model.Host }, { model: model.Favorite }, { model: model.Doc, attributes: [], where: { type: service.docType.review.code }, required: false }]
  }).then(results => res.json({ results: results }))
    .catch(err => next(err))
}
exports.findAllReview = (req, res, next) => {
  let queryOptions = {
    where: { host_key: req.params.host_key },
    attributes: ['activity_key']
  }
  model.Activity.findAll(queryOptions)
    .then((results) => {
      let activityKeys = results.map(activity => {
        return activity.activity_key
      })
      // let activityKey = results.dataValues.activity_key
      let queryOptions = {
        where: { activity_key: { in: activityKeys }, type: 1 },
        order: [['created_at', 'DESC']],
        group: ['Doc.doc_key', 'User.user_key'],
        attributes: [
          'doc_key',
          'activity_key',
          'activity_title',
          'activity_rating',
          'image_url',
          'tags',
          'content',
          'user_key',
          'private_mode',
          'status',
          'type',
          'created_at',
          [
            model.Sequelize.fn('COUNT', model.Sequelize.col('Likes.doc_key')), 'like_count'
          ],
          [
            model.Sequelize.fn('COUNT', model.Sequelize.col('Comments.doc_key')), 'comment_count'
          ]
        ],
        include: [
          {
            model: model.Like,
            attributes: []
          },
          {
            model: model.Comment,
            attributes: []
          },
          {
            model: model.User,
            attributes: ['user_key', 'profile_image', 'name']
          }]
      }
      model.Doc.findAll(queryOptions)
        .then(results => res.json({ results: results }))
        .catch(err => next(err))
    })
    .catch((err) => next(err))
}

exports.findAllQna = (req, res, next) => {
  let queryOptions = {
    limit: req.query.size || 7,
    offset: (req.query.page || 0) * (req.query.size || 7),
    order: [['created_at', 'DESC']],
    where: { host_key: req.params.host_key, type: service.docType.qna.code },
    include: { model: model.User }
  }
  model.Doc.findAll(queryOptions)
    .then(results => res.json({ results: results }))
    .catch(err => next(err))
}

exports.updateAnswer = (req, res, next) => {
  let modelData = { answer: req.body.answer }
  let queryOptions = { where: { doc_key: req.params.doc_key, host_key: req.user.Host.host_key } }
  model.Doc.update(modelData, queryOptions)
    .then((results) => res.json(results))
    .catch((err) => next(err))
}

exports.findHost = (req, res, next) => {
  model.Host.findOne({
    where: { host_key: req.params.host_key, status: { $ne: 4 } },
    include: { model: model.User }
  }).then((results) => res.json(results))
    .catch((err) => next(err))
}

exports.findAllHostFeed = (req, res, next) => {
  model.Host.findOne({
    where: { host_key: req.params.host_key },
    attributes: ['user_key']
  }).then(results => {
    let userKey = results.dataValues.user_key
    let queryOptions = {
      where: { user_key: userKey, type: 0 },
      order: [['created_at', 'DESC']],
      group: ['Doc.doc_key', 'Likes.like_key', 'User.user_key'],
      attributes: [
        'doc_key', 'activity_key', 'activity_title', 'activity_rating',
        'images', 'image_url', 'medias', 'tags', 'content', 'user_key', 'private_mode',
        'status', 'type', 'created_at',
        [model.Sequelize.fn('COUNT', model.Sequelize.col('Comments.comment_key')), 'comment_count']
      ],
      include: [
        {
          model: model.Like,
          duplicating: false
        },
        {
          model: model.Comment,
          attributes: [],
          duplicating: false
        },
        {
          model: model.User,
          attributes: ['user_key', 'profile_image', 'name'],
          duplicating: false
        }]
    }
    model.Doc.findAll(queryOptions)
      .then(results => res.json({ results: results }))
      .catch(err => next(err))
  })
    .catch(err => next(err))
}

exports.findAllReservation = (req, res, next) => {
  let queryOptions = {
    group: ['date'],
    attributes: [[model.Sequelize.fn('to_char', model.Sequelize.col('order_at'), 'YYYY-MM-DD'), 'date']],
    // attributes: [[model.Sequelize.fn('date_trunc', 'hour', model.Sequelize.col('order_at')), 'date']],
    where: { host_key: req.params.host_key, status: { $in: ['order', 'ready', 'paid'] } }
  }
  model.Order.count(queryOptions)
    .then(results => res.json({ results: results }))
    .catch(err => next(err))
}

/** 누적 팔로우수 기준으로 상위 20개 선정 후, 10개를 랜덤으로 표시
 * host: profile, name
 * activity: image, title
 */
exports.popularMaker = (req, res, next) => {
  model.Host.findAll({
    order: [
      [model.Sequelize.fn('COUNT', model.Sequelize.col('User->Follows.follow_key')), 'DESC']
    ],
    attributes: ['host_key', 'profile_image', 'name',
      [model.Sequelize.fn('COUNT', model.Sequelize.col('User->Follows.follow_key')), 'follow_count']
    ],
    group: ['Host.host_key', 'Activities.activity_key', 'User.user_key', 'Activities->Wekins.wekin_key'],
    include: [
      {
        attributes: ['activity_key', 'title', 'main_image'],
        model: model.Activity,
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
    .then(results => res.json({ results: results }))
    .catch(err => next(err))
}
