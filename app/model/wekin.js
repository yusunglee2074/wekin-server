'use strict'

const model = require('./index')

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Wekin', {
    wekin_key: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    activity_key: { type: DataTypes.INTEGER, allowNull: false, references: { model: model.Activity, key: 'activity_key' } },
    min_user: { type: DataTypes.INTEGER, allowNull: true },
    max_user: { type: DataTypes.INTEGER, allowNull: true },
    start_date: { type: DataTypes.DATE, allowNull: true },
    due_date: { type: DataTypes.DATE, allowNull: true },
    commission: { type: DataTypes.DOUBLE, allowNull: false, defaultValue: 0 },
    status: { type: DataTypes.STRING(14), allowNull: false, defaultValue: 'show' }
  }, {
    classMethods: {},
    tableName: 'wekin',
    freezeTableName: true,
    underscored: true,
    timestamps: true,
    paranoid: true
  })
}