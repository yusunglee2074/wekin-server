'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'activitynew',
      'start_date_list',
      {
        type: Sequelize.JSON,
        allowNull: true,
      }
    )
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('activitynew', 'start_date_list');
  }
};
