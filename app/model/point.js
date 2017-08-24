const model = require('./index')

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Point', {
    point_key: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_key: { type: DataTypes.INTEGER, allowNull: false, references: { model: model.User, key: 'user_key' } },
    point_change: { type: DataTypes.INTEGER, allowNull: false },
    due_date_be_written_days: { type: DataTypes.INTEGER, allowNull: true },
  }, {
    tableName: 'point',
    freezeTableName: true,
    underscored: true,
    timestamps: true
  })
}
