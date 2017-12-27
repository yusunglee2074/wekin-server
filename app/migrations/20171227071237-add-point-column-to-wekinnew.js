'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      return queryInterface.addColumn('wekinnew', 'point',  { type: Sequelize.INTEGER, allowNull: true })
  },

  down: function (queryInterface, Sequelize) {
      return queryInterface.removeColumn('wekinnew', 'point')
  }
};
