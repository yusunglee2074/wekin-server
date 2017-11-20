'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      return queryInterface.addColumn(
        'order',
        'wekin_key',
        {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: { model: 'wekinnew', key: 'wekin_key' }
        }
      );
  },

  down: function (queryInterface, Sequelize) {
      return queryInterface.removeColumn(
        'order',
        'wekin_key'
      )
  }
};
