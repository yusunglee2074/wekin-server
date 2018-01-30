const express = require('express')
const router = express.Router()
const sequelize = require('sequelize')
const model = require('./../../../model')
const { authChk } = require('../service')
const moment = require('moment')
const controller = require('./controller')
const cache = require('memory-cache')

router.get('/paid-amount', (req, res, next) => {
  if (cache.get('paidAmount')) {
    res.json(cache.get('paidAmount'))
  } else {
    let result = {}
    let promiseList = []
    let activityKeyList = []
    model.ActivityNew.findAll({ where: { status: 3 }, attributes: [ 'activity_key' ] })
      .then(r => {
        for (let i = 0, length = r.length; i < length; i++) {
          let item = r[i]
          activityKeyList.push(item.activity_key)
        }
        return
      })
      .then(() => {
        for (let i = 0, length = activityKeyList.length; i < length; i++) {
          let item = activityKeyList[i]
          promiseList.push(model.WekinNew.count({ where: { activity_key: item, state: 'paid' } }))
        }
        return Promise.all(promiseList)
      })
      .then(r => {
        for (let i = 0, length = activityKeyList.length; i < length; i++) {
          let item = activityKeyList[i]
          if (r[i] === 0) continue
          result[item] = r[i]
        }
        cache.put('paidAmount', result, 180000)
        return res.json(result)
      })
      .catch(e => next(e))
  }
})

/** @api {get} /wekin/category/:user_key 위킨뉴(결제건) 카테고리별 조회
 * 
 * @apiName getWekinNews
 * @apiGroup wekinnew
 * @apiParam {Number} user_key 유저키
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *     "message": "success",
 *     "data": [
 *         {
 *             "wekin_key": 133,
 *             "activity_key": 455,
 *             "user_key": 37,
 *             "final_price": 100,
 *             "start_date": "2017-12-20T12:08:00.000Z",
 *             "start_time": "1991-04-11T16:00:00.000Z",
 *             "select_option": {
 *                 "selectedYoil": "We",
 *                 "currentUserOfSelectedDate": 1,
 *                 "startTime": [
 *                     "01:00",
 *                     0
 *                 ],
 *                 "selectedOption": [
 *                     "시간조정가능",
 *                     "0"
 *                 ],
 *                 "selectedExtraOption": {
 *                     "0": 1,
 *                     "1": 0,
 *                     "2": 0
 *                 },
 *                 "max_user": "10"
 *             },
 *             "pay_amount": 1,
 *             "state": "paid",
 *             "created_at": "2017-12-05T07:41:06.311Z",
 *             "updated_at": "2017-12-05T07:41:52.513Z",
 *             "deleted_at": null,
 *             "ActivityNew": { },
 *             "Order": {
 *                 "order_key": 606,
 *                 "order_id": "cbd3f93a-732c-4551-adc4-08ed3a6620e1",
 *                 "order_pay_pg": "html5_inicis",
 *                 "order_pay_method": "card",
 *                 "user_key": 37,
 *                 "user_email": "cheyja@naver.com",
 *                 "user_name": "유니",
 *                 "user_phone": "01093666639",
 *                 "wekin_key": 133,
 *                 "wekin_name": "결제테스트",
 *                 "wekin_price": 100,
 *                 "wekin_amount": 1,
 *                 "order_total_price": 100,
 *                 "order_receipt_price": 100,
 *                 "order_refund_price": 0,
 *                 "order_pay_price": 100,
 *                 "status": "paid",
 *                 "order_cost_tax": null,
 *                 "order_cost_price": null,
 *                 "order_at": "2017-12-05T07:41:50.000Z",
 *                 "order_ip": null,
 *                 "order_method": null,
 *                 "order_refund_policy": "[환불규정]\n- 위킨 신청 마감 3일 이전 취소 : 전액 환불\n- 위킨 신청 마감 2일 이전 취소 : 결제 금액의 30프로 배상 후 환불\n- 위킨 신청 마감 1일 이전 취소 : 결제 금액의 40프로 배상 후 환불\n- 위킨 신청 마감 시간 이후 취소 : 환불 불가",
 *                 "order_extra": {
 *                     "vbank_date": 0,
 *                     "vbank_holder": null,
 *                     "vbank_name": null,
 *                     "vbank_num": null,
 *                     "user_agent": "sorry_not_supported_anymore"
 *                 },
 *                 "receipt_url": "https://iniweb.inicis.com/DefaultWebApp/mall/cr/cm/mCmReceipt_head.jsp?noTid=StdpayCARDMOIwekinwe20171205164150192475&noMethod=1",
 *                 "pg_tid": "StdpayCARDMOIwekinwe20171205164150192475",
 *                 "imp_uid": "imp_699669483832",
 *                 "commission": 0,
 *                 "wekin_host_name": "위킨메이커_채윤",
 *                 "refund_info": {
 *                     "refund_account": null,
 *                     "refund_bank": null,
 *                     "refund_holder": null
 *                 },
 *                 "host_key": 20,
 *                 "created_at": "2017-12-05T07:41:09.407Z",
 *                 "updated_at": "2017-12-05T07:41:52.260Z",
 *                 "deleted_at": null
 *             }
 *         },
 */
