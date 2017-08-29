'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'point',
      'type',
      {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      }
    )
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('point', 'type');
  }
};
