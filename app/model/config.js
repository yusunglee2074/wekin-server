'use strict'

var config = {
  initAssociations: function (db) {
    db.User.hasMany(db.Follow, { foreignKey: 'user_key' })
    db.User.hasOne(db.Host, { foreignKey: 'user_key' })

    db.User.hasMany(db.Point, { foreignKey: 'user_key' })
    db.Point.hasOne(db.User, { foreignKey: 'user_key' })

    db.Host.belongsTo(db.User, { foreignKey: 'user_key' })
    db.Host.hasMany(db.Activity, { foreignKey: 'host_key' })
    db.Host.hasMany(db.ActivityNew, { foreignKey: 'host_key' })

    db.Activity.belongsTo(db.Host, { foreignKey: 'host_key' })
    db.Activity.hasMany(db.Favorite, { foreignKey: 'activity_key' })
    db.Activity.hasMany(db.Wekin, { foreignKey: 'activity_key' })
    // db.Activity.hasMany(db.Doc, { foreignKey: 'activity_key' })
    
    db.ActivityNew.belongsTo(db.Host, { foreignKey: 'host_key' })
    db.ActivityNew.hasMany(db.WekinNew, { foreignKey: 'activity_key' })
    db.ActivityNew.hasMany(db.Doc, { foreignKey: 'activity_key' })
    db.ActivityNew.hasMany(db.Favorite, { foreignKey: 'activity_key' })

    db.WekinNew.hasOne(db.ActivityNew, { foreignKey: 'activity_key' })

    db.Wekin.belongsTo(db.Activity, { foreignKey: 'activity_key' })
    db.Wekin.hasMany(db.Order, { foreignKey: 'wekin_key' })

    // db.Doc.belongsTo(db.Activity, { foreignKey: 'activity_key' })
    db.Doc.belongsTo(db.ActivityNew, { foreignKey: 'activity_key' })
    db.Doc.belongsTo(db.User, { foreignKey: 'user_key' })
    db.Doc.hasMany(db.Like, { foreignKey: 'doc_key' })
    db.Doc.hasMany(db.Comment, { foreignKey: 'doc_key' })
    db.Doc.belongsTo(db.Host, { foreignKey: 'host_key' })

    db.Order.belongsTo(db.Wekin, { foreignKey: 'wekin_key' })
    db.Order.belongsTo(db.User, { foreignKey: 'user_key' })
    db.Order.belongsTo(db.Host, { foreignKey: 'host_key' })

    db.Comment.belongsTo(db.Doc, { foreignKey: 'doc_key' })
    db.Comment.belongsTo(db.User, { foreignKey: 'user_key' })

    db.Like.belongsTo(db.Doc, { foreignKey: 'doc_key' })

    db.Follow.belongsTo(db.User, { foreignKey: 'user_key', as: 'User' })
    db.Follow.belongsTo(db.User, { foreignKey: 'follower_user_key', as: 'Follower' })

    db.Noti.belongsTo(db.User, { foreignKey: 'user_key', as: 'User' })
    db.Noti.belongsTo(db.User, { foreignKey: 'target_user_key', as: 'Target' })

    db.Favorite.belongsTo(db.User, { foreignKey: 'user_key' })
    // db.Favorite.belongsTo(db.Activity, { foreignKey: 'activity_key' })
    db.Favorite.belongsTo(db.ActivityNew, { foreignKey: 'activity_key' })

    db.Waiting.belongsTo(db.User, {foreignKey: 'user_key'})
    db.Waiting.belongsTo(db.Wekin, {foreignKey: 'wekin_key'})

  },
  initHooks: function (db) {
    db.Wekin.hook('beforeCreate', function () {
      // TODO; create작업 전에 해야할 사항들.R
    })

    db.Wekin.beforeCreate(function () {
      // TODO; create작업 전에 해야할 사항들.
    })
  }
}

module.exports = config
