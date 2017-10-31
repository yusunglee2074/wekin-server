const express = require('express')
const bodyParser = require('body-parser')
const fireHelper = require('./util/firebase')
const returnMsg = require('./return.msg')
const expressValidator = require('express-validator')
const fetcher = require('express-param')
const { auchChk, adminChk } = require('./api/v1/service')
const compression = require('compression')

const app = express()
app.use(compression());
const CURRENT_API_VERSION = '/v1'

const allowCORS = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'x-access-token, Content-Type, Authorization, Content-Length, X-Requested-With');
  (req.method === 'OPTIONS') ? res.sendStatus(200) : next()
}

app.use(allowCORS)
app.use(fetcher())
app.use(expressValidator())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/apidoc', express.static('public'))

app.use(`${CURRENT_API_VERSION}/user`, require('./api/v2/user'))
app.use(`${CURRENT_API_VERSION}/activity`, require('./api/v2/activity'))
app.use(`${CURRENT_API_VERSION}/board`, require('./api/v1/board'))
app.use(`${CURRENT_API_VERSION}/env`, require('./api/v1/environment'))
app.use(`${CURRENT_API_VERSION}/doc`, require('./api/v1/doc'))
app.use(`${CURRENT_API_VERSION}/wekin`, require('./api/v2/wekin'))
app.use(`${CURRENT_API_VERSION}/host`, require('./api/v2/host'))
app.use(`${CURRENT_API_VERSION}/util`, require('./api/v1/util'))
app.use(`${CURRENT_API_VERSION}/noti`, require('./api/v1/noti'))
app.use(`${CURRENT_API_VERSION}/dashboard`, require('./api/v1/dashboard'))
app.use(`${CURRENT_API_VERSION}/order`, require('./api/v2/order'))
app.use(`${CURRENT_API_VERSION}/favorite`, require('./api/v2/favorite'))
app.use(`${CURRENT_API_VERSION}/follow`, require('./api/v1/follow'))
app.use(`${CURRENT_API_VERSION}/like`, require('./api/v1/like'))
app.use(`${CURRENT_API_VERSION}/waiting`, require('./api/v1/waiting'))
app.use(`${CURRENT_API_VERSION}/iamport`, require('./api/v2/util/iamport'))
app.use(`${CURRENT_API_VERSION}/home`, require('./api/v2/home'))
app.use(`${CURRENT_API_VERSION}/qna`, require('./api/v2/qna'))
app.use(`${CURRENT_API_VERSION}/admin/front`, require('./api/v2/admin'))
app.use(`${CURRENT_API_VERSION}/point`, require('./api/v2/point'))
app.use(`${CURRENT_API_VERSION}/news`, require('./api/v2/news'))
app.use(
  function errorHandler(err, req, res, next) {
    let error = JSON.stringify(err)
    console.log("에러")
    res.status(501)
    console.log(err)
    if (error == '{}') {
      res.json({ message: err.message, data: err})
    } else {
      res.json({ 'message': 'error', data: error  })
    }
  }
)
module.exports = app;
