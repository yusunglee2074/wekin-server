const express = require('express')
const router = express.Router()
const sequelize = require('sequelize')
const model = require('./../../../model')
const { authChk } = require('../service')
const moment = require('moment')
const controller = require('./controller')



// TODO: 리펙토링 해야함 지금 많이 비효율적...
router.get('/ranking', function (req, res, next) {
  model.WekinNew.findAll({
    where: {
      state: 'booking',
    },
    include: [
      { model: model.User, attributes: [ 'name', 'user_key', 'profile_image' ] },
      { model: model.ActivityNew, attributes: [ 'category' ] },
    ],
    attributes: [
    ],
  })
    .then( result => {
      let category = {
        1: '투어/여행', 2: '익스트림', 3: '스포츠', 4: '음악', 5: '댄스', 6: '뷰티', 
        7: '요리', 8: '아트', 9: '힐링', 10: '아웃도어', 11: '요가/피트니스', 12: '소품제작'
      }
      let data = { 1: {}, 2: {}, 3: {}, 4: {}, 5: {}, 6: {}, 7: {}, 8: {}, 9: {}, 10: {}, 11: {}, 12: {}, }
      let userData = {}
      for (let i = 0; i < result.length; i++) {
        let rs = result[i]
        userData[rs.User.user_key] ? null : userData[rs.User.user_key] = rs.User.dataValues
        switch (rs.ActivityNew.category) {
          case '투어/여행':
            data[1][rs.User.user_key] ? data[1][rs.User.user_key]++ : data[1][rs.User.user_key] = 1
            break;
          case '익스트림':
            data[2][rs.User.user_key] ? data[2][rs.User.user_key]++ : data[2][rs.User.user_key] = 1
            break;
          case '스포츠':
            data[3][rs.User.user_key] ? data[3][rs.User.user_key]++ : data[3][rs.User.user_key] = 1
            break;
          case '음악':
            data[4][rs.User.user_key] ? data[4][rs.User.user_key]++ : data[4][rs.User.user_key] = 1
            break;
          case '댄스':
            data[5][rs.User.user_key] ? data[5][rs.User.user_key]++ : data[5][rs.User.user_key] = 1
            break;
          case '뷰티':
            data[6][rs.User.user_key] ? data[6][rs.User.user_key]++ : data[6][rs.User.user_key] = 1
            break;
          case '요리':
            data[7][rs.User.user_key] ? data[7][rs.User.user_key]++ : data[7][rs.User.user_key] = 1
            break;
          case '아트':
            data[8][rs.User.user_key] ? data[8][rs.User.user_key]++ : data[8][rs.User.user_key] = 1
            break;
          case '힐링':
            data[9][rs.User.user_key] ? data[9][rs.User.user_key]++ : data[9][rs.User.user_key] = 1
            break;
          case '아웃도어':
            data[10][rs.User.user_key] ? data[10][rs.User.user_key]++ : data[10][rs.User.user_key] = 1
            break;
          case '요가/피트니스':
            data[11][rs.User.user_key] ? data[11][rs.User.user_key]++ : data[11][rs.User.user_key] = 1
            break;
          case '소품제작':
            data[12][rs.User.user_key] ? data[12][rs.User.user_key]++ : data[12][rs.User.user_key] = 1
            break;
        }
      }
      for (let i in data) {
        let sortable = [] 
        for (let user in data[i]) {
          sortable.push([user, data[i][user]])
        }
        sortable.sort( (a, b) => {
          return b[1] - a[1]
        })
        data[i] = sortable.slice(0, 3)
        for(let ii = 0; ii < 3; ii++) {
          try {
            data[i][ii].push(userData[data[i][ii][0]])
          }
          catch (e) {
          }
        }
      }
      res.json({ message: 'success', data: data, form: category })
    })
    .catch(error => { 
      next(error) 
    })
  /*
  model.ActivityNew.findAll({
    include: [
      { model: model.WekinNew, attributes: ['user_key'], require: false },
    ],
    attributes: [
        [model.Sequelize.fn('COUNT', model.Sequelize.col('WekinNews.wekin_key')), 'count']
    ],
    group: ['WekinNews.wekin_key', 'ActivityNew.activity_key'],
  })
    .then( result => {
      res.json({ message: 'success', data: result })
    })
    .catch(error => { 
      next(error) 
    })
    */
})

router.get('/front', controller.getFrontWekin)

router.post('/front/post', controller.postFrontWekin)

/** @api {put} /wekin/approve/:wekin_key 위킨 수수료 조절
 * @apiParam {Number} wekin_key 위킨키
 * 
 * @apiParam {Number} commission 수수료율
 * @apiName adjustCommission
 * @apiGroup wekin
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *  1
 * }
 *
 * @apiError Bad Request 잘못된 요청
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "errorCode": -2,
 *       "data": "ERROR_INVALID_PARAM"
 *     }
 */
router.put('/approve/:wekin_key', controller.adjustCommission)


router.get('/order/:key', controller.getOneIncludeOrder)

router.get('/finish', controller.getFinishList)

router.post('/finish/:wekin_key', controller.setFinish)

/**
 * @api {get} /wekin/activity/:key 위킨 스케줄리스트
 * @apiParam {Number} key 위킨키
 * @apiName getSameActivity
 * @apiGroup wekin
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * [
 * ]
 *
 * @apiError Bad Request 잘못된 요청
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "errorCode": -2,
 *       "data": "ERROR_INVALID_PARAM"
 *     }
 */
router.get('/activity/:key', controller.getSameActivity)

// 특정 엑티비티 특정 날짜에 예약인원 수 가져오기
router.get('/:key/:date', controller.getCurrentNumberOfBookingUsers )


/**
 * @api {delete} /:wekin_key 위킨 삭제
 * @apiParam {Number} wekin_key 위킨키
 * @apiName deleteWekin
 * @apiGroup wekin
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *  1
 * 
 * 
 * @apiErrorExample 삭제 실패:
 *     HTTP/1.1 403 Forbidden
 *     {
 *       "msg": "예약중인 회원이 있는경우엔 불가능 합니다."
 *     }
 */
router.delete('/:wekin_key', controller.deleteWekin)

router.get('/:user_key', controller.getList)

router.route('/')
  .post(authChk, controller.postWekin)

router.get('/:key', controller.getOne)

router.put('/:wekin_key', controller.putWekin)




module.exports = router
