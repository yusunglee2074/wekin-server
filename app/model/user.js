const model = require('./index')

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('User', {
    user_key: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    uuid: { type: DataTypes.STRING(128), allowNull: false },
    profile_image: { type: DataTypes.STRING(512), defaultValue: '/static/images/default-profile.png' },
    name: { type: DataTypes.STRING(32), allowNull: true },
    gender: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
    introduce: { type: DataTypes.TEXT, allowNull: true },
    email: { type: DataTypes.STRING, allowNull: false },
    email_valid: { type: DataTypes.BOOLEAN, defaultValue: false },
    email_noti: { type: DataTypes.BOOLEAN, defaultValue: true },
    sms_noti: { type: DataTypes.BOOLEAN, defaultValue: true },
    push_noti: { type: DataTypes.BOOLEAN, defaultValue: true },
    phone: { type: DataTypes.STRING, allowNull: true },
    phone_valid: { type: DataTypes.BOOLEAN, defaultValue: false },
    notification: { type: DataTypes.STRING, allowNull: true },
    last_login_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    classMethods: {},
    tableName: 'user',
    freezeTableName: true,
    underscored: true,
    timestamps: true,
    paranoid: true
  })
}
