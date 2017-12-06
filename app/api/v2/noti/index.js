const express = require('express')
const router = express.Router()

const controller = require('./controller')

router.post('/:user_key', controller.postNoti)

router.get('/', controller.getNoti)



module.exports = router
