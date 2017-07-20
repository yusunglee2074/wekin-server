
const request = require('request')
const TARGET_URL = 'https://sslsms.cafe24.com/sms_sender.php'
const USER_ID = 'wekiner'
const USER_KEY = '59b212ca502ffd227ab4aa62de415623'
const BASE_NUMBER = {sphone1: '031', sphone2: '377', sphone3: '0410'};

exports.cafe24Sender = (target, message, title) => {
  return new Promise((resolve, reject) => {
    const base = {
      user_id: USER_ID,
      secure: USER_KEY,
      rphone: target,
      msg:message,
      smsType: 'L',
      title: title
    }
    let param = Object.assign(base, BASE_NUMBER)
    
    request.post({
      url: TARGET_URL,
      method: 'POST',
      form: param
    }, (e, r, b) => {
      if (e) {
        reject(e)
      } else {
        resolve(b)
      }
    })
  })
  
}
