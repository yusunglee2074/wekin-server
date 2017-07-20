const admin = require('firebase-admin')
const serviceAccount = require('./wekin-9111d-firebase-adminsdk-x0u3u-931d26523a.json')
const getValidationRef = phoneNumber => admin.database().ref(`validation/${phoneNumber}`)

exports.init = () => {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://wekin-9111d.firebaseio.com'
  })
}
exports.admin = admin

exports.verifyFireToken = (token) => {
  return new Promise((resolve, reject) => {
    admin.auth().verifyIdToken(token).then(resolve).catch(reject)
  })
}
exports.verifyIdToken = (idToken) => {
  return admin.auth().verifyIdToken(idToken)
}

/**
 * @argument {String} uid Uniq ID 입력
 * @return {String} customToken 반환
 */
exports.createCustomToken = (uid, additionalClaims) => {
  return admin.auth().createCustomToken(`wekin_${uid}`, additionalClaims)
}

exports.verifySmsCode = (phoneNumber, verifyCode) => {
  let ref = getValidationRef(phoneNumber)
  return ref.once('value').then((data) => {
    if (data.val().expiredTime <= new Date().getTime()) {
      return false
    } else if (data.val().verifyCode === verifyCode) {
      return true
    } else {
      return false
    }
  })
}
exports.sendSmsValidationCode = (phoneNumber) => {
  const EXPIRED_SECONDS = 180
  const VALIDATION_CODE_LENGTH = 5

  let verifyCode = createRandomNumber(VALIDATION_CODE_LENGTH)
  let expiredTime = calculateExpiredTime(EXPIRED_SECONDS)

  let ref = getValidationRef(phoneNumber)
  ref.set({
    verifyCode: verifyCode,
    expiredTime: expiredTime
  })
  return verifyCode
}

function calculateExpiredTime (second) {
  let date = new Date()
  date.setDate(date.getDate() + (second / 24 / 60 / 60))
  return date.getTime()
}

function createRandomNumber (length) {
  let randomNum = {}
  randomNum.random = (n1, n2) => {
    return parseInt(Math.random() * (n2 - n1 + 1)) + n1
  }
  let value = ''
  for (var i = 0; i < length; i++) {
    value += randomNum.random(0, 9)
  }
  return value
}