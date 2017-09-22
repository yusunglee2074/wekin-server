'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      return queryInterface.addColumn(
        'wekinnew',
        'state',
        {
          type: Sequelize.STRING,
          allowNull: false,
        }
      );
  },

  down: function (queryInterface, Sequelize) {
      return queryInterface.removeColumn('wekinnew', 'state');
  }
};
