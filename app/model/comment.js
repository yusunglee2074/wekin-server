const model = require('./index')

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Comment', {
    comment_key: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_key: { type: DataTypes.INTEGER, allowNull: false, references: { model: model.User, key: 'user_key' } },
    doc_key: { type: DataTypes.INTEGER, allowNull: false, references: { model: model.Doc, key: 'doc_key' } },
    content: { type: DataTypes.TEXT, allowNull: false },
    user_name: { type: DataTypes.STRING(32), allowNull: true },
    user_profile_image: { type: DataTypes.STRING(512), allowNull: true }
  }, {
    classMethods: {},
    tableName: 'comment',
    freezeTableName: true,
    underscored: true,
    timestamps: true
  })
}
