const express = require('express')
const sequelize = require('sequelize')
const model = require('./../../../model')
const { authChk } = require('../service')
const fireHelper = require('../../../util/firebase')
const moment = require('moment')
const Model = require('./../../../model')

const router = express.Router()

/*
  뉴스 API입니다.
 */

// 뉴스 생성
// 필요 인자 = title, thumbnail_url, link_url, (optional) sub_title
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

// 뉴스 수정 
// 필요 인자 = id, (optional) title, thumbnail_url, link_url, sub_title
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

// 뉴스 삭제 
// 필요 인자 = id 
router.delete('/delete/:news_key',
  function (req, res, next) {
    model.News.destroy({ where: { news_key: req.params.news_key } })
      .then(result => {
        res.json({ message: 'success' })
      })
      .catch(error => next(error))
  }
)

// 뉴스 가져오기 
// 필요 인자 = none
router.get('/',
  function (req, res, next) {
    let body = req.body
    model.News.findAll({
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

// 뉴스 조회수 1 늘리기 
// 필요 인자 = none
router.put('/',
  function (req, res, next) {
    let body = req.body
    model.News.increment('click_count', { where: { news_key: body.id } })
      .then(result => {
        res.json({ message: 'success', data: result })
      })
      .catch(error => next(error))
  }
)

// 뉴스 공유 횟수 1 늘리기 
// 필요 인자 = none
router.put('/share',
  function (req, res, next) {
    let body = req.body
    model.News.increment('share_count', { where: { news_key: body.id } })
      .then(result => {
        res.json({ message: 'success', data: result })
      })
      .catch(error => next(error))
  }
)

module.exports = router
