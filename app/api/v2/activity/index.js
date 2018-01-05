const express = require('express')
const router = express.Router()
const { authChk } = require('../service')
const model = require('./../../../model')
const moment = require('moment')

const controller = require('./controller')
const controllerf = require('./controllerf')

/** @api {get} /activity/front/ 모든 엑티비티 조회
 * 
 * @apiName findAllActivity
 * @apiGroup activity
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * [
 *     {
 *         "activity_key": 85,
 *         "host_key": 32,
 *         "status": 3,
 *         "main_image": {
 *             "image": [
 *                 "https://firebasestorage.googleapis.com/v0/b/wekin-9111d.appspot.com/o/img%2Fimage730%2F2017%2F7%2F24%2F11305.png?alt=media",
 *                 "https://firebasestorage.googleapis.com/v0/b/wekin-9111d.appspot.com/o/img%2Fimage730%2F2017%2F7%2F24%2F47280.png?alt=media"
 *             ]
 *         },
 *         "title": "[남해 미조잠수] 바닷속 보물찾기",
 *         "intro_summary": null,
 *         "intro_detail": "<p>*상호: &nbsp;남해 미조잠수 리...",
 *         "schedule": "없음",
 *         "inclusion": "다이빙 비용 = 보트승선비 + 탱크 2통 기준\n\n- 근해  섬비치 2탱크 기준 : 9만원\n\n- 근해  섬보팅 2탱크 기준 : 11만원\n\n\n- 체험다이빙 9만원\n\n- 펀다이빙 2회 9만원\n\n- 초급교육 50만원 (자격증 코스) : 해양실습 포함, 숙박 포함(2박 3일)",
 *         "preparation": "보물섬 남해 바닷속 진정한 보물을 경험해 보고 싶은 마음가짐",
 *         "address": "경상남도 남해군 미조면 미조리 19",
 *         "address_detail": {
 *             "text": "남해 미조잠수",
 *             "meet_area": "남해군 미조면 미조리 19-85",
 *             "location": {
 *                 "lat": 34.7113159,
 *                 "lng": 128.0525407
 *             },
 *             "mapImg": "https://maps.googleapis.com/maps/api/staticmap?key=AIzaSyBmH8xZ6avKGaILXaCLujhU7J3WLL3cwJU&center=34.7113159%2C128.0525407&zoom=16&size=600x300&maptype=roadmap&markers=color%3Ablue%7Clabel%3AW%7C34.7113159%2C128.0525407",
 *             "locationActivity": {
 *                 "lat": 34.7113159,
 *                 "lng": 128.0525407
 *             },
 *             "area": "경상"
 *         },
 *         "refund_policy": "[환불규정]\n- 위킨 신청 마감 3일 이전 취소 : 전액 환불\n- 위킨 신청 마감 2일 이전 취소 : 결제 금액의 30프로 배상 후 환불\n- 위킨 신청 마감 1일 이전 취소 : 결제 금액의 40프로 배상 후 환불\n- 위킨 신청 마감 시간 이후 취소 : 환불 불가",
 *         "count": 1278,
 *         "confirm_date": "2017-11-19T07:45:41.364Z",
 *         "isteamorpeople": "people",
 *         "category": "익스트림",
 *         "category_two": "정보없음",
 *         "start_date": "2017-11-18T12:08:08.000Z",
 *         "end_date": "2018-02-01T12:08:00.000Z",
 *         "due_date": 1,
 *         "base_start_time": "2017-11-19T07:44:03.437Z",
 *         "base_price": 45000,
 *         "base_min_user": 0,
 *         "base_max_user": 0,
 *         "base_price_option": [
 *             {
 *                 "name": "기본",
 *                 "price": "0"
 *             },
 *             {
 *                 "name": "섬보팅 2탱크 기준",
 *                 "price": "20000"
 *             },
 *             {
 *                 "name": "초급교육코스",
 *                 "price": "410000"
 *             }
 *         ],
 *         "base_extra_price_option": [
 *             {
 *                 "name": "대인",
 *                 "price": "0"
 *             }
 *         ],
 *         "base_week_option": {
 *             "Su": {
 *                 "price_with_time": [
 *                     0
 *                 ],
 *                 "start_time": [
 *                     "08:00"
 *                 ],
 *                 "min_user": "1",
 *                 "max_user": "20"
 *             },
 *             "Tu": {
 *                 "price_with_time": [
 *                     0
 *                 ],
 *                 "start_time": [
 *                     "08:00"
 *                 ],
 *                 "min_user": "1",
 *                 "max_user": "20"
 *             },
 *             "We": {
 *                 "price_with_time": [
 *                     0
 *                 ],
 *                 "start_time": [
 *                     "08:00"
 *                 ],
 *                 "min_user": "1",
 *                 "max_user": "20"
 *             },
 *             "Th": {
 *                 "price_with_time": [
 *                     0
 *                 ],
 *                 "start_time": [
 *                     "08:00"
 *                 ],
 *                 "min_user": "1",
 *                 "max_user": "20"
 *             },
 *             "Fr": {
 *                 "price_with_time": [
 *                     0
 *                 ],
 *                 "start_time": [
 *                     "08:00"
 *                 ],
 *                 "min_user": "1",
 *                 "max_user": "20"
 *             },
 *             "Sa": {
 *                 "price_with_time": [
 *                     0
 *                 ],
 *                 "start_time": [
 *                     "08:00"
 *                 ],
 *                 "min_user": "1",
 *                 "max_user": "20"
 *             },
 *             "Mo": {
 *                 "price_with_time": [
 *                     0
 *                 ],
 *                 "start_time": [
 *                     "08:00"
 *                 ],
 *                 "min_user": "1",
 *                 "max_user": "20"
 *             }
 *         },
 *         "close_dates": [
 *             "171224",
 *             "171225"
 *         ],
 *         "is_it_ticket": false,
 *         "ticket_due_date": null,
 *         "ticket_max_apply": null,
 *         "comision": 0,
 *         "start_date_list": [
 *             "2017-11-18T21:08:08+09:00",
 *             "2018-01-30T21:08:08+09:00"
 *         ],
 *         "detail_question": {
 *             "question1": {
 *                 "name": "",
 *                 "images": []
 *             },
 *             "question2": {
 *                 "name": "",
 *                 "images": []
 *             },
 *             "question3": {
 *                 "name": "",
 *                 "images": []
 *             },
 *             "question4": {
 *                 "name": "",
 *                 "images": []
 *             },
 *             "question5": {
 *                 "name": "",
 *                 "images": []
 *             }
 *         },
 *         "price_before_discount": 90000,
 *         "created_at": "2017-07-21T10:28:27.315Z",
 *         "updated_at": "2017-12-05T18:10:19.579Z",
 *         "deleted_at": null,
 *         "rating_avg": null,
 *         "review_count": "0",
 *         "wekinnew_count": null,
 *         "Host": {
 *             "host_key": 32,
 *             "user_key": 247,
 *             "introduce": "남해군 미조면에 위치한 다이빙샵입니다.\n다이빙 전용 쾌속선으로 남해의 다체로운 포인트를 탐험하러 갑니다. 편리하고 쾌적한 시설과 친절함은 기본이죠!",
 *             "email": "milrano04@naver.com",
 *             "history": "2015년09월 다이빙 리조트 신축\n2016년05월 다이빙 전용 쾌속선 출동 \n~ing 열띤 성원 속에 영업중",
 *             "profile_image": "https://firebasestorage.googleapis.com/v0/b/wekin-9111d.appspot.com/o/img%2Fimage730%2F2017%2F7%2F23%2F5542.png?alt=media",
 *             "name": "남해미조잠수 리조트",
 *             "tel": "010-5385-1241",
 *             "address": "경상남도 남해군 미조면 미조로 168",
 *             "sns": null,
 *             "business_registration": "https://firebasestorage.googleapis.com/v0/b/wekin-9111d.appspot.com/o/img%2Fimage730%2F2017%2F7%2F23%2F1934.png?alt=media",
 *             "license": null,
 *             "license_list": null,
 *             "type": 2,
 *             "join_method": "지인소개",
 *             "home_page": "www.미조잠수.com",
 *             "status": 3,
 *             "language": null,
 *             "created_at": "2017-07-21T09:06:12.777Z",
 *             "updated_at": "2017-07-21T09:08:07.794Z"
 *         },
 *         "Favorites": [
 *             {
 *                 "fav_key": 92
 *             },
 *             {
 *                 "fav_key": 157
 *             }
 *         ]
 *     }, ...
 * ]
 *
 */