router.get('/category/:user_key', function (req, res, next) {
  let category = {
    1: '투어/여행', 2: '익스트림', 3: '스포츠', 4: '음악', 5: '댄스', 6: '뷰티', 
    7: '요리', 8: '아트', 9: '힐링', 10: '아웃도어', 11: '요가/피트니스', 12: '소품제작'
  }
  let data = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0 }
  model.WekinNew.findAll({
    where: {
      updated_at: {
        $lt: moment(),
        $gt: moment().add(-1, 'months')
      },
      state: 'paid',
      user_key: req.params.user_key,
    },
    include: [ { model: model.ActivityNew, attributes: ['category'] } ]
  })
    .then(wekins => {
      let length = wekins.length
      for (let i = 0; i < length; i++) {
        let wekin = wekins[i]
        switch(wekin.ActivityNew.category) {
          case '투어/여행':
            data[0]++
            break;
          case '익스트림':
            data[1]++
            break;
          case '스포츠':
            data[2]++
            break;
          case '음악':
            data[3]++
            break;
          case '댄스':
            data[4]++
            break;
          case '뷰티':
            data[5]++
            break;
          case '요리':
            data[6]++
            break;
          case '아트':
            data[7]++
            break;
          case '힐링':
            data[8]++
            break;
          case '아웃도어':
            data[9]++
            break;
          case '요가/피트니스':
            data[10]++
            break;
          case '소품제작':
            data[11]++
            break;
        }
      }
      data['total'] = length
      data['categoryForm'] = {
        1: '투어/여행', 2: '익스트림', 3: '스포츠', 4: '음악', 5: '댄스', 6: '뷰티', 
        7: '요리', 8: '아트', 9: '힐링', 10: '아웃도어', 11: '요가/피트니스', 12: '소품제작'
      }
      res.json({ message: 'success', data: data })
    })
    .catch( error => {
      next(error)
    })
})

// TODO: 리펙토링 해야함 지금 많이 비효율적...
/** @api {get} /wekin/ranking [모바일] 카테고리별 위킨랭킹
 * 
 * @apiName getWekinRanking
 * @apiGroup wekinnew
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
  * {
 *     "message": "success",
 *     "data": {
 *         "1": [],
 *         "2": [],
 *         "3": [],
 *         "4": [],
 *         "5": [],
 *         "6": [],
 *         "7": [],
 *         "8": [],
 *         "9": [],
 *         "10": [],
 *         "11": [],
 *         "12": [
 *             [
 *                 "37",
 *                 5,
 *                 {
 *                     "name": "유니",
 *                     "user_key": 37,
 *                     "profile_image": "https://firebasestorage.googleapis.com/v0/b/wekin-9111d.appspot.com/o/img%2Fimage730%2F2017%2F7%2F20%2F21323.png?alt=media"
 *                 }
 *             ],
 *             [
 *                 "2059",
 *                 2,
 *                 {
 *                     "name": "김동아",
 *                     "user_key": 2059,
 *                     "profile_image": "/static/images/default-profile.png"
 *                 }
 *             ],
 *             [
 *                 "2061",
 *                 2,
 *                 {
 *                     "name": "Yuusug Lee",
 *                     "user_key": 2061,
 *                     "profile_image": "https://scontent.xx.fbcdn.net/v/t1.0-1/p100x100/23915891_109338539849640_4600413453684241191_n.jpg?oh=418d732f43169bfacb9aa53dc081dea0&oe=5A8F95C5"
 *                 }
 *             ]
 *         ]
 *     },
 *     "form": {
 *         "1": "투어/여행",
 *         "2": "익스트림",
 *         "3": "스포츠",
 *         "4": "음악",
 *         "5": "댄스",
 *         "6": "뷰티",
 *         "7": "요리",
 *         "8": "아트",
 *         "9": "힐링",
 *         "10": "아웃도어",
 *         "11": "요가/피트니스",
 *         "12": "소품제작"
 *     }
 * }
 */
