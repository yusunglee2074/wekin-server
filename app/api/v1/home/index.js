const express = require('express')
const router = express.Router()

const controller = require('./controller')

/**
 * @api {get} /home/popularActivity/ 인기 액티비티
 * @apiName popularActivity
 * @apiGroup home
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 */
router.get('/popularActivity', controller.popularActivity)

/**
 * @api {get} /home/popularMaker/ 인기 메이커
 * @apiName popularMaker
 * @apiGroup home
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 */
router.get('/popularMaker', controller.popularMaker)


/**
 * @api {get} /home/popularFeed/ 인기 피드
 * @apiName popularFeed
 * @apiGroup home
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 */
router.get('/popularFeed', controller.popularFeed)


/**
 * @api {get} /home/newestActivity/ 신규 액티비티
 * @apiName newestActivity
 * @apiGroup home
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 */
router.get('/newestActivity', controller.newestActivity)

module.exports = router