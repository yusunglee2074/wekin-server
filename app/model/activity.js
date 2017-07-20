const model = require('./index')

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Activity', {
    activity_key: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    host_key: { type: DataTypes.INTEGER, allowNull: false, references: { model: model.Host, key: 'host_key' } },
    status: { type: DataTypes.INTEGER, defaultValue: 0 }, // 0: 승인대기, 1: 진행중, 2: 종료
    main_image: { type: DataTypes.JSON, allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false },
    intro_summary: { type: DataTypes.STRING },
    intro_detail: { type: DataTypes.TEXT, allowNull: false },
    schedule: { type: DataTypes.TEXT },
    inclusion: { type: DataTypes.TEXT, allowNull: false },
    preparation: { type: DataTypes.TEXT, allowNull: false },
    address: { type: DataTypes.STRING },
    address_detail: { type: DataTypes.JSON, allowNull: true },
    refund_policy: { type: DataTypes.TEXT, allowNull: false },
    price: { type: DataTypes.INTEGER, allowNull: false },
    count: { type: DataTypes.INTEGER, defaultValue: 0 },
    confirm_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    category: { type: DataTypes.STRING, allowNull: true}
    // last_mod_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
    // create_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    // coordinates: { type: DataTypes.GEOMETRY('POINT'), allowNull: true },
  }, {
    classMethods: {},
    tableName: 'activity',
    freezeTableName: true,
    underscored: true,
    timestamps: true,
    paranoid: true
  })
}
// status 상태 값
// 0 - 승인대기
// 1 - 반려
// 2 - 수정요청
// 3 - 진행중
// 4 - 삭제요청
// 5 - 삭제
