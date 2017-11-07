const model = require('../../../model')
const returnMsg = require('../../../return.msg')
const { notiService } = require('../service')
const { pageable } = require('../util/page')
const datatable = require(`sequelize-datatables`)

/**
 * environment 타입 리스트
 */
const NAME_MAP = ['notice', 'faq']


exports.docDelete = (req, res) => {
  model.Doc.destroy({
    where: {
      doc_key: req.params.doc_key
    },
    returning: true
  })
    .then(r => {
      let data = (r === 1) ? 'success' : 'fail'
      returnMsg.success200RetObj(res, { res: data })
    })
    .catch(e => {
      console.log(e)
    })
}

exports.listData = (req, res) => {
  model.Doc.findAll({
    where: { type: { $notIn: [2] } },
    include: [{ model: model.Activity, include: { model: model.Host } }, { model: model.User }]
  })
    .then(result => {
      returnMsg.success200RetObj(res, result)
    })
    .catch(val => { console.log(val) })
}

exports.qnaListData = (req, res) => {
  model.Doc.findAll({
    where: { type: 2 },
    include: [
      { model: model.Activity, include: { model: model.Host } }, { model: model.User }
    ]
  })
    .then(result => returnMsg.success200RetObj(res, result))
    .catch(val => { console.log(val) })
}

exports.getFrontDocuments = (req, res, next) => {
  let options = req.fetchParameter(['type'])
  if (req.checkParamErr(options)) return next(options)

  let queryOptions = {
    where: { type: { in: arraySeparator(options.type) } },
    order: [['created_at', 'DESC']],
    group: ['Doc.doc_key', 'User.user_key'],
    subQuery: false,
    limit: req.query.size || 10,
    offset: (req.query.page || 0) * (req.query.size || 10),
    attributes: [
      'doc_key', 'activity_key', 'activity_title', 'activity_rating',
      'images', 'image_url', 'medias', 'tags', 'content', 'user_key', 'private_mode',
      'status', 'type', 'created_at',
      [model.Sequelize.fn('COUNT', model.Sequelize.col('Comments.comment_key')), 'comment_count']
    ],
    include: [
      {
        model: model.Comment,
        attributes: []
      },
      {
        model: model.User,
        attributes: ['user_key', 'profile_image', 'name']
      }
    ]
  }
  // 액티비티 키가 있으면, 해당 액티비티에서 선택
  if (req.query.activity_key) {
    queryOptions.where.activity_key = req.query.activity_key
  }
  model.Doc.findAll(queryOptions)
    .then(results => res.json({ results: results }))
    .catch(err => next(err))
}

exports.postDocuments = (req, res, next) => {
  req.checkBody('content', '내용은 필수입니다.').notEmpty()
  req.checkBody('type', '타입은 필수입니다.').notEmpty()
  req.getValidationResult().then(result => {
    if (!result.isEmpty()) {
      res.status(400).json(util.inspect(result.array()))
      return
    }
    let feed = req.body
    let user = req.user
    let tags = hashSeparator(feed.content)

    let modelData = {
      user_key: user.user_key,
      activity_key: feed.activity_key,
      activity_title: feed.activity_title,
      activity_rating: feed.activity_rating,
      content: feed.content,
      image_url: feed.image_url,
      medias: feed.medias,
      tags: tags,
      host_key: feed.host_key,
      type: feed.type,
      private_mode: feed.private_mode,
      status: feed.status
    }
    model.Doc.create(modelData)
      .then(result => {
        if (result.type === 1) {        // 후기일경우
          notiService.postNotiActiviryKey(result.user_key, result.activity_key, '후기')
        } else if (result.type === 2) { // 질문일경우
          notiService.postNotiActiviryKey(result.user_key, result.activity_key, '질문')
        }
        res.status(201).json(result)
      })
      .catch(err => {
        next(err)
      })
  })
}

exports.searchDocuments = (req, res, next) => {
  let rawQuery = `select * from "doc" as "Doc" LEFT OUTER JOIN "user" AS "User" ON "Doc"."user_key" = "User"."user_key" where '#${req.query.hash}' = ANY(tags)`
  model.sequelize.query(rawQuery, { model: model.Doc })
    .then(results => res.json(results))
    .catch((err) => next(err))
}

exports.getUsersDocuments = (req, res, next) => {
  let queryOptions = {
    where: { type: { in: [0, 1] } },
    order: [['created_at', 'DESC']],
    group: ['Doc.doc_key', 'User.user_key'],
    limit: req.query.size || 10,
    offset: (req.query.page || 0) * (req.query.size || 10),
    attributes: [
      'doc_key', 'activity_key', 'activity_title', 'activity_rating',
      'images', 'image_url', 'medias', 'tags', 'content', 'user_key', 'private_mode',
      'status', 'type', 'created_at',
      [model.Sequelize.fn('COUNT', model.Sequelize.col('Comments.comment_key')), 'comment_count']
    ],
    include: [
      {
        model: model.Comment,
        attributes: [],
        duplicating: false
      },
      {
        model: model.User,
        where: { user_key: req.params.user_key },
        attributes: ['user_key', 'profile_image', 'name'],
        duplicating: false
      }]
  }

  model.Doc.findAll(queryOptions)
    .then(results => res.json(results))
    .catch(err => next(err))
}

