'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      return [
        queryInterface.addColumn(
          'like',
          'comment_key',
          {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: { model: 'comment', key: 'comment_key' }
          }
        ),
        queryInterface.addColumn(
          'like',
          'news_key',
          {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: { model: 'news', key: 'news_key' }
          }
        )
      ]
  },

  down: function (queryInterface, Sequelize) {
      return [
        queryInterface.removeColumn(
          'like',
          'comment_key',
        ),
        queryInterface.addColumn(
          'like',
          'news_key',
        )
      ]
  }
};
