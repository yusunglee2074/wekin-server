const express = require('express')
const router = express.Router()

const controller = require('./controller')

router.post('/hook', controller.importHook)

router.get('/:imp_uid', controller.getResponse)

module.exports = router
