const model = require('../../../model')
const service = require('../service')
const util = require('util')
const fireHelper = require('../../../util/firebase')

exports.getQna = (req, res, next) => {
  const token = req.headers['x-access-token'] || req.query.token
  const activityKey = req.query.activityKey

  let queryOptions = {
    where: { type: service.docType.qna.code },
    order: [['created_at', 'DESC']],
    limit: req.query.size || 10,
    offset: (req.query.page || 0) * (req.query.size || 10),
    attributes: [
      'doc_key',
      'content',
      'user_key',
      'private_mode',
      'status',
      'answer',
      'created_at',
      'updated_at'
    ],
    include: [{
      model: model.User,
      attributes: ['user_key', 'name', 'profile_image']
    }]
    // offset: 0,
    // limit: 5
  }

  // 액티비티 키가 있으면 검색 조건에 추가해준다.
  if (activityKey) {
    queryOptions.where.activity_key = activityKey
  }

  // 토큰이 없을 경우
  if (!token) {
    model.Doc.findAndCountAll(queryOptions)
      .then(results => {
        results.rows.map(docs => {
          if (docs.private_mode) {
            docs = docs.content = '비밀글 입니다.'
          }
        })
        res.json(results)
      })
      .catch(err => next(err))
  } else {
    fireHelper.verifyFireToken(token)
      .then(decoded => {
        model.User.findOne({
          where: { uuid: decoded.sub },
          include: { model: model.Host }
        }).then(user => {
          model.Doc.findAndCountAll(queryOptions)
            .then(docs => {
              docs.rows.map(doc => {
                if (doc.private_mode && doc.user_key !== user.dataValues.user_key) {
                  doc = doc.content = '비밀글 입니다.'
                }
              })
              res.json(docs)
            }).catch(err => next(err))
        }).catch(err => next(err))
      })
      .catch(() => {
        model.Doc.findAndCountAll(queryOptions)
          .then(results => {
            results.rows.map(docs => {
              if (docs.private_mode) {
                docs = docs.content = '비밀글 입니다.'
              }
            })
            res.json(results)
          })
          .catch(err => next(err))
      })
  }
}
exports.postQna = (req, res, next) => {
  req.checkBody('content', '내용은 필수입니다.').notEmpty()
  req.getValidationResult().then(result => {
    if (!result.isEmpty()) {
      res.status(400).json(util.inspect(result.array()))
      return
    }
    let doc = req.body
    let user = req.user

    if (doc.private_mode === '') {
      doc.private_mode = false
    }
    let modelData = {
      user_key: user.user_key,
      activity_key: req.params.activity_key,
      activity_title: doc.activity_title,
      host_key: doc.host_key,
      content: doc.content,
      private_mode: doc.private_mode,
      type: 2,  // type:2 == qna
      status: 0
    }

    model.Doc.create(modelData)
      .then(result => res.status(201).json(result))
      .catch(err => next(err))
  })
}
exports.deleteQna = (req, res, next) => {
  let user = req.user
  let queryOptions = {
    where: { user_key: user.user_key, doc_key: req.params.doc_key }
  }
  model.Doc.destroy(queryOptions)
    .then(result => res.status(200).json(result))
    .catch(err => next(err))
}
exports.postReply = (req, res, next) => {
  req.checkBody('answer', '내용은 필수입니다.').notEmpty()
  req.getValidationResult().then(result => {
    if (!result.isEmpty()) {
      res.status(400).json(util.inspect(result.array()))
      return
    }
    let doc = req.body
    let user = req.user
    let docKey = req.params.doc_key

    let modelData = {
      answer: doc.answer
    }
    let queryOptions = { // 답변이 달려있지 않아야한다.
      where: { doc_key: docKey, answer: null }
    }
    model.Doc.findOne(queryOptions)
      .then(result => {
        return result.update(modelData)
          .then(result => {
            service.notiService.qnaReply(docKey)
            res.status(201).send('답변이 작성되었습니다.')
          })
          .catch(err => next(err))
      })
      .catch((error) => next(error))
  })
}
exports.putReply = (req, res, next) => {
  req.checkBody('answer', '내용은 필수입니다.').notEmpty()
  req.getValidationResult().then(result => {
    if (!result.isEmpty()) {
      res.status(400).json(util.inspect(result.array()))
      return
    }
    let doc = req.body
    let user = req.user
    let docKey = req.params.doc_key

    let modelData = {
      answer: doc.answer
    }
    let queryOptions = { // 답변이 달려있어야만 한다.
      where: { doc_key: docKey, answer: { $ne: null } }
    }
    model.Doc.findOne(queryOptions)
      .then(result => {
        return result.update(modelData)
          .then(result => res.status(200).send('답변이 수정되었습니다.'))
          .catch(err => next(err))
      })
      .catch(err => next(err))
  })
}
