'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return [
      queryInterface.removeColumn('user', 'point'),
      queryInterface.addColumn(
        'user',
        'point',
        {
          type: Sequelize.JSON,
          defaultValue: { point: 0, point_special: 0, percentage: 100 },
          allowNull: false
        }
      )
    ]
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn(
      'user',
      'point',
      {
        type: Sequelize.JSON,
        defaultValue: { point: 0, point_special: 0 },
        allowNull: false
      }
    )
  }
};
