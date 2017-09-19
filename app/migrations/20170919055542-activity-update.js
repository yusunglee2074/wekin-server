'use strict';
let model = require('./../model')

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable(
      'ActivityNew',
      { 
        activity_key: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
        host_key: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'host', key: 'host_key' } },
        status: { type: Sequelize.INTEGER, defaultValue: 0 }, // 0: 승인대기, 1: 진행중, 2: 종료
        main_image: { type: Sequelize.JSON, allowNull: false },
        title: { type: Sequelize.STRING, allowNull: false },
        intro_summary: { type: Sequelize.STRING },
        intro_detail: { type: Sequelize.TEXT, allowNull: false },
        schedule: { type: Sequelize.TEXT },
        inclusion: { type: Sequelize.TEXT, allowNull: false },
        preparation: { type: Sequelize.TEXT, allowNull: false },
        address: { type: Sequelize.STRING },
        address_detail: { type: Sequelize.JSON, allowNull: true },
        refund_policy: { type: Sequelize.TEXT, allowNull: false },
        count: { type: Sequelize.INTEGER, defaultValue: 0 },
        confirm_date: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
        isteamorpeople: { type: Sequelize.STRING, allowNull: true},
        category: { type: Sequelize.STRING, allowNull: false},
        category_two: { type: Sequelize.STRING, allowNull: false},
        start_date: { type: Sequelize.DATE, allowNull: false},
        end_date: { type: Sequelize.DATE, allowNull: false},
        due_date: { type: Sequelize.INTEGER, allowNull: false },
        close_dates: { type: Sequelize.ARRAY(Sequelize.DATE), allowNull: true },
        base_start_time: { type: Sequelize.DATE, allowNull: false },
        base_price: { type: Sequelize.INTEGER, allowNull: false },
        base_min_user: { type: Sequelize.INTEGER, allowNull: false },
        base_max_user: { type: Sequelize.INTEGER, allowNull: false },
        base_price_option: { type: Sequelize.JSON, allowNull: true },
        base_extra_price_option: { type: Sequelize.JSON, allowNull: true },
        base_week_option: { type: Sequelize.JSON, allowNull: true },
        is_it_ticket: { type: Sequelize.BOOLEAN, defaultValue: false },
        ticket_due_date: { type: Sequelize.DATE, allowNull: true },
        ticket_max_apply: { type: Sequelize.INTEGER, allowNull: true },
        comision: { type: Sequelize.INTEGER, defaultValue: 0 },
        created_at: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        updated_at: { type: Sequelize.DATE, allowNull: true },
        deleted_at: { type: Sequelize.DATE, allowNull: true },
      })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('ActivityNew');
  }
};
