'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('point', 'due_date_be_written_days')
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'point',
      'due_date_be_written_days',
      {
        type: Sequelize.INTEGER,
        allowNull: true 
      }
    )
// { type: DataTypes.INTEGER, allowNull: true }
  }
};
