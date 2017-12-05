var fs = require('fs')
var path = require('path')
var config = require('./config')
var Sequelize = require('sequelize')

const DB_PROD = {
  host: '35.189.139.31',
  user: 'postgres',
}
const DB_DEV = {
  host: '35.189.153.138',
  user: 'wekin'
}
const yusungDEV = {
  host: '13.125.79.168',
  user: 'ubuntu',
  dbName: 'test',
  password: 'sjdmlrl4',
}

// const dbTarget = DB_PROD
exports.SNSLoginUrl = 'http://we-kin.com'
const dbTarget = DB_DEV
// exports.SNSLoginUrl = 'http://175.195.139.99:8080'

let dbconf = {
  db: process.env.SQL_DATABASE || dbTarget.dbName || 'wekin',
  user: process.env.SQL_USER || dbTarget.user,
  password: process.env.SQL_PASSWORD || dbTarget.password || 'dnlzlsjwmfru!',
  host: (process.env.INSTANCE_CONNECTION_NAME !== undefined) ? `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}` : dbTarget.host,
}

var sequelize = new Sequelize(dbconf.db, dbconf.user, dbconf.password, {
  dialect: 'postgresql',
  timezone: 'Asia/Seoul',
  host: dbconf.host 
})

var db = {
  User: sequelize.import(path.join(__dirname, 'user.js')),
  Host: sequelize.import(path.join(__dirname, 'host.js')),
  Order: sequelize.import(path.join(__dirname, 'order.js')),
  Doc: sequelize.import(path.join(__dirname, 'doc.js')),
  Comment: sequelize.import(path.join(__dirname, 'comment.js')),
  Board: sequelize.import(path.join(__dirname, 'board.js')),
  Follow: sequelize.import(path.join(__dirname, 'follow.js')),
  Favorite: sequelize.import(path.join(__dirname, 'favorite.js')),
  Env: sequelize.import(path.join(__dirname, 'environment.js')),
  Noti: sequelize.import(path.join(__dirname, 'noti.js')),
  Like: sequelize.import(path.join(__dirname, 'like.js')),
  Waiting: sequelize.import(path.join(__dirname, 'waiting.js')),
  Point: sequelize.import(path.join(__dirname, 'point.js')),
  ActivityNew: sequelize.import(path.join(__dirname, 'activity-new.js')),
  WekinNew: sequelize.import(path.join(__dirname, 'wekin-new.js')),
  News: sequelize.import(path.join(__dirname, 'news.js')),
}

fs.readdirSync(__dirname)
  .filter(function (file) {
    return (file.indexOf('.') !== 0) && (file !== 'index.js' && file !== 'config.js')
  })
  .forEach(function (file) {
    var model = sequelize['import'](path.join(__dirname, file))
    db[model.name] = model
  })

config.initAssociations(db)

/*
db.User.sync()
db.Host.sync()
db.News.sync()
db.Point.sync()
db.ActivityNew.sync()
db.WekinNew.sync()
db.Order.sync()
db.Board.sync()
db.Doc.sync()
db.Comment.sync()
db.Follow.sync()
db.Env.sync()
db.Noti.sync()
db.Like.sync()
db.Favorite.sync()
db.Waiting.sync()
*/

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
