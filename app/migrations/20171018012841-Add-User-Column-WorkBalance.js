'use strict';
// work_balance_point: { type: DataTypes.INTEGER, defaultValue: 0 },
// work_balance_point_history: { type: DataTypes.ARRAY(DataTypes.DATE), defaultValue: [] }

module.exports = {
  up: function (queryInterface, Sequelize) {
    return [
      queryInterface.addColumn('user', 'work_balance_point', { type: Sequelize.INTEGER, defaultValue: 0 }),
      queryInterface.addColumn('user', 'work_balance_point_history',  { type: Sequelize.ARRAY(Sequelize.DATE), defaultValue: [] })
    ]
  },

  down: function (queryInterface, Sequelize) {
    return [
      queryInterface.removeColumn('user', 'work_balance_point'),
      queryInterface.removeColumn('user', 'work_balance_point_history')
    ]
  }
};
