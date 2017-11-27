const model = require('./index')

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('ActivityNew', {
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
    count: { type: DataTypes.INTEGER, defaultValue: 0 },
    confirm_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    isteamorpeople: { type: DataTypes.STRING, allowNull: true},

    // 리펙토링
    category: { type: DataTypes.STRING, allowNull: true},
    category_two: { type: DataTypes.STRING, allowNull: true},
    start_date: { type: DataTypes.DATE, allowNull: true},
    end_date: { type: DataTypes.DATE, allowNull: true},
    // 모집 기간 마감일 1일전 2일전,...
    due_date: { type: DataTypes.INTEGER, allowNull: true },
    base_start_time: { type: DataTypes.DATE, allowNull: true },
    base_price: { type: DataTypes.INTEGER, allowNull: true },
    base_min_user: { type: DataTypes.INTEGER, allowNull: true },
    base_max_user: { type: DataTypes.INTEGER, allowNull: true },
    base_price_option: { type: DataTypes.JSON, allowNull: true },
    base_extra_price_option: { type: DataTypes.JSON, allowNull: true },
    base_week_option: { type: DataTypes.JSON, allowNull: true },
    close_dates: { type: DataTypes.ARRAY(DataTypes.JSON), allowNull: true },
    is_it_ticket: { type: DataTypes.BOOLEAN, defaultValue: false },
    ticket_due_date: { type: DataTypes.DATE },
    ticket_max_apply: { type: DataTypes.INTEGER },
    comision: { type: DataTypes.INTEGER, defaultValue: 0},
    start_date_list: { type: DataTypes.JSON, allowNull: true },
    detail_question: { type: DataTypes.JSON, allowNull: true },
    price_before_discount: { type: DataTypes.INTEGER, allowNull: true },
  }, {
    classMethods: {},
    tableName: 'activitynew',
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