/** @api {post} /activity/front 엑티비티 생성(헤더 필요)
 * 
 * @apiName createActivity
 * @apiGroup activity
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *  {
 *    message: 'success', data: {{ activity DATA }}
 *  }
 */
router.route('/front')
  .get(controllerf.findAllActivity)
  .post(authChk, controllerf.createActivity)

/** @api {get} /activity/search 검색용 엑티비티
 * 
 * @apiName searchAllactivies
 * @apiGroup activity
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *     "popularActivities": [
 *         {
 *             "title": "[SUP] 윤식당의 패들보드를 한강에서 더 즐겨보자",
 *             "activity_key": 26
 *         },
 *페이지 번호         {
 *             "title": "패들보드 위 우아한 요가 교실",
 *             "activity_key": 27
 *         },
 *         {
 *             "title": "드디어 위킨에도 서핑 상륙! 양양최초!최고의 Surf school ",
 *             "activity_key": 141
 *         }
 *     ],
 *     "recommendActivities": [
 *         {
 *             "title": "[이벤트]내 피부에 맞는 천연 보습세럼 만들기 선착순 24명 지원!",
 *             "activity_key": 471,
 *             "wekins": "8" // 결제 인원이 있을경우 결제 수
 *         },
 *         {
 *             "title": "[피아노]콩나물 없이 뉴에이지 배우기!",
 *             "activity_key": 152,
 *             "wekins": "2"
 *         }
 *     ],
 *     "allActivities": [
 *         {
 *             "title": "[SUP] 윤식당의 패들보드를 한강에서 더 즐겨보자",
 *             "activity_key": 26
 *         },
 *         {
 *             "title": "패들보드 위 우아한 요가 교실",
 *             "activity_key": 27
 *         },
 *         {
 *             "title": "[남해 미조잠수] 바닷속 보물찾기",
 *             "activity_key": 85
 *         },
 *         {
 *             "title": "2017 한강종이배 경주대회",
 *             "activity_key": 33
 *         }, ....
 *     ]
 * }
 */
