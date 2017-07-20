const app = require('./app/index')
const fireHelper = require('./app/util/firebase')
const port = process.env.PORT || 8888

fireHelper.init()


const { utilService } = require('./app/api/v1/service')
const cron = require('./app/api/v1/util/cron')

cron.batch()

app.set('port', port)

app.listen(port, () => {
    console.log(`server start => port : ${port}`)
})