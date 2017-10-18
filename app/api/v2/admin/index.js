const express = require('express')
const model = require('../../../model')
const router = express.Router()

router.route('/activity/:activity_key')
  .get((req, res, next) => {
    let queryOptions = {
      where: { activity_key: req.params.activity_key }
    }
    model.Activity.findOne(queryOptions)
      .then(result => res.json(result))
      .catch(err => next(err))
  })

router.route('/activity/:activity_key/wekin')
  .get((req, res, next) => {
    let queryOptions = {
      where: { activity_key: req.params.activity_key }
    }
    model.Wekin.findAll(queryOptions)
      .then(result => res.json(result))
      .catch(err => next(err))
  })

// 호스트키 들어오면 해당 호스트 엑티비티(+ 위킨(+ 오더)) 줌
router.route('/host/:host_key/wekin')
  .get((req, res, next) => {  // 호스트의 액티비티 찾고 액티비티 키 가져와서 위킨들 검색
    model.ActivityNew.findAll({
      where: { host_key: req.params.host_key },
      attributes: ['activity_key', 'title', 'status'],
      include: [{ model: model.WekinNew, include: model.Order }]
    })
      .then(results => {
        res.json({ message: 'success', data: results})
      })
      .catch(err => next(err))
  })

router.route('/wekin')
  .get((req, res, next) => {
    let queryOptions = {
      where: { activity_key: req.params.activity_key },
      include: { model: model.Activity }
    }
    model.Wekin.findAll(queryOptions)
      .then(result => res.json(result))
      .catch(err => next(err))
  })

module.exports = router
