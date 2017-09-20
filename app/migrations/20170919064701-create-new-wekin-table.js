'use strict';
let model = require('./../model')

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable(
      'WekinNew',
      { 
        wekin_key: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
        activity_key: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'ActivityNew', key: 'activity_key' } },
        user_key: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'user', key: 'user_key' } },
        final_price: { type: Sequelize.INTEGER, allowNull: false },
        start_date: { type: Sequelize.DATE, allowNull: false },
        start_time: { type: Sequelize.DATE, allowNull: false },
        select_option: { type: Sequelize.JSON, allowNull: false },
        pay_amount: { type: Sequelize.INTEGER, allowNull: false },
        created_at: { type: Sequelize.DATE },
        updated_at: { type: Sequelize.DATE },
        deleted_at: { type: Sequelize.DATE },
      })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('WekinNew');
  }
};
