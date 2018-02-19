const model = require('./index')

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Event', {
    event_key: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    url: { type: DataTypes.TEXT, allowNull: true },
    url_user_key: { type: DataTypes.INTEGER, allowNull: true },
    type: { type: DataTypes.TEXT, allowNull: false },
    ip: { type: DataTypes.TEXT, allowNull: true },
    status: { type: DataTypes.TEXT, allowNull: true },
    be_invited_user_key: { type: DataTypes.INTEGER, allowNull: true },
    value: { type: DataTypes.TEXT, allowNull: true },
  }, {
    tableName: 'event',
    freezeTableName: true,
    underscored: true,
    timestamps: true,
    paranoid: true
  })
}
