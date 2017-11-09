'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'news',
      'share_count',
      {
        type: Sequelize.INTEGER,
        defaultValue: 0
      }
    );
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('news', 'share_count');
  }
};
