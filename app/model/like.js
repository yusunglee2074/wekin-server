module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Like', {
    like_key: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_key: { type: DataTypes.INTEGER, allowNull: false },
    doc_key: { type: DataTypes.INTEGER, allowNull: false }
  }, {
    classMethods: {},
    tableName: 'like',
    freezeTableName: true,
    underscored: true,
    timestamps: true
  })
}
