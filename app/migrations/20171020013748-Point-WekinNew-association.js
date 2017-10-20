'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'point',
      'wekin_key',
      {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'wekinnew', key: 'wekin_key' }
      }
    );
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn(
      'point',
      'wekin_key'
    )
  }
};
