const model = require('../../../model')
const returnMsg = require('../../../return.msg')
const { notiService, userService, docService } = require('../service')

/**
 * environment 타입 리스트
 */

exports.getData = (req, res) => {
  model.Like.findAll({
    where: { user_key: req.params.user_key },
    include: {model: model.Doc}
  })
  .then(result => returnMsg.success200RetObj(res, result))
  .catch(val => { returnMsg.error400InvalidCall(res, 'ERROR_INVALID_PARAM', val) })
}


exports.putData = (req, res) => {
  model.sequelize.transaction(t => {

    return model.Like.find({
      where: {
        user_key: req.params.user_key,
        doc_key: req.params.doc_key
      },
      transaction: t
    })
    .then(v => {
      if(v) {   // 이미 좋아요한 경우 삭제
        return model.Like.destroy({
          where: {
            user_key: req.params.user_key,
            doc_key: req.params.doc_key
          },
          returning: true,
          transaction: t
        })
        .then(result => returnMsg.success200RetObj(res, result))
        .catch(val => { returnMsg.error400InvalidCall(res, 'ERROR_INVALID_PARAM', val) })
        
      } else {    // 좋아요 추가
        notiService.docLike(req.params.user_key, req.params.doc_key)
        notiService.wekinTagLike(req.params.user_key, req.params.doc_key)
        return model.Like.create({
          user_key: req.params.user_key,
          doc_key: req.params.doc_key
        }, {
          transaction: t
        })
        .then(r => {
          
        })
        .then(result => returnMsg.success200RetObj(res, result))
        .catch(val => { returnMsg.error400InvalidCall(res, 'ERROR_INVALID_PARAM', val) })
      }
    })
  })
}
