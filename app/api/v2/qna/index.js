const express = require('express')
const router = express.Router()
const service = require('../service')

const controller = require('./controller')

router.get('/', controller.getQna)

router.post('/:activity_key', service.authChk, controller.postQna)

router.delete('/:doc_key', service.authChk,controller.deleteQna)

router.post('/:doc_key/reply', service.authChk,controller.postReply)

router.put('/:doc_key/reply', service.authChk,controller.putReply)

module.exports = router