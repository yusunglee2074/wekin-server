module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Environment', {
    env_key: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    type: { type: DataTypes.STRING(64), allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    value: { type: DataTypes.JSON, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: true }
  }, {
    classMethods: {},
    tableName: 'environment',
    freezeTableName: true,
    underscored: true,
    timestamps: true
  })
}
