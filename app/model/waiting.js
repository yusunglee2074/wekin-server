const model = require('./index')

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Waiting', {
    waiting_key: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_key: { type: DataTypes.INTEGER, allowNull: false, references: { model: model.User, key: 'user_key' } },
    wekin_key: { type: DataTypes.INTEGER, allowNull: false, references: { model: model.Wekin, key: 'wekin_key' } },
    method: { type: DataTypes.ARRAY(DataTypes.STRING) }
  }, {
    classMethods: {},
    tableName: 'waiting',
    freezeTableName: true,
    underscored: true,
    timestamps: true
  })
}
