const model = require('./index')

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Follow', {
    follow_key: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_key: { type: DataTypes.INTEGER, allowNull: false, references: { model: model.User, key: 'user_key' } },
    follower_user_key: { type: DataTypes.INTEGER, allowNull: false, references: { model: model.User, key: 'user_key' } }
  }, {
    classMethods: {},
    tableName: 'follow',
    freezeTableName: true,
    underscored: true,
    timestamps: true
  })
}
