const express = require('express')
const router = express.Router()

const controller = require('./controller')

router.post('/hook', controller.importHook)

module.exports = router