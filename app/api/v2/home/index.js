const express = require('express')
const router = express.Router()

const controller = require('./controller')

/** @api {get} /home/popularActivity 인기엑티비티
 * 
 * @apiName popularActivity
 * @apiGroup home
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * [ 
 *     {{ activitties }}
 * ] 
 */
router.get('/popularActivity', controller.popularActivity)

/** @api {get} /home/popularMaker 인기엑티비티
 * 
 * @apiName popularMaker
 * @apiGroup home
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * [ 
 *     {{ Makers }}
 * ] 
 */
router.get('/popularMaker', controller.popularMaker)

/** @api {get} /home/popularFeed 인기 피드
 * 
 * @apiName popularFeed
 * @apiGroup home
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * [ 
 *     {{ Feeds }}
 * ] 
 */
router.get('/popularFeed', controller.popularFeed)

/** @api {get} /home/newestActivity 신규 엑티비티
 * 
 * @apiName newestActivity 
 * @apiGroup home
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * [ 
 *     {{ activities }}
 * ] 
 */
router.get('/newestActivity', controller.newestActivity)

module.exports = router
