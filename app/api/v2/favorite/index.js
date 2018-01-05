const express = require('express')
const router = express.Router()
const model = require('./../../../model')

const controller = require('./controller')

/** @api {get} /favorite/:user_key 유저 관심 엑티비티
 * 
 * @apiName getData
 * @apiGroup favorite
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * [
 *     {
 *         "fav_key": 5,
 *         "user_key": 22,
 *         "activity_key": 8,
 *         "created_at": "2017-07-05T07:43:25.600Z",
 *         "updated_at": "2017-07-05T07:43:25.600Z",
 *         "ActivityNew": { }
 *     }, ...
 * ]
 */
router.get('/:user_key', controller.getData)

/** @api {put} /favorite/:user_key/:activity_key 관심 토글
 * 
 * @apiName putData
 * @apiGroup favorite
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *     "fav_key": 376,
 *     "user_key": 2,
 *     "activity_key": 8,
 *     "updated_at": "2017-12-06T07:23:54.898Z",
 *     "created_at": "2017-12-06T07:23:54.898Z"
 * }
 * or
 * 1
 */
router.put('/:user_key/:activity_key', controller.putData)


/** @api {get} /favorite/:host_key 호스트의 모든 엑티비티 관심등록 갯수 
 * 
 * @apiName hostFavorite
 * @apiGroup favorite
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *     "fav_key": 376,
 *     "user_key": 2,
 *     "activity_key": 8,
 *     "updated_at": "2017-12-06T07:23:54.898Z",
 *     "created_at": "2017-12-06T07:23:54.898Z"
 * }
 * or
 * 1
 */
router.get('/host/:host_key', (req, res, next) => {
  let hostKey = req.params.host_key
  let hostActivity = []
  model.ActivityNew.findAll({
    where: {
      host_key: hostKey
    },
    attributes: ['activity_key']
  })
    .then(activities => {
      for (let i = 0; i < activities.length; i++) {
        hostActivity.push(activities[i].activity_key)
      }
    })
    .then(() => {
      return model.Favorite.count({
        where: {
          activity_key: {
            $in: hostActivity
          }
        }
      })
    })
    .then(favs => {
      res.json({ message: 'success', data: favs })
    })
    .catch(error => next(error))
})

module.exports = router
