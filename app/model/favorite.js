const model = require('./index')

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Favorite', {
    fav_key: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_key: { type: DataTypes.INTEGER, allowNull: false, references: { model: model.User, key: 'user_key' } },
    activity_key: { type: DataTypes.INTEGER, allowNull: false, references: { model: model.Activity, key: 'activity_key' } }
  }, {
    classMethods: {},
    tableName: 'favorite',
    freezeTableName: true,
    underscored: true,
    timestamps: true
  })
}