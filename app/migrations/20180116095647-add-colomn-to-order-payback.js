'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      return queryInterface.addColumn('order', 'is_it_paybacked',  { type: Sequelize.BOOLEAN, defaultValue: false })
  },

  down: function (queryInterface, Sequelize) {
      return queryInterface.removeColumn('order', 'is_it_paybacked')
  }
};
