const app = require('./app/index')
const fireHelper = require('./app/util/firebase')
const port = process.env.PORT || 8888

fireHelper.init()


const { utilService } = require('./app/api/v1/service')
const cron = require('./app/api/v2/util/cron')

cron.batch()

//시각 차이 확인
let moment = require('moment')

console.log("얍얍얍")
console.log(moment().format())


app.set('port', port)

app.listen(port, () => {
    console.log(`server start => port : ${port}`)
})
