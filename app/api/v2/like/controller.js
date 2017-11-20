const model = require('../../../model')
const returnMsg = require('../../../return.msg')
const { notiService, userService, docService } = require('../service')

/**
 * environment 타입 리스트
 */

exports.getData = (req, res, next) => {
  model.Like.findAll({
    where: { user_key: req.params.user_key },
    include: {model: model.Doc}
  })
    .then(result => returnMsg.success200RetObj(res, result))
    .catch(val => { next(val) })
}


exports.putData = (req, res, next) => {
    model.Like.find({
      where: {
        user_key: req.params.user_key,
        doc_key: req.params.doc_key
      }
    })
      .then(v => {
        console.log(v, "ㅍ브이")
        if(v) {   // 이미 좋아요한 경우 삭제
          model.Like.destroy({
            where: {
              user_key: req.params.user_key,
              doc_key: req.params.doc_key
            },
            returning: true,
          })
            .then(result => res.json({ message: 'success', data: result }))
            .catch(val => next(val))

        } else {    // 좋아요 추가
          model.Like.create({
            user_key: req.params.user_key,
            doc_key: req.params.doc_key
          })
            .then(result => res.json({ message: 'success', data: result }))
            .catch(val => next(val) )
        }
      })
      .catch(error => next(error))
}
