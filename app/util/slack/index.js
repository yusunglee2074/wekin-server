const request = require('request');

const WEBHOOK_URL = 'https://hooks.slack.com/services/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'
const WEBHOOK_CHANNEL = ''
const WEBHOOK_NAME = '위킨데브서버'
const WEBHOOK_EMOJI = ':ghost:'

function sendMessage(msg) {
    return new Promise((resolve, reject) => {
        this.sendMsg(WEBHOOK_CHANNEL, WEBHOOK_NAME, msg)
        .then(resolve).catch(reject)
    })
}

exports.sendMessage = sendMessage

exports.sendMsg = (channel, name, msg) => {
    payload = { channel: channel, username: name, text: msg}
    return new Promise((resolve, reject) => {
        request.post({
            url:WEBHOOK_URL,
            body: JSON.stringify(payload)
        }, (e, r, b) => {
            if (e) {
                reject(e)
            } else {
                resolve(r)
            }
            
        })
    })
}
