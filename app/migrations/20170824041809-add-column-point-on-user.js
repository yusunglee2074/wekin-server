'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'user',
      'point',
      {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0
      }
    )
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('user', 'point');
  }
};