router.route('/search')
  .get(controllerf.searchAllactivies )

/** @api {get} /activity/front/category/detail/:key/:how_many/:offset [모바일] 1차 카테고리 엑티비티 조회 
 * 
 * @apiParam {Number} key 카테고리 키
 * categoryDetail = {
 *     0: '투어/여행',
 *     1: '익스트림',
 *     2: '스포츠',
 *     3: '음악',
 *     4: '댄스',
 *     5: '뷰티',
 *     6: '요리',
 *     7: '아트',
 *     8: '축제',
 *     9: '힐링',
 *     10: '아웃도어',
 *     11: '요가/피트니스',
 *     12: '소품제작'
 *   }
 * @apiParam {Number} how_many 페이지 별 갯수
 * @apiParam {Number} offset 페이지 번호
 *
 * @apiName getActivityWithDetailCategory 
 * @apiGroup activity
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *  {
 *    message: 'success', data: [ {{ activities DATA }} ]
 *  }
 * }
 */
router.route('/front/category/detail/:key/:how_many/:offset')
    .get(controllerf.getActivityWithDetailCateogry)

/** @api {get} /activity/front/category/:key/:how_many/:offset [모바일] 2차 카테고리 엑티비티 조회 
 * 
 * @apiParam {Number} key 카테고리 키
 *   let category = {
 *     0: [ '투어/여행', '익스트림(레저)', '스포츠(구기종목)', '힐링', '아웃도어'],
 *     1: [ '투어/여행', '익스트림(레저)', '스포츠(구기종목)', '음악', '댄스', '뷰티', '요리', '아트', '힐링', '아웃도어', '요가/피트니스', '소품제작' ],
 *     2: [ '투어/여행', '익스트림(레저)', '스포츠(구기종목)', '힐링',  '아웃도어' ],
 *     3: [ '힐링', '아웃도어', '요가/피트니스' ],
 *     4: [ '스포츠(구기종목)', '음악', '댄스', '뷰티', '요리', '아트', '아웃도어', '요가/피트니스', '소품제작' ],
 *     5: [ '뷰티', '아트', '소품제작' ],
 *     6: [ '음악', '댄스', '뷰티', '요리', '아트', '요가/피트니스', '소품제작' ],
 *   }
 * @apiParam {Number} how_many 페이지 별 갯수
 * @apiParam {Number} offset 페이지 번호
 *
 * @apiName getActivityWithDetailCategory 
 * @apiGroup activity
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *  {
 *    message: 'success', data: [ {{ activities DATA }} ]
 *  }
 * }
 */
