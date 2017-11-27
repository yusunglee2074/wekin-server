'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return [
      queryInterface.addColumn('activitynew', 'price_before_discount',  { type: Sequelize.INTEGER, allowNull: true })
    ]
  },

  down: function (queryInterface, Sequelize) {
    return [
      queryInterface.removeColumn('activitynew', 'price_before_discount')
    ]
  }
};
