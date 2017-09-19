'use strict'

const model = require('./index')

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('WekinNew', {
    wekin_key: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    activity_key: { type: DataTypes.INTEGER, allowNull: false, references: { model: model.ActivityNew, key: 'activity_key' } },
    user_key: { type: DataTypes.INTEGER, allowNull: false, references: { model: model.User, key: 'user_key' } },
    final_price: { type: DataTypes.INTEGER, allowNull: false },
    start_date: { type: DataTypes.DATE, allowNull: false },
    start_time: { type: DataTypes.DATE, allowNull: false },
    select_option: { type: DataTypes.JSON, allowNull: false },
    pay_amount: { type: DataTypes.INTEGER, allowNull: false },
  }, {
    classMethods: {},
    tableName: 'wekin',
    freezeTableName: true,
    underscored: true,
    timestamps: true,
    paranoid: true
  })
}
