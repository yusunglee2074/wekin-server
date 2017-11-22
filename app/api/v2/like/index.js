const express = require('express')
const router = express.Router()
const model = require('./../../../model') 

const controller = require('./controller')

/**
 * @api {get} /like/:user_key 좋아요 조회
 * @apiParam {Number} user_key 사용자키
 * @apiName getData
 * @apiGroup like
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *
 * @apiError Bad Request 잘못된 요청
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 * {
 *     "errorCode": -2,
 *     "data": {...}
 * }
 */
router.get('/:user_key', controller.getData)

/**
 * @api {put} /like/:user_key/:doc_key 좋아요 추가 제거
 * @apiParam {Number} user_key 사용자키
 * @apiParam {Number} doc_key 피드, 후기 키
 * @apiName postData
 * @apiGroup like
 *
 * @apiSuccessExample 추가 성공시:
 *     HTTP/1.1 200 OK
 * 
 * @apiSuccessExample 삭제 성공시:
 *     HTTP/1.1 200 OK
 *     1
 * 
 * @apiError Bad Request 잘못된 요청
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 * {
 *     "errorCode": -2,
 *     "data": {...}
 * }
 */
router.put('/:user_key/:doc_key', controller.putData)

router.put('/comment', 
  (req, res, next) => {
    let user_key = req.body.user_key
    let comment_key = req.body.comment_key
    console.log(user_key)
    model.Like.findOrCreate({
      where: {
        user_key: user_key,
        comment_key: comment_key
      },
      defaults: {
        user_key: user_key,
        comment_key: comment_key,
      }
    })
    .spread((like, iscreated) => {
      if (iscreated) {
        res.json({ message: 'success', data: like })
      } else {
        like.destroy({ force: true })
        res.json({ message: 'success', data: [] })
        
      }
    })
  }
)

router.get('/news/:user_key',
  (req, res, next) => {
    let user_key = req.params.user_key
    model.Like.findAll({
      where: {
        user_key: user_key,
        news_key: {
          $gt: 0 
        }
      }
    })
      .then(likes => {
        res.json({ message: 'success', data: likes })
      })
      .catch(error => {
        next(error)
      })
  }
)
router.put('/news',
  (req, res, next) => {
    let user_key = req.body.user_key
    let news_key = req.body.news_key
    console.log(user_key)
    model.Like.findOrCreate({
      where: {
        user_key: user_key,
        news_key: news_key
      },
      defaults: {
        user_key: user_key,
        news_key: news_key,
      }
    })
    .spread((like, iscreated) => {
      if (iscreated) {
        res.json({ message: 'success', data: like })
      } else {
        like.destroy({ force: true })
        res.json({ message: 'success', data: [] })
        
      }
    })
  }
)

module.exports = router