router.route('/front/category/:key/:how_many/:offset')
    .get(controllerf.getActivityWithCateogry)

router.route('/front/period/:key/')
  .get(controllerf.findAllActivity)

/** @api {get} /activity/admin [어드민] 엑티비티 조회 
 * 
 * @apiName findAllActivityForAdmin
 * @apiGroup activity
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *  {
 *    message: 'success', data: [ {{ activities DATA }} ]
 *  }
 * }
 */
router.route('/admin')
  .get(controllerf.findAllActivityForAdmin)

/** @api {delete} /activity/admin/:activity_key [어드민] 엑티비티 삭제
 * 
 * @apiParam {Number} activity_key 엑티비티 키 
 * @apiName forceDeleteActivity
 * @apiGroup activity
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *  {
 *    message: 'success', data: {{ activities DATA }}
 *  }
 * }
 */
router.route('/admin/:activity_key')
  .delete(authChk, controllerf.forceDeleteActivity)


/** @api {get} /activity/:activity_key 엑티비티 디테일 
 * 
 * @apiParam {Number} activity_key 엑티비티 키 
 * @apiName findOneActivity
 * @apiGroup activity
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *  {
 *    {{ activities DATA }}
 *  }
 * }
 */
/** @api {put} /activity/:activity_key 엑티비티 디테일 
 * 
 * @apiParam {Number} activity_key 엑티비티키 
 * @apiParam {STRING} activity 엑티비티정보들
 * @apiName updateActivity 
 * @apiGroup activity
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *  {
 *    {{ activities DATA }}
 *  }
 * }
 */
router.route('/front/:activity_key')
  .get(controllerf.findOneActivity)
  .put(authChk, controllerf.updateActivity)
  .delete(authChk, controllerf.deleteActivity)

