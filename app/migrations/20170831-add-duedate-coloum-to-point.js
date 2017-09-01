'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'point',
      'due_date_be_written_days',
      {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: -1
      }
    )
// { type: DataTypes.INTEGER, allowNull: true }
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('point', 'due_date_be_written_days')
  }
};
