const request = require('request');

const WEBHOOK_URL = 'https://hooks.slack.com/services/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'
const WEBHOOK_CHANNEL = '#wekin-confirm-channel'
const WEBHOOK_NAME = 'wekin!'
const WEBHOOK_EMOJI = ':ghost:'

function sendMessage(msg) {
    return new Promise((resolve, reject) => {
        this.sendMsg(WEBHOOK_CHANNEL, WEBHOOK_NAME, msg)
        .then(resolve).catch(reject)
    })
}

exports.sendMessage = sendMessage

exports.sendMsg = (channel, name, msg) => {
    payload = { channel: channel, username: name, text: msg, icon_emoji: WEBHOOK_EMOJI }
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
