const model = require('./index')

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Doc', {
    doc_key: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    activity_key: { type: DataTypes.INTEGER, allowNull: true, references: { model: model.ActivityNew, key: 'activity_key' } },
    user_key: { type: DataTypes.INTEGER, allowNull: false, references: { model: model.User, key: 'user_key' } },
    activity_title: { type: DataTypes.STRING(128), allowNull: true },
    activity_rating: { type: DataTypes.INTEGER, allowNull: true },
    content: { type: DataTypes.TEXT, allowNull: false },
    images: { type: DataTypes.ARRAY(DataTypes.INTEGER), allowNull: true },
    image_url: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true },
    medias: { type: DataTypes.JSON },
    tags: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true },
    private_mode: { type: DataTypes.BOOLEAN, allowNull: true },
    status: { type: DataTypes.INTEGER, allowNull: true },
    type: { type: DataTypes.INTEGER, allowNull: false },
    answer: { type: DataTypes.TEXT, allowNull: true },
    host_key: { type: DataTypes.INTEGER, references: { model: model.Host, key: 'host_key' } }

    share_count: { type: DataTypes.INTEGER, defaultValue: 0 }
  }, {
    classMethods: {},
    tableName: 'doc',
    freezeTableName: true,
    underscored: true,
    timestamps: true
  })
}
