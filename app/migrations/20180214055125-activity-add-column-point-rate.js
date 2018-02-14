'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      return queryInterface.addColumn('activitynew', 'point_rate',  { type: Sequelize.JSONB, allowNull: true })
  },

  down: function (queryInterface, Sequelize) {
      return queryInterface.removeColumn('activitynew', 'point_rate')
  }
};