exports.documentsDetail = (req, res, next) => {
  let feedKey = req.params.doc_key
  let queryOptions = {
    where: { doc_key: feedKey },
    order: [['created_at', 'DESC']],
    group: ['Doc.doc_key', 'Likes.like_key', 'User.user_key'],
    limit: req.query.size || 10,
    offset: (req.query.page || 0) * (req.query.size || 10),
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
  model.Doc
    .findOne(queryOptions)
    .then(result => res.status(201).json(result))
    .catch(err => next(err))
}

exports.putDocuments = (req, res, next) => {
  let feed = req.body
  let user = req.user
  let tags = hashSeparator(feed.content)
  let data = {
    activity_key: feed.activity_key,
    activity_title: feed.activity_title,
    activity_rating: feed.activity_rating,
    content: feed.content,
    image_url: feed.image_url,
    tags: tags,
    private_mode: feed.private_mode
  }
  let queryOptions = {
    where: { user_key: user.user_key, doc_key: req.params.doc_key }
  }
  model.Doc
    .update(data, queryOptions)
    .then(result => res.status(200).json(result))
    .catch(err => next(err))
}

exports.deleteDocuments = (req, res, next) => {
  let user = req.user
  let queryOptions = {
    where: { user_key: user.user_key, doc_key: req.params.doc_key }
  }
  model.Doc.destroy(queryOptions)
    .then(result => res.status(200).json(result))
    .catch(err => next(err))
}

exports.getComments = (req, res, next) => {
  let feedKey = req.params.doc_key
  model.Comment.findAndCountAll({
    order: [['created_at', 'DESC']],
    where: { doc_key: feedKey },
    limit: req.query.size || 3,
    offset: (req.query.page || 0) * (req.query.size || 3)
  })
    .then(results => res.json(results))
    .catch(err => next(err))
}

exports.postComment = (req, res, next) => {
  req.checkBody('content', '내용을 입력해주세요.').notEmpty()
  req.getValidationResult().then(result => {
    if (!result.isEmpty()) {
      res.status(400).send('올바르지 않은 요청입니다.') // FIXME: error 대상만 에러를 던지던가 올바르지 않은 요청 하나만 보내기
      return
    }
    let comment = req.body
    model.Comment.create({
      doc_key: req.params.doc_key,
      content: comment.content,
      user_key: req.user.user_key,
      user_name: req.user.name,
      user_profile_image: req.user.profile_image
    })
      .then(result => {
        notiService.wekinTagComment(result.user_key, result.doc_key)
        res.status(201).json(result)
      })
      .catch(err => next(err))
  })
  .catch(error => next(error))
}

exports.putComment = (req, res, next) => {
  req.checkBody('content', '내용을 입력해주세요.').notEmpty()
  req.getValidationResult().then(result => {
    if (!result.isEmpty()) {
      res.status(400).send('올바르지 않은 요청입니다.') // FIXME: error 대상만 에러를 던지던가 올바르지 않은 요청 하나만 보내기
      return
    }
    let user = req.user
    let comment = req.body
    let queryOptions = {
      where: { user_key: user.user_key, comment_key: req.params.comment_key }
    }
    model.Comment.update({
      content: comment.content,
      user_profile_image: req.user.profile_image
    }, queryOptions)
      .then(result => res.status(200).json(result))
      .catch(err => next(err))
  })
}

exports.deleteComment = (req, res, next) => {
  let user = req.user
  let queryOptions = {
    where: { user_key: user.user_key, comment_key: req.params.comment_key }
  }
  model.Comment.destroy(queryOptions)
    .then(result => res.status(200).json(result))
    .catch(err => next(err))
}


exports.getLikes = (req, res, next) => {
  let feedKey = req.params.doc_key
  model.Like.findAndCountAll({
    order: [['created_at', 'DESC']],
    where: { doc_key: feedKey }
  }).then(results => res.json(results))
    .catch(err => next(err))
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
        code: 'ERROR_INVALID_PARAM',
        msg: 'ERROR_INVALID_PARAM'
      })
  })
}

/**
 * 텍스트에서 #으로 적힌 내용을 분리하여 배열을 반환한다.
 * @param {string} text
 * @return {string[]}
 */
function hashSeparator(text) {
  const hashRegExp = /(#\S+)/g
  return text.match(hashRegExp)
}
/**
 * ,로 구분 된 파라미터 배열을 분리하여 Number 배열을 반환한다.
 * @param {string[]} array
 * @return {number[]}
 */
function arraySeparator(array) {
  if (array == null || array === undefined) return
  return array.split(',').map(Number)
}
