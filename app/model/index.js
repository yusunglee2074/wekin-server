var fs = require('fs')
var path = require('path')
var config = require('./config')
var Sequelize = require('sequelize')

const DB_PROD = {
  host: '35.189.139.31',
  user: 'postgres'
}
const DB_DEV = {
  host: '35.189.153.138',
  user: 'wekin'
}

const dbTarget = DB_DEV

let dbconf = {
  db: process.env.SQL_DATABASE || 'wekin',
  user: process.env.SQL_USER || dbTarget.user,
  password: process.env.SQL_PASSWORD || 'dnlzlsjwmfru!',
  host: (process.env.INSTANCE_CONNECTION_NAME !== undefined) ? `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}` : dbTarget.host, 
}

var sequelize = new Sequelize(dbconf.db, dbconf.user, dbconf.password, {
  dialect: 'postgresql',
  timezone: '+09:00',
  host: dbconf.host
})

var db = {
  User: sequelize.import(path.join(__dirname, 'user.js')),
  Host: sequelize.import(path.join(__dirname, 'host.js')),
  Activity: sequelize.import(path.join(__dirname, 'activity.js')),
  Wekin: sequelize.import(path.join(__dirname, 'wekin.js')),
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
  Point: sequelize.import(path.join(__dirname, 'point.js'))
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

// db.User.sync()
// db.Host.sync()
// db.Activity.sync()
// db.Wekin.sync()
// db.Order.sync()
// db.Board.sync()
// db.Doc.sync()
// db.Comment.sync()
// db.Follow.sync()
// db.Env.sync()
// db.Noti.sync()
// db.Like.sync()
// db.Favorite.sync()
// db.Waiting.sync()

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
