'use strict';
let model = require('./../model')

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable(
      'point',
      { 
        point_key: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
        user_key: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'user', key: 'user_key' } },
        point_change: { type: Sequelize.INTEGER, allowNull: false },
        due_date_be_written_days: { type: Sequelize.INTEGER, allowNull: true },
        point_use_percentage: { type: Sequelize.INTEGER, defaultValue: Sequelize.NOW },
        created_at: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        updated_at: { type: Sequelize.DATE, allowNull: true },
        deleted_at: { type: Sequelize.DATE, allowNull: true },
      })
  },

  down: function (queryInterface, Sequelize) {
      return queryInterface.dropTable('point');
  }
};
