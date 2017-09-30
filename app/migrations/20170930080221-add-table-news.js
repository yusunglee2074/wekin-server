'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable(
      'news',
      {
        news_key: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
        title: { type: Sequelize.STRING },
        sub_title: { type: Sequelize.STRING },
        link_url: { type: Sequelize.STRING },
        created_at: { type: Sequelize.DATE },
        updated_at: { type: Sequelize.DATE },
        deleted_at: { type: Sequelize.DATE },
      });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('news');
  }
};
