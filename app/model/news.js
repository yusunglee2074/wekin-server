const model = require('./index')

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('News', {
    news_key: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    link_url: { type: DataTypes.STRING },
    title: { type: DataTypes.STRING },
    sub_title: { type: DataTypes.STRING },
  }, {
    classMethods: {},
    tableName: 'news',
    freezeTableName: true,
    underscored: true,
    timestamps: true,
    paranoid: true
  })
}
