const model = require('./index')

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Order', {
    order_key: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    order_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
    // 이니시스, payco등
    order_pay_pg: { type: DataTypes.STRING(32), allowNull: true },
    // card, 무통장, 소액결제
    order_pay_method: { type: DataTypes.STRING(32), allowNull: true },

    // 구매자 키
    user_key: { type: DataTypes.INTEGER, allowNull: false, references: { model: model.User, key: 'user_key' } },
    // 구매자 이메일
    user_email: { type: DataTypes.STRING(32), allowNull: true },
    // 구매자 이름
    user_name: { type: DataTypes.STRING(32), allowNull: true },
    // 구매자 휴대폰

    user_phone: { type: DataTypes.STRING(14), allowNull: true },
    // 위킨키
    wekin_key: { type: DataTypes.INTEGER, allowNull: false, references: { model: model.Wekin, key: 'wekin_key' } },
    // 위킨
    wekin_name: { type: DataTypes.STRING(128), allowNull: false },
    // 위킨 가격
    wekin_price: { type: DataTypes.INTEGER, allowNull: false },
    // 위킨 인원
    wekin_amount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },

    // 총 결제금액
    order_total_price: { type: DataTypes.INTEGER },
    // 영수 금액
    order_receipt_price: { type: DataTypes.INTEGER },
    // 환불금액
    order_refund_price: { type: DataTypes.INTEGER, defaultValue: 0 },
    // 실제 돈낸금액
    order_pay_price: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },

    // status [결제진행중, 입금대기, 결제완료, 환불요청, 환불완료]
    status: { type: DataTypes.STRING(14), allowNull: false },

    // 부가세
    order_cost_tax: { type: DataTypes.INTEGER },
    // 공급원가
    order_cost_price: { type: DataTypes.INTEGER },

    // 주문일시
    order_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    // 주문 IP
    order_ip: { type: DataTypes.STRING(14), allowNull: true },
    // 주문 방법 (모바일, pc)
    order_method: { type: DataTypes.STRING(14), allowNull: true },
    // 환불규정
    order_refund_policy: { type: DataTypes.TEXT, allowNull: true },
    // 부가 데이터 (환불사유)
    order_extra: { type: DataTypes.JSON, allowNull: true },

    // 추가된것들 ..
    // 영수증
    receipt_url: { type: DataTypes.STRING },
    // pg사 고유 거래번호
    pg_tid: { type: DataTypes.STRING },
    // 아임포트 uid
    imp_uid: { type: DataTypes.STRING },
    
    // 더더
    commission: { type: DataTypes.DOUBLE, allowNull: false, defaultValue: 0 },
    wekin_host_name: { type: DataTypes.STRING },
    refund_info: { type: DataTypes.JSON, allowNull: true },
    host_key: { type: DataTypes.INTEGER, allowNull: false, references: { model: model.Host, key: 'host_key' } },

  }, {
    classMethods: {},
    tableName: 'order',
    freezeTableName: true,
    underscored: true,
    timestamps: true,
    paranoid: true
  })
}