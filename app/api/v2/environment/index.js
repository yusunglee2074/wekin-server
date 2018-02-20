/**
 * type : 공지사항, FAQ 등의 타입
 * name : 카테고리, 멘트, 설정 등의 종류
 */
const express = require('express')
const router = express.Router()

const controller = require('./controller')

/** @api {get} /env/:type/:name enviroment 조회
 * 
 * @apiName getData 
 * @apiParam {String} type 예)main
 * @apiParam {String} name 예)banner
 * @apiGroup enviroment 
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * [
 *     {
 *         "value": {
 *             "url": "https://firebasestorage.googleapis.com/v0/b/wekin-9111d.appspot.com/o/images%2Ftest%2F2017%2F9%2F1%2F21791.png?alt=media",
 *             "detailUrl": "https://firebasestorage.googleapis.com/v0/b/wekin-9111d.appspot.com/o/images%2Ftest%2F2017%2F9%2F1%2F24761.png?alt=media",
 *             "order": "5"
 *         },
 *         "env_key": 58,
 *         "description": "메이커 위킨 등록 수수료 무료!"
 *     }, ...
 *]
 */
router.get('/:type/:name', controller.getData)

/** @api {post} /env/:type/:name [어드민] enviroment 작성
 * 
 * @apiName getData 
 * @apiParam {String} type 예)main
 * @apiParam {String} name 예)banner
 * @apiParam {String} value 내용
 * @apiParam {String} description 부가설명
 * @apiGroup enviroment 
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *{
 *  "value": {
 *     "url": "https://firebasestorage.googleapis.com/v0/b/wekin-9111d.appspot.com/o/images%2Ftest%2F2017%2F9%2F1%2F21791.png?alt=media",
 *     "detailUrl": "https://firebasestorage.googleapis.com/v0/b/wekin-9111d.appspot.com/o/images%2Ftest%2F2017%2F9%2F1%2F24761.png?alt=media",
 *     "order": "5"
 *   },
 *  "env_key": 58,
 *  "description": "메이커 위킨 등록 수수료 무료!"
 *}
 */
router.post('/:type/:name', controller.postData)


router.get('/client-ip', (req, res, next) => {
  console.log(req.headers, req.connection.remoteAddress, '###')
  let ip = req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'][0] : '아이피 확인불가'
  if (ip.length > 10) {
    res.send(ip)
  } else {
    ip = req.connection.remoteAddress;
    res.send(ip.slice(7, 90))
  }
})

router.put('/:type/:name', controller.putData)


/** @api {delete} /env/:type/:name/:key [어드민] enviroment 삭제
 * 
 * @apiName getData 
 * @apiParam {String} type 예)main
 * @apiParam {String} name 예)banner
 * @apiParam {String} key env 키
 * @apiGroup enviroment 
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *{
 *  "value": {
 *     "url": "https://firebasestorage.googleapis.com/v0/b/wekin-9111d.appspot.com/o/images%2Ftest%2F2017%2F9%2F1%2F21791.png?alt=media",
 *     "detailUrl": "https://firebasestorage.googleapis.com/v0/b/wekin-9111d.appspot.com/o/images%2Ftest%2F2017%2F9%2F1%2F24761.png?alt=media",
 *     "order": "5"
 *   },
 *  "env_key": 58,
 *  "description": "메이커 위킨 등록 수수료 무료!"
 *}
 */
router.delete('/:type/:name/:key', controller.deleteData)


module.exports = router
