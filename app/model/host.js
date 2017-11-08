const model = require('./index')

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Host', {
    host_key: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_key: { type: DataTypes.INTEGER, allowNull: false, references: { model: model.User, key: 'user_key' }, unique: true },
    introduce: { type: DataTypes.TEXT, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    history: { type: DataTypes.TEXT },
    profile_image: { type: DataTypes.STRING },
    name: { type: DataTypes.STRING, allowNull: false },
    tel: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.TEXT },
    sns: { type: DataTypes.STRING },
    business_registration: { type: DataTypes.STRING },
    license: { type: DataTypes.STRING },
    license_list : { type: DataTypes.ARRAY(DataTypes.STRING) },
    type: { type: DataTypes.INTEGER, allowNull: false },
    join_method: { type: DataTypes.STRING },
    home_page: { type: DataTypes.STRING },
    status: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    language: { type: DataTypes.STRING, allowNull: true }
    // create_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    // 추가

  }, {
    classMethods: {},
    tableName: 'host',
    freezeTableName: true,
    underscored: true,
    timestamps: true
  })
}
