'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'doc',
      'share_count',
      {
        type: Sequelize.INTEGER,
        defaultValue: 0 
      }
    )
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn(
      'doc',
      'share_count',
    )
  }
};
