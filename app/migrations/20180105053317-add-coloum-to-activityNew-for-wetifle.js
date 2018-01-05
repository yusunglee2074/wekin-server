'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      return queryInterface.addColumn('activitynew', 'status_wetiful',  { type: Sequelize.STRING, defaultValue: 'both' })
  },

  down: function (queryInterface, Sequelize) {
      return queryInterface.removeColumn('activitynew', 'status_wetiful')
  }
};
