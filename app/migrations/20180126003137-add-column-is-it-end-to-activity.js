'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      return queryInterface.addColumn('activitynew', 'is_it_end',  { type: Sequelize.BOOLEAN, defaultValue: false })
  },

  down: function (queryInterface, Sequelize) {
      return queryInterface.removeColumn('activitynew', 'is_it_end')
  }
};