/** @api {get} /activity/front/wekin/:wekin_key/wekiner 엑티비티 결제인원 조회
 * 
 * @apiParam {Number} wekin_key 엑티비티키 
 * @apiName findWekiner
 * @apiGroup activity
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *     "message": "success",
 *     "data": [
 *         {
 *             "wekin_key": 102,
 *             "activity_key": 471,
 *             "user_key": 2092,
 *             "final_price": 10000,
 *             "start_date": "2017-12-09T00:29:00.000Z",
 *             "start_time": "1991-04-12T11:00:00.000Z",
 *             "select_option": {
 *                 "selectedYoil": "Sa",
 *                 "currentUserOfSelectedDate": 4,
 *                 "startTime": [
 *                     "11:00",
 *                     "0"
 *                 ],
 *                 "selectedOption": [
 *                     "기본",
 *                     "0"
 *                 ],
 *                 "selectedExtraOption": {
 *                     "0": 1,
 *                     "1": 0,
 *                     "2": 0
 *                 },
 *                 "max_user": "12"
 *             },
 *             "pay_amount": 1,
 *             "state": "paid",
 *             "created_at": "2017-11-28T04:13:00.222Z",
 *             "updated_at": "2017-12-05T04:34:13.845Z",
 *             "deleted_at": null,
 *             "User": {
 *                 "profile_image": "/static/images/default-profile.png",
 *                 "user_key": 2092,
 *                 "name": "이성은",
 *                 "phone": "01033457468"
 *             },
 *             "ActivityNew": {
 *                 "activity_key": 471,
 *                 "host_key": 56,
 *                 "status": 3,
 *                 "main_image": {
 *                     "image": [
 *                         "https://firebasestorage.googleapis.com/v0/b/wekin-9111d.appspot.com/o/images%2Ftest%2F2017%2F11%2F27%2F4010.png?alt=media"
 *                     ]
 *                 },
 *                 "title": "[이벤트]내 피부에 맞는 천연 보습세럼 만들기 선착순 24명 지원!",
 *                 "intro_summary": null,
 *                 "intro_detail": "<p style=\"text-align: centerbr>",
 *                 "schedule": "활동 시간 총 80분 정도 소요",
 *                 "inclusion": "부가세 , 강사료, 도구 재료비 포함",
 *                 "preparation": "앞치마, 필기도구",
 *                 "address": "서울특별시 서초구 반포동 735-34  나우빌딩 5층",
 *                 "address_detail": {
 *                     "text": "서울시 서초구 반포동 강남대로 83길 34 나우빌딩 5층",
 *                     "meet_area": "서울시 서초구 반포동 강남대로 83길 34  나우빌딩 5층",
 *                     "location": {
 *                         "lat": 37.506293,
 *                         "lng": 127.022328
 *                     },
 *                     "mapImg": "https://maps.googleapis.com/maps/api/staticmap?key=AIzaSyBmH8xZ6avKGaILXaCLujhU7J3WLL3cwJU&center=37.506293%2C127.022328&zoom=16&size=600x300&maptype=roadmap&markers=color%3Ablue%7Clabel%3AW%7C37.506293%2C127.022328",
 *                     "locationActivity": {
 *                         "lat": 37.506293,
 *                         "lng": 127.022328
 *                     },
 *                     "area": "서울"
 *                 },
 *                 "refund_policy": "[환불규정]\n- 위킨 신청 마감 3일 이전 취소 : 전액 환불\n- 위킨 신청 마감 2일 이전 취소 : 결제 금액의 30프로 배상 후 환불\n- 위킨 신청 마감 1일 이전 취소 : 결제 금액의 40프로 배상 후 환불\n- 위킨 신청 마감 시간 이후 취소 : 환불 불가",
 *                 "count": 846,
 *                 "confirm_date": "2017-11-27T01:12:02.604Z",
 *                 "isteamorpeople": "people",
 *                 "category": "뷰티",
 *                 "category_two": "임시 카테고리",
 *                 "start_date": "2017-12-08T00:29:00.000Z",
 *                 "end_date": "2017-12-10T00:29:00.000Z",
 *                 "due_date": 1,
 *                 "base_start_time": "2017-11-27T00:59:32.565Z",
 *                 "base_price": 10000,
 *                 "base_min_user": 0,
 *                 "base_max_user": 0,
 *                 "base_price_option": [
 *                     {
 *                         "name": "기본",
 *                         "price": "0"
 *                     }
 *                 ],
 *                 "base_extra_price_option": [
 *                     {
 *                         "name": "대인",
 *                         "price": "0"
 *                     }
 *                 ],
 *                 "base_week_option": {
 *                     "Su": {
 *                         "price_with_time": [],
 *                         "start_time": [],
 *                         "min_user": "0",
 *                         "max_user": "0"
 *                     },
 *                     "Tu": {
 *                         "price_with_time": [],
 *                         "start_time": [],
 *                         "min_user": "0",
 *                         "max_user": "0"
 *                     },
 *                     "We": {
 *                         "price_with_time": [],
 *                         "start_time": [],
 *                         "min_user": "0",
 *                         "max_user": "0"
 *                     },
 *                     "Th": {
 *                         "price_with_time": [],
 *                         "start_time": [],
 *                         "min_user": "0",
 *                         "max_user": "0"
 *                     },
 *                     "Fr": {
 *                         "price_with_time": [
 *                             "0"
 *                         ],
 *                         "start_time": [
 *                             "14:00"
 *                         ],
 *                         "min_user": "12",
 *                         "max_user": "12"
 *                     },
 *                     "Sa": {
 *                         "price_with_time": [
 *                             "0"
 *                         ],
 *                         "start_time": [
 *                             "11:00"
 *                         ],
 *                         "min_user": "12",
 *                         "max_user": "12"
 *                     },
 *                     "Mo": {
 *                         "price_with_time": [],
 *                         "start_time": [],
 *                         "min_user": "0",
 *                         "max_user": "0"
 *                     }
 *                 },
 *                 "close_dates": [],
 *                 "is_it_ticket": false,
 *                 "ticket_due_date": null,
 *                 "ticket_max_apply": null,
 *                 "comision": 0,
 *                 "start_date_list": [
 *                     "2017-12-08T00:29:00+00:00",
 *                     "2017-12-09T00:29:00+00:00"
 *                 ],
 *                 "detail_question": {
 *                     "question1": {
 *                         "name": "",
 *                         "images": [
 *                             "https://firebasestorage.googleapis.com/v0/b/wekin-9111d.appspot.com/o/img%2Fimage%2F2017%2F11%2F27%2F9248?alt=media&token=8d15290b-ccea-410c-9cd1-df2bec4c0b6a?alt=media"
 *                         ],
 *                         "text": "피부에 안전한 천연원료들을 사용해 피부타입에 맞는 천연보습제를 직접 만들어보는 시간입니다.\n"
 *                     },
 *                     "question2": {
 *                         "name": "",
 *                         "images": [
 *                             "https://firebasestorage.googleapis.com/v0/b/wekin-9111d.appspot.com/o/img%2Fimage%2F2017%2F11%2F27%2F14460?alt=media&token=3e21dd66-b7f5-4436-8d1f-aed53bae8693?alt=media"
 *                         ],
 *                         "text": "자신의 피부에 맞는 천연 보습제를 만들고 피부변화를 느껴보세요~"
 *                     },
 *                     "question3": {
 *                         "name": "",
 *                         "images": [
 *                             "https://firebasestorage.googleapis.com/v0/b/wekin-9111d.appspot.com/o/img%2Fimage%2F2017%2F11%2F27%2F39477?alt=media&token=f4e621a4-61c3-4d8a-af0f-0fcae567f52f?alt=media",
 *                         ],
 *                         "text": "[천연 보습세럼 만들기 진행 순서]\n\n1. 재료에 대해 알아 보기\n2. 천연 화장품에 대한 간단한 소개\n3. 제작 방법 소개\n4. 직접 만들어 보기\n\n*모든 활동은 캠벨트리 아트 이가은 메이커님과 함께 진행됩니다.^^"
 *                     },
 *                     "question4": {
 *                         "name": "",
 *                         "images": [],
 *                         "text": ""
 *                     },
 *                     "question5": {
 *                         "name": "",
 *                         "images": [
 *                             "https://firebasestorage.googleapis.com/v0/b/wekin-9111d.appspot.com/o/img%2Fimage%2F2017%2F11%2F27%2F10951?alt=media&token=8e303b4d-c0a3-4fe5-9625-52e48a0b833c?alt=media",
 *                         ],
 *                         "text": "[이런 분들께 추천해요!]\n\n1. 피부가 예민하신 분들\n-아무 화장품이나 쓰지 못하시는 분들! 추천해요.\n\n2. 나에게 맞는 보습제를 찾지 못하신 분들\n-여러 제품 찾지말고 내 피부에 맞춰 만들어보는 건 어떨까요?\n\n3. 천연화장품에 관심 있으신 분들\n-한번쯤 만들어보고 싶었지만 기회가 없었던 분들! 어렵지 않으니 한번 체험해 보세요.^^\n\n"
 *                     }
 *                 },
 *                 "price_before_discount": 80000,
 *                 "created_at": "2017-11-27T00:59:32.570Z",
 *                 "updated_at": "2017-12-06T06:13:50.073Z",
 *                 "deleted_at": null
 *             }
 *         },
 *  }
 * }
 */
