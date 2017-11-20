'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('activitynew', 'detail_question', { type: Sequelize.JSON, allowNull: true })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('activitynew', 'detail_question')
  }
};
