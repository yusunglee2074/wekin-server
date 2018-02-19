'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable(
      'event',
      {
        event_key: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
        url: { type: Sequelize.TEXT, allowNull: true },
        url_user_key: { type: Sequelize.INTEGER, allowNull: true },
        type: { type: Sequelize.TEXT, allowNull: false },
        ip: { type: Sequelize.TEXT, allowNull: true },
        status: { type: Sequelize.TEXT, allowNull: true },
        be_invited_user_key: { type: Sequelize.INTEGER, allowNull: true },
        value: { type: Sequelize.TEXT, allowNull: true },
        created_at: { type: Sequelize.DATE },
        updated_at: { type: Sequelize.DATE },
        deleted_at: { type: Sequelize.DATE },
      });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('event');
  }
};