router.route('/front/wekin/:wekin_key/wekiner')
  .get(controllerf.findWekiner)

/** @api {get} activity/front/host/:host_key/ 호스트 엑티비티 조회 
 * 
 * @apiName findAllActivityOfHost
 * @apiGroup activity
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *  {
 *    message: 'success', data: [ {{ activities DATA }} ]
 *  }
 * }
 */
router.route('/front/host/:host_key/')
  .get(controllerf.findAllActivityOfHost)

/** @api {get} /activity/front/host/:host_key/recently 최근 호스트 엑티비티 조회 
 * 
 * @apiName findAllRecentlyActivityOfHost
 * @apiGroup activity
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *  {
 *    message: 'success', data: [ {{ activities DATA }} ]
 *  }
 * }
 */
router.route('/front/host/:host_key/recently')
  .get(controllerf.findAllRecentlyActivityOfHost)

/** @api {get} /activity/approve [어드민] 승인엑티비티 조회
 * 
 * @apiName getApproveList
 * @apiGroup activity
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *  {
 *    message: 'success', data: [ {{ activities DATA }} ]
 *  }
 * }
 */
router.get('/approve/', controller.getApproveList)

/** @api {put} /activity/approve/:activity_key [어드민] 엑티비티승인 
 * 
 * @apiName getApproveActivity
 * @apiGroup activity
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *  {
 *    message: 'success', data: [ {{ activities DATA }} ]
 *  }
 * }
 */
