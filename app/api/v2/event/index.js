const express = require('express')
const sequelize = require('sequelize')
const model = require('./../../../model')
const { authChk } = require('../service')
const fireHelper = require('../../../util/firebase')
const moment = require('moment')
const Model = require('./../../../model')
const googl = require('goo.gl')
googl.setKey('AIzaSyDhLTs-_169xWGtXO4gIheQf_Jdqejco_c')

const router = express.Router()


/*
 event type
 이벤트는 type과 status란 칼럼이 있습니다.
 type은 
 'url' - 최초 가입유도 url 생성시 생기는 객체의 type
 'log' - 가입유도 url를 통해 가입하는 사람들의 로킹 type
 status는
 'waiting' - 최초 가입유도 url를 눌렀을때 생성되는 상태고 ip와 추천 해준 친구 유저키를 갖고 생성합니다.
 'joined' - 가입이 완료되면 waiting상태에서 joined로 바뀌며 받아갈 상품또한 기록됩니다.

필요한 api
최초생성,
joined 상태로 업그레이드,
랭킹,
현재 가입 유저수
 */

function getUser(key) {
  return new Promise((resolve, reject) => {
    model.User.findOne({ where: { user_key: key } })
      .then(user => {
        resolve(user)
      })
      .catch(error => reject(error))
  })
}

function getIp(req) {
  let ip = req.headers['x-forwarded-for']
  ip = ip.slice(0, ip.indexOf(','))
  return ip
}

function currentItem() {
  return new Promise((resolve, reject) => {
    let item = {
      giftCard: 10,
      americano: 201
    }
    model.Event.count({ where: { value: 'americano' } })
      .then(ame => {
        item.americano -= ame
        return model.Event.count({ where: { value: 'giftCard' } })
      })
      .then(giftCard => {
        item.giftCard -= giftCard
        resolve(item)
      })
      .catch(error => reject(error))
  })
}

router.post('/url', 
  function (req, res, next) {
    let body = req.body
    let userData
    getUser(body.user_key)
    .then(user => {
      if (user === null) throw Error('user doesn\'t exist')
      userData = user
      return googl.shorten('http://we-kin.com/event/share/invite-friend/' + user.user_key)
    })
    .then(shortUrl => {
      return model.Event.findOrCreate({ 
        where: { 
          url_user_key: userData.user_key, 
          type: 'url'
        }, defaults: { 
          type: 'url', 
          url_user_key: userData.user_key, 
          url: shortUrl 
        } 
      })
    })
    .then(result => {
      res.json(result[0].dataValues)
    })
    .catch(e => next(e))
  }
)

router.post('/newUser', function (req, res, next) {
  let userData
  let ip = getIp(req)
  getUser(req.body.user_key)
    .then(user => {
      if (user === null) throw Error('user doesn\'t exist')
      userData = user
      return model.Event.findOrCreate({
        where: {
          url_user_key: userData.user_key,
          type: 'log',
          ip: ip
        }, defaults: {
          url_user_key: userData.user_key,
          type: 'log',
          ip: ip,
          status: 'waiting',
        }
      })
    })
    .then(result => {
      res.json(result[0].dataValues)
    })
    .catch(e => next(e))
})

router.put('/join', function (req, res, next) {
  let ip = getIp(req)
  getUser(req.body.user_key)
    .then(user => {
      return model.Event.update({
        status: 'joined',
        be_invited_user_key: user.user_key
        }, {
          where: {
            ip: ip,
            type: 'log',
          },
          returning: true
        })
    })
    .then(result => {
      res.json(result[0].dataValues)
    })
    .catch(e => next(e))
})

router.put('/set-item', function (req, res, next) {
  let userData
  getUser(req.body.user_key)
  .then(user => {
    if (moment(user.created_at) < moment().add(-7, 'days')) throw Error(JSON.stringify({ msg: 'This user is not Fresh user', data: '' }))
    userData = user
    return currentItem()
  })
  .then(item => {
    let value
    if (Math.floor((Math.random() * 1000) + 1) === 1) item.giftCard !== 0 ? value = 'giftCard' : value = 'nope'
    else if (Math.floor((Math.random() * 1000) + 1) < 22) item.americano !== 0 ? value = 'americano' : value = 'nope'
    else value = 'nope'
    return model.Event.findOne({ where: { be_invited_user_key: req.body.user_key } })
  })
  .then(result => {
    if (result) {
      throw Error(JSON.stringify({ msg: 'Already receive this item.', data: result.value }))
    } else {
      return model.Event.update({
        value: value
      }, {
        where: {
          be_invited_user_key: req.body.user_key
        },
        returning: true
      })
    }
  })
    .then(result => {
      res.json(result[0].dataValues.value)
    })
    .catch(e => next(e))
})

router.get('/ranking', function (req, res, next) {
  let ranking 
  model.Event.findAll({
    where: {
      type: 'log'
    },
    attributes: [[sequelize.fn('count', sequelize.col('event_key')), 'count'], 'url_user_key'],
    group: ["url_user_key"],
    order: ['count']
  })
  .then(result => {
    ranking = result
    let tempList = []
    for (let i = 0; i < result.length; i++) {
      let item = result[i]
      tempList.push(model.User.findOne({ where: { user_key: item.url_user_key }, attributes: ['email'] }))
    }
    return Promise.all(tempList)
  })
  .then(results => {
    for (let i = 0; i < results.length; i++) {
      ranking[i].dataValues['email'] = results[i].email
    }
    res.json(ranking)
  })
  .catch(e => next(e))
})

router.get('/count-user', function (req, res, next) {
  model.Event.count({ where: { type: 'log', status: 'joined' } })
    .then(result => {
      res.send(String(result))
    })
    .catch(e => next(e))
})

module.exports = router
