const express = require('express')
const router = express.Router()
const model = require('./../../../model') 

const controller = require('./controller')

/** @api {get} /like/:user_key 유저 좋아요 정보
 * @apiParam {Number} user_key userkey
 * 
 * @apiName getData
 * @apiGroup like
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * [
 *     {
 *         "like_key": 129,
 *         "user_key": 37,
 *         "doc_key": 57,
 *         "comment_key": null,
 *         "news_key": null,
 *         "created_at": "2017-07-20T05:38:38.778Z",
 *         "updated_at": "2017-07-20T05:38:38.778Z",
 *         "Doc": {
 *             "doc_key": 57,
 *             "activity_key": null,
 *             "user_key": 187,
 *             "activity_title": null,
 *             "activity_rating": 5,
 *             "content": "여자친구를 만날 때 마다 뭘 해야할 지 고민이 많았어요ㅎㅎㅎ덕분에 새로운 데이트 코스를 짤 수 있게 되었습니다ㅎㅎㅎㅎㅎㅎ",
 *             "images": null,
 *             "image_url": [],
 *             "medias": null,
 *             "tags": null,
 *             "private_mode": false,
 *             "status": null,
 *             "type": 0,
 *             "answer": null,
 *             "host_key": null,
 *             "share_count": 0,
 *             "created_at": "2017-07-15T17:30:20.871Z",
 *             "updated_at": "2017-07-15T17:30:20.871Z"
 *         }
 *     }, ...
 * ]
 */
router.get('/:user_key', controller.getData)

/** @api {put} /like/:user_key/:doc_key 유저 좋아요 토글
 * @apiParam {Number} user_key userkey
 * @apiParam {Number} doc_key dockey 
 * 
 * @apiName putData
 * @apiGroup like
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *     {
 *         "like_key": 129,
 *         "user_key": 37,
 *         "doc_key": 57,
 *         "comment_key": null,
 *         "news_key": null,
 *         "created_at": "2017-07-20T05:38:38.778Z",
 *         "updated_at": "2017-07-20T05:38:38.778Z",
 *         "Doc": {
 *             "doc_key": 57,
 *             "activity_key": null,
 *             "user_key": 187,
 *             "activity_title": null,
 *             "activity_rating": 5,
 *             "content": "여자친구를 만날 때 마다 뭘 해야할 지 고민이 많았어요ㅎㅎㅎ덕분에 새로운 데이트 코스를 짤 수 있게 되었습니다ㅎㅎㅎㅎㅎㅎ",
 *             "images": null,
 *             "image_url": [],
 *             "medias": null,
 *             "tags": null,
 *             "private_mode": false,
 *             "status": null,
 *             "type": 0,
 *             "answer": null,
 *             "host_key": null,
 *             "share_count": 0,
 *             "created_at": "2017-07-15T17:30:20.871Z",
 *             "updated_at": "2017-07-15T17:30:20.871Z"
 *         }
 *     }
 * }
 * or
 * 1
 */
router.put('/:user_key/:doc_key', controller.putData)

/** @api {put} /like/comment 코멘트 좋아요토글
 * @apiParam {Number} user_key userkey
 * @apiParam {Number} comment_key commentkey 
 * 
 * @apiName putData
 * @apiGroup like
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *     {
 *         "like_key": 129,
 *         "user_key": 37,
 *         "doc_key": 57,
 *         "comment_key": null,
 *         "news_key": null,
 *         "created_at": "2017-07-20T05:38:38.778Z",
 *         "updated_at": "2017-07-20T05:38:38.778Z",
 *         "Doc": {
 *             "doc_key": 57,
 *             "activity_key": null,
 *             "user_key": 187,
 *             "activity_title": null,
 *             "activity_rating": 5,
 *             "content": "여자친구를 만날 때 마다 뭘 해야할 지 고민이 많았어요ㅎㅎㅎ덕분에 새로운 데이트 코스를 짤 수 있게 되었습니다ㅎㅎㅎㅎㅎㅎ",
 *             "images": null,
 *             "image_url": [],
 *             "medias": null,
 *             "tags": null,
 *             "private_mode": false,
 *             "status": null,
 *             "type": 0,
 *             "answer": null,
 *             "host_key": null,
 *             "share_count": 0,
 *             "created_at": "2017-07-15T17:30:20.871Z",
 *             "updated_at": "2017-07-15T17:30:20.871Z"
 *         }
 *     }
 * }
 * or
 * 1
 */
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

/** @api {put} /like/news/:user_key 좋아요 누른 뉴스들
 * @apiParam {Number} user_key userkey
 * 
 * @apiName getNews
 * @apiGroup like
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *     "message": "success",
 *     "data": [
 *         {
 *             "like_key": 1223,
 *             "user_key": 37,
 *             "doc_key": null,
 *             "comment_key": null,
 *             "news_key": 6,
 *             "created_at": "2017-11-22T08:10:17.757Z",
 *             "updated_at": "2017-11-22T08:10:17.757Z"
 *         }
 *     ]
 * }
 */
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

/** @api {put} /like/news 뉴스 좋아요 토글
 * @apiParam {Number} user_key userkey
 * @apiParam {Number} news_key newskey
 * 
 * @apiName toggleNews
 * @apiGroup like
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *     "message": "success",
 *     "data": [
 *         {
 *             "like_key": 1223,
 *             "user_key": 37,
 *             "doc_key": null,
 *             "comment_key": null,
 *             "news_key": 6,
 *             "created_at": "2017-11-22T08:10:17.757Z",
 *             "updated_at": "2017-11-22T08:10:17.757Z"
 *         }
 *     ]
 * }
 * or
 * {
 *     "message": "success",
 *     "data": [
 *     ]
 * }
 */
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
