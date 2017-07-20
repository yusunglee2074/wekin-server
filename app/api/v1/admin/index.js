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

router.route('/host/:host_key/wekin')
  .get((req, res, next) => {  // 호스트의 액티비티 찾고 액티비티 키 가져와서 위킨들 검색
    model.Activity.findAll({
      where: { host_key: req.params.host_key },
      attributes: ['activity_key', 'title']
    }).then(results => {
      console.log(results)
      let activityKeys = results.map(activity => {
        return activity.dataValues.activity_key
      })
      model.Wekin.findAll({
        where: { activity_key: { in: activityKeys } },
        include: { model: model.Activity }
      })
        .then(results => {
          res.json({ results: results })
        })
        .catch(err => next(err))
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
