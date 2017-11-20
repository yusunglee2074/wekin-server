'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      return queryInterface.addColumn(
        'user', 
        'country', 
        {
          type: Sequelize.STRING,
          defaultValue: 'Korea'
        })
  },

  down: function (queryInterface, Sequelize) {
      return queryInterface.removeColumn('user', 'country')
  }
}
