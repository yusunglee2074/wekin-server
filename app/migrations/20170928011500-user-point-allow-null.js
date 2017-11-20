'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn(
      'user',
      'point',
      {
        type: Sequelize.JSON,
        defaultValue: { point: 0, point_special: 0, percentage: 100 },
        allowNull: true
      })
  },
  down: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn(
      'user',
      'point',
      {
        type: Sequelize.JSON,
        defaultValue: { point: 0, point_special: 0, percentage: 100 },
        allowNull: false
      })
  }
};