router.get('/ranking', function (req, res, next) {
  model.WekinNew.findAll({
    where: {
      state: 'paid',
    },
    include: [
      { model: model.User, attributes: [ 'name', 'user_key', 'profile_image' ] },
      { model: model.ActivityNew, attributes: [ 'category' ] },
    ],
    attributes: [
    ],
  })
    .then(result => {
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

/** @api {get} /wekin/ranking [모바일] 카테고리별 위킨랭킹
 * 
 * @apiName getWekinRanking
 * @apiGroup wekinnew
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
  * {
 *     "message": "success",
 *     "data": {
 *         "1": [],
 *         "2": [],
 *         "3": [],
 *         "4": [],
 *         "5": [],
 *         "6": [],
 *         "7": [],
 *         "8": [],
 *         "9": [],
 *         "10": [],
 *         "11": [],
 *         "12": [
 *             [
 *                 "37",
 *                 5,
 *                 {
 *                     "name": "유니",
 *                     "user_key": 37,
 *                     "profile_image": "https://firebasestorage.googleapis.com/v0/b/wekin-9111d.appspot.com/o/img%2Fimage730%2F2017%2F7%2F20%2F21323.png?alt=media"
 *                 }
 *             ],
 *             [
 *                 "2059",
 *                 2,
 *                 {
 *                     "name": "김동아",
 *                     "user_key": 2059,
 *                     "profile_image": "/static/images/default-profile.png"
 *                 }
 *             ],
 *             [
 *                 "2061",
 *                 2,
 *                 {
 *                     "name": "Yuusug Lee",
 *                     "user_key": 2061,
 *                     "profile_image": "https://scontent.xx.fbcdn.net/v/t1.0-1/p100x100/23915891_109338539849640_4600413453684241191_n.jpg?oh=418d732f43169bfacb9aa53dc081dea0&oe=5A8F95C5"
 *                 }
 *             ]
 *         ]
 *     },
 *     "form": {
 *         "1": "투어/여행",
 *         "2": "익스트림",
 *         "3": "스포츠",
 *         "4": "음악",
 *         "5": "댄스",
 *         "6": "뷰티",
 *         "7": "요리",
 *         "8": "아트",
 *         "9": "힐링",
 *         "10": "아웃도어",
 *         "11": "요가/피트니스",
 *         "12": "소품제작"
 *     }
 * }
 */
router.get('/front', controller.getFrontWekin)

router.post('/front/post', controller.postFrontWekin)

router.put('/approve/:wekin_key', controller.adjustCommission)


router.get('/order/:key', controller.getOneIncludeOrder)

router.get('/finish', controller.getFinishList)

router.post('/finish/:wekin_key', controller.setFinish)

router.get('/activity/:key', controller.getSameActivity)

/** @api {get} /wekin/current/:key/:date/:time 특정시각 예약인원 조회
 * 
 * @apiName getCurrentNumberOfBoookingUsers
 * @apiGroup wekinnew
 * @apiParam {Number} key 엑티비티 키
 * @apiParam {String} date ISO type Date string
 * @apiParam {String} time 11:00 형식의 string
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
  * {
 *     "message": "success",
 *     "data": 3
 * }
 */
router.get('/current/:key/:date/:time', controller.getCurrentNumberOfBookingUsers )


router.delete('/:wekin_key', controller.deleteWekin)

/** @api {get} /wekin/:user_key 결제 진행중인 위킨new
 * 
 * @apiName getList
 * @apiGroup wekinnew
 * @apiParam {Number} user_key 유저키
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *     "message": "success",
 *     "data": [
 *         {
 *             "wekin_key": 133,
 *             "activity_key": 455,
 *             "user_key": 37,
 *             "final_price": 100,
 *             "start_date": "2017-12-20T12:08:00.000Z",
 *             "start_time": "1991-04-11T16:00:00.000Z",
 *             "select_option": {
 *                 "selectedYoil": "We",
 *                 "currentUserOfSelectedDate": 1,
 *                 "startTime": [
 *                     "01:00",
 *                     0
 *                 ],
 *                 "selectedOption": [
 *                     "시간조정가능",
 *                     "0"
 *                 ],
 *                 "selectedExtraOption": {
 *                     "0": 1,
 *                     "1": 0,
 *                     "2": 0
 *                 },
 *                 "max_user": "10"
 *             },
 *             "pay_amount": 1,
 *             "state": "paid",
 *             "created_at": "2017-12-05T07:41:06.311Z",
 *             "updated_at": "2017-12-05T07:41:52.513Z",
 *             "deleted_at": null,
 *             "ActivityNew": { },
 *             "Order":  {}
 *         }, ...
 *     ]
 * }
 */
router.get('/:user_key', controller.getList)

/** @api {post} /wekin/ 위킨뉴생성
 * 
 * @apiName postWekin
 * @apiGroup wekinnew
 * @apiParam {Number} activity_key 엑티비티 키
 * @apiParam {Number} max_user 해당 요일의 최대유저
 * @apiParam {Number} currentUserOfSelectedDate 선택한 시각에 현재유저수
 * @apiParam {Number} finalPrice 최종가격
 * @apiParam {Number} selectedDate 선택날짜 Date String
 * @apiParam {Object} selectedExtraOption 대인소인등 추가 가격옵션 오브잭트
 * @apiParam {Object} selectedOption 선택한 코스옵션 오브젝트
 * @apiParam {String} selectedYoil 선택한요일
 * @apiParam {Object} startTime 선택시각 ['시각', '가격']
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *     "message": "success",
 *     "data": 
 *         {
 *             "wekin_key": 133,
 *             "activity_key": 455,
 *             "user_key": 37,
 *             "final_price": 100,
 *             "start_date": "2017-12-20T12:08:00.000Z",
 *             "start_time": "1991-04-11T16:00:00.000Z",
 *             "select_option": {
 *                 "selectedYoil": "We",
 *                 "currentUserOfSelectedDate": 1,
 *                 "startTime": [
 *                     "01:00",
 *                     0
 *                 ],
 *                 "selectedOption": [
 *                     "시간조정가능",
 *                     "0"
 *                 ],
 *                 "selectedExtraOption": {
 *                     "0": 1,
 *                     "1": 0,
 *                     "2": 0
 *                 },
 *                 "max_user": "10"
 *             },
 *             "pay_amount": 1,
 *             "state": "paid",
 *             "created_at": "2017-12-05T07:41:06.311Z",
 *             "updated_at": "2017-12-05T07:41:52.513Z",
 *             "deleted_at": null,
 *         }
 * }
 */
router.route('/')
  .post(authChk, controller.postWekin)

/** @api {post} /wekin/:key 위킨뉴 조회
 * 
 * @apiName postWekin
 * @apiGroup wekinnew
 * @apiParam {Number} wekin_key 위킨 키
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *     "message": "success",
 *     "data": 
 *         {
 *             "wekin_key": 133,
 *             "activity_key": 455,
 *             "user_key": 37,
 *             "final_price": 100,
 *             "start_date": "2017-12-20T12:08:00.000Z",
 *             "start_time": "1991-04-11T16:00:00.000Z",
 *             "select_option": {
 *                 "selectedYoil": "We",
 *                 "currentUserOfSelectedDate": 1,
 *                 "startTime": [
 *                     "01:00",
 *                     0
 *                 ],
 *                 "selectedOption": [
 *                     "시간조정가능",
 *                     "0"
 *                 ],
 *                 "selectedExtraOption": {
 *                     "0": 1,
 *                     "1": 0,
 *                     "2": 0
 *                 },
 *                 "max_user": "10"
 *             },
 *             "pay_amount": 1,
 *             "state": "paid",
 *             "created_at": "2017-12-05T07:41:06.311Z",
 *             "updated_at": "2017-12-05T07:41:52.513Z",
 *             "deleted_at": null,
 *         }
 * }
 */
router.get('/:key', controller.getOne)

router.put('/:wekin_key', controller.putWekin)




module.exports = router
