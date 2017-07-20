module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Board', {
    board_key: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING(64), allowNull: false },
    type: { type: DataTypes.INTEGER, allowNull: false },
    category: { type: DataTypes.ARRAY(DataTypes.INTEGER), allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false }
  }, {
    classMethods: {},
    tableName: 'board',
    freezeTableName: true,
    underscored: true,
    timestamps: true
  })
}
