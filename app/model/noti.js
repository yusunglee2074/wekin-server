const model = require('./index')

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Noti', {
    noti_key: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_key: { type: DataTypes.INTEGER, allowNull: false, references: { model: model.User, key: 'user_key' } },
    user_name: { type: DataTypes.STRING, allowNull: false },
    target_user_key: { type: DataTypes.INTEGER, allowNull: false, references: { model: model.User, key: 'user_key' } },
    target_user_name: { type: DataTypes.STRING, allowNull: false },
    message_text: { type: DataTypes.STRING, allowNull: false },
    active_name: { type: DataTypes.STRING, allowNull: false },
    active_target: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.STRING, allowNull: false },
    extra : { type: DataTypes.JSON, allowNull: true }
  }, {
    classMethods: {},
    tableName: 'noti',
    freezeTableName: true,
    underscored: true,
    timestamps: true,
    paranoid: true
  })
}
