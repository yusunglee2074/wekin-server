const express = require('express')
const router = express.Router()

const controller = require('./controller')

router.post('/:wekin_key', controller.applyWaiting)

router.delete('/:wekin_key', controller.cancellWaiting)

router.get('/:wekin_key', controller.confirmWaiting)



module.exports = router
