const express = require('express')
const sequelize = require('sequelize')
const model = require('./../../../model')
const { authChk } = require('../service')
const fireHelper = require('../../../util/firebase')
const moment = require('moment')
const Model = require('./../../../model')

const router = express.Router()


/** @api {post} /news/create 뉴스생성
 * @apiParam {String} title 제목
 * @apiParam {String} thumbnail_url 썸네일 이미지 url
 * @apiParam {String} link_url 뉴스 링크 url
 * @apiParam {String} sub_title 내용 요약
 * 
 * @apiName createNews
 * @apiGroup news
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *     {{ news }}
 * }
 */
router.post('/create',
  function (req, res, next) {
    let body = req.body
    let param = {
      title: body.title,
      thumbnail_url: body.thumbnail_url,
      link_url: body.link_url,
      sub_title: body.sub_title || null
    }
    model.News.create( param )
      .then(result => {
        res.json({ message: 'success', data: result })
      })
      .catch(error => next(error))
  }
)

/** @api {put} /news/update 뉴스 수정
 * @apiParam {String} title 제목
 * @apiParam {String} thumbnail_url 썸네일 이미지 url
 * @apiParam {String} link_url 뉴스 링크 url
 * @apiParam {String} sub_title 내용 요약
 * 
 * @apiName createNews
 * @apiGroup news
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *     {{ news }}
 * }
 */
router.put('/update',
  function (req, res, next) {
    let body = req.body
    let param = {
      title: body.title,
      thumbnail_url: body.thumbnail_url,
      link_url: body.link_url,
      sub_title: body.sub_title || null,
    }
    model.News.update(param, { where: { news_key: body.id }, returning: true })
      .then(result => {
        res.json({ message: 'success', data: result })
      })
      .catch(error => next(error))
  }
)

/** @api {delete} /news/delete/:news_key 뉴스 삭제
 * @apiParam {Number} news_key 뉴스키
 * 
 * @apiName deleteNews
 * @apiGroup news
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *     {{ news }}
 * }
 */
router.delete('/delete/:news_key',
  function (req, res, next) {
    model.News.destroy({ where: { news_key: req.params.news_key } })
      .then(result => {
        res.json({ message: 'success' })
      })
      .catch(error => next(error))
  }
)

/** @api {get} /news 뉴스 조회
 * 
 * @apiName getNews
 * @apiGroup news
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *     "message": "success",
 *     "data": [
 *         {
 *             "news_key": 6,
 *             "link_url": "https://www.koroad.or.kr/kp_web/onlineSignalzineList.do?board_code=BRBBS_040",
 *             "title": "신호등",
 *             "sub_title": "신호등을 잘 지키세요 쑤파수파",
 *             "thumbnail_url": "https://firebasestorage.googleapis.com/v0/b/wekin-9111d.appspot.com/o/images%2Ftest%2F2017%2F11%2F22%2F22981.png?alt=media",
 *             "click_count": 0,
 *             "share_count": 5,
 *             "created_at": "2017-11-22T05:55:39.226Z",
 *             "updated_at": "2017-11-28T02:35:08.035Z",
 *             "deleted_at": null,
 *             "like_count": "1"
 *         }, ...
 *     ]
 * }
 */
router.get('/',
  function (req, res, next) {
    let body = req.body
    model.News.findAll({
      order: [['created_at', 'DESC']],
      include: [
        { model: model.Like, attributes: [], required: false, duplicating: false }
      ],
      attributes: { include: [[model.Sequelize.fn('COUNT', model.Sequelize.fn('DISTINCT', model.Sequelize.col('Likes.like_key'))), 'like_count']] },
      group: ['News.news_key']
    })
      .then(result => {
        res.json({ message: 'success', data: result })
      })
      .catch(error => next(error))
  }
)

/** @api {get} /news/:news_key 뉴스 조회수 1
 * 
 * @apiName countNews
 * @apiGroup news
 * @apiParam {Number} news_key 뉴스키
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *     "message": "success",
 *     "data": [
 *         {
 *             "news_key": 6,
 *             "link_url": "https://www.koroad.or.kr/kp_web/onlineSignalzineList.do?board_code=BRBBS_040",
 *             "title": "신호등",
 *             "sub_title": "신호등을 잘 지키세요 쑤파수파",
 *             "thumbnail_url": "https://firebasestorage.googleapis.com/v0/b/wekin-9111d.appspot.com/o/images%2Ftest%2F2017%2F11%2F22%2F22981.png?alt=media",
 *             "click_count": 0,
 *             "share_count": 5,
 *             "created_at": "2017-11-22T05:55:39.226Z",
 *             "updated_at": "2017-11-28T02:35:08.035Z",
 *             "deleted_at": null,
 *             "like_count": "1"
 *         }, ...
 *     ]
 * }
 */
router.get('/:news_key',
  function (req, res, next) {
    model.News.increment('click_count', { where: { news_key: req.params.news_key } })
      .then(result => {
        res.json({ message: 'success', data: result })
      })
      .catch(error => next(error))
  }
)

/** @api {get} /news/share/:news_key 뉴스 공유횟수 1
 * 
 * @apiName countNews
 * @apiGroup news
 * @apiParam {Number} news_key 뉴스키
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *     "message": "success",
 *     "data": [
 *         {
 *             "news_key": 6,
 *             "link_url": "https://www.koroad.or.kr/kp_web/onlineSignalzineList.do?board_code=BRBBS_040",
 *             "title": "신호등",
 *             "sub_title": "신호등을 잘 지키세요 쑤파수파",
 *             "thumbnail_url": "https://firebasestorage.googleapis.com/v0/b/wekin-9111d.appspot.com/o/images%2Ftest%2F2017%2F11%2F22%2F22981.png?alt=media",
 *             "click_count": 0,
 *             "share_count": 5,
 *             "created_at": "2017-11-22T05:55:39.226Z",
 *             "updated_at": "2017-11-28T02:35:08.035Z",
 *             "deleted_at": null,
 *             "like_count": "1"
 *         }, ...
 *     ]
 * }
 */
router.get('/share/:news_key',
  function (req, res, next) {
    model.News.increment('share_count', { where: { news_key: req.params.news_key } })
      .then(result => {
        res.json({ message: 'success', data: result })
      })
      .catch(error => next(error))
  }
)

module.exports = router
