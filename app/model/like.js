const model = require('./index')

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Like', {
    like_key: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_key: { type: DataTypes.INTEGER, allowNull: false },
    doc_key: { type: DataTypes.INTEGER, allowNull: true },
    comment_key: { type: DataTypes.INTEGER, allowNull: true, references: { model: model.Comment, key: 'comment_key' } },
    news_key: { type: DataTypes.INTEGER, allowNull: true, references: { model: model.News, key: 'news_key' } },
  }, {
    classMethods: {},
    tableName: 'like',
    freezeTableName: true,
    underscored: true,
    timestamps: true
  })
}