router.put('/approve/:activity_key', controller.getApproveActivity)

router.delete('/approve/:activity_key', controller.deleteAvtivity)

router.post('/approve/:activity_key', controller.rejectActivity)

/** @api {get} /activity/filter/mobile [모바일] 엑티비티필터
 * 
 * @apiName filterActivity
 * @apiGroup activity
 * @apiParam {String} location 예)"["경기", "서울"...]"
 * @apiParam {String} category 예)"힐링"
 * @apiParam {String} date 예)"[new Date('시작일').ISOString(), new Date('종료일').ISOString()]"
 * @apiParam {String} price 예)"[시작 가격, 끝가격(무제한은9999로 주세요, 만원단위)]"
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *  {
 *    message: 'success', data: [ {{ activities }} ]
 *  }
 * }
 */
router.get('/filter/mobile', 
  (req, res, next) => {
    let query = req.query
    let json = (string) => { return JSON.parse(string) }
    if (query.location == '[]') {
      var locations = ['서울', '경기', '강원', '충청', '경상', '전라', '제주', '해외']
    } else {
      var locations = json(query.location) 
    }
    if (query.category == '[]') {
      var category = ['투어/여행', '익스트림', '스포츠', '음악', '댄스', '뷰티', '요리', '아트', '축제', '힐링', '아웃도어', '요가/피트니스', '소품제작']
    } else {
      var category = json(query.category) 
    }
    model.ActivityNew.findAll(
      { 
        where: {
          address_detail: {
            area: {
              $in: locations
            }
          },
          category: {
            $in: category 
          },
          base_price: {
            $gte: json(query.price)[0] * 10000,
            $lte: json(query.price)[1] * 10000
          },
          status: 3
        },
        attributes: [
          [model.Sequelize.fn('AVG', model.Sequelize.col('Docs.activity_rating')), 'rating_avg'],
          [model.Sequelize.fn('COUNT', model.Sequelize.fn('DISTINCT', model.Sequelize.col('Docs.doc_key'))), 'review_count'],
          'activity_key', 'main_image', 'address', 'address_detail', 'base_price', 'title', 'status', 'start_date_list' 
        ],
        include: [
          {
            model: model.Host,
            include: {
              model: model.User,
              attributes: []
            },
            group: ['User.user_key']
          }, {
            model: model.Doc,
            attributes: [],
            where: { type: 1 },
            required: false,
            duplicating: false
          }
        ],
        group: ['ActivityNew.activity_key', 'Docs.doc_key', 'Host.host_key'],
      }
    )
      .then(activities => {
        if (query.date == '[]') {
          var date = []
        } else {
          var date = json(query.date) 
        }
        if (date.length > 0) {
          let result = []
          let length = activities.length
          let startDate = moment(json(query.date)[0]) || moment('1991-04-12')
          let endDate = moment(json(query.date)[1]) || moment('2074-01-01')
          for (let i = 0; i < length; i++) {
            let activity = activities[i]
            // 시작일과 종료일 그리고 스타트 데이 리스트가 있다. 이를 어떻게 비교할것인가?
            for (let ii = 0; ii < activity.start_date_list.length; ii++) {
              let date = moment(activity.start_date_list[ii])
              if (date > startDate && date < endDate) {
                result.push(activity)
                break;
              }
            }
          }
          res.json({ message: 'success', data: result })
        } else {
          res.json({ message: 'success', data: activities })
        }
      })
      .catch(error => next(error))
  }
)

