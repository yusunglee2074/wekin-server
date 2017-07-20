const model = require('../../../model')
const returnMsg = require('../../../return.msg')

/**
 * board의 타입 리스트
 */
const TYPE_MAP = {
  notice: 0,
  faq: 1
}

exports.getList = (req, res) => {
  
  typeConverter(req)
  .then(val => model.Board.findAll({
    where: { type: val },
    order: [['created_at', 'DESC']]
  }))
  .then(result => returnMsg.success200RetObj(res, result))
  .catch(val => {returnMsg.error400InvalidCall(res, val.code, val.msg)})
}

exports.getOne = (req, res) => {
  
  typeConverter(req)
  .then(val => model.Board.findOne({
    where: { type: val, board_key: req.params.key }
  }))
  .then(result => returnMsg.success200RetObj(res, result))
  .catch(val => {
    returnMsg.error400InvalidCall(res, val.code, val.msg)
  })
}

exports.putOne = (req, res) => {
  typeConverter(req)
  .then(val => model.Board.update({
    content: req.body.content,
    category: req.body.category,
    title: req.body.title
  }, {
    where: { board_key: req.params.key }
  }
  ))
  .then(result => returnMsg.success200RetObj(res, result))
  .catch(val => {
    // returnMsg.error400InvalidCall(res, val.code, val.msg)
    console.log(val)
  })
}

exports.delOne = (req, res) => {
  typeConverter(req)
  .then(val => model.Board.destroy({
    where: { board_key: req.params.key }
  }
  ))
  .then(result => returnMsg.success200(res))
  .catch(val => {
    console.log(val)
  })
}

exports.commitData = (req, res) => {
  typeConverter(req)
  // .then(val => {modelBind(req, val)})
  .then(val => model.Board.create(modelBind( req, val)))
  .then(result => returnMsg.success200RetObj(res, result))
  .catch(val => { returnMsg.error400InvalidCall(res, val.code, val.msg) })
  // .catch(val => { console.log(val) })
}

exports.getFrontBoard = (req, res, next) => {
  var options = req.fetchParameter(['type'])
  if (req.checkParamErr(options)) return next(options)

    // where: { type: { $contains: [0] } },
  model.Board.findAll({
    where: { type: options.type },
    order: [['created_at', 'DESC']]
  }).then(results => {
    res.json(results)
  }).catch(err => {
    next(err)
  })
}

exports.postFrontBoard = (req, res, next) => {
  req.checkBody('content', '내용이 필요합니다.').notEmpty()
  req.checkBody('type', '타입이 필요합니다.').notEmpty()
  req.checkBody('title', '제목이 필요합니다.').notEmpty()
  req.checkBody('category', '카테고리가 필요합니다.').notEmpty()
  req.getValidationResult().then(result => {
    if (!result.isEmpty()) {
      res.status(400).json(util.inspect(result.array())) // FIXME: error 대상만 에러를 던지던가 올바르지 않은 요청 하나만 보내기
      return
    }
    let board = req.body
    let queryOptions = {
      title: board.title,
      content: board.content,
      type: board.type,
      category: arraySeparator(board.category)
    }
    model.Board.create(queryOptions)
      .then(result => res.json(result))
      .catch(err => next(err))
  })
}

let modelBind = (req, type) => {  
  let body = req.body
  let returnObj = { type: type }

  if (body.title)     returnObj.title    = body.title
  if (body.content)   returnObj.content  = body.content
  if (body.category != undefined) returnObj.category = String(body.category).split(',').map(val => parseInt(val))

  console.log(returnObj)
  
  return returnObj;
}

/**
 * 경로 패스와 일치하는 타입의 int 값을 리턴
 * @param {Request} req 
 */
let typeConverter = req => {
  return new Promise((resolve, reject) => {
    let returnValue = TYPE_MAP[req.params.type]
    if (returnValue == undefined) {
      reject({
        code: 'ERROR_INVALID_PARAM',
        msg: 'ERROR_INVALID_PARAM'})
    } else {
      resolve(returnValue)
    }
  })
}
