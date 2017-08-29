'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'user',
      'point',
      {
        type: Sequelize.JSON,
        allowNull: false,
        defaultValue: { point: 0, point_special: 0 }
      }
    )
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('user', 'point');
  }
};