/** @api {get} /activity/wetiful/:status/:size?/:page? 위티플 status 필터
 * 
 * @apiName WetifulStatus
 * @apiGroup activity
 * @apiParam {String} status 상태['both', 'wekin', 'wetiful']
 * @apiParam {Number} size (옵션)페이지별 갯수 
 * @apiParam {Number} page (옵션)페이지 
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *  {
 *    message: 'success', data: [ {{ activities DATA }} ]
 *  }
 * }
 */
router.get('/wetiful/:status/:size?/:page?', 
  (req, res, next) => {
    let status = req.params.status
    let size  = req.params.size 
    let page  = req.params.page 
    if (status === 'both') {
      model.ActivityNew.findAll({
        where: {
          status_wetiful: 'both',
          status: 3
        },
        order: ['confirm_date'],
        limit: size || 1000,
        offset: (page || 0) * (size || 10)
      })
        .then(activities => {
          res.json({ message: 'success', data: activities })
        })
        .catch(error => next(error))
    } else if (status === 'wekin') {
      model.ActivityNew.findAll({
        where: {
          status_wetiful: 'wekin',
          status: 3
        },
        order: ['confirm_date'],
        limit: size || 1000,
        offset: (page || 0) * (size || 10)
      })
        .then(activities => {
          res.json({ message: 'success', data: activities })
        })
        .catch(error => next(error))
    } else {
      model.ActivityNew.findAll({
        where: {
          status_wetiful: 'wetiful',
          status: 3
        },
        order: ['confirm_date'],
        limit: size || 1000,
        offset: (page || 0) * (size || 10)
      })
        .then(activities => {
          res.json({ message: 'success', data: activities })
        })
        .catch(error => next(error))
    }
  })

module.exports = router 
