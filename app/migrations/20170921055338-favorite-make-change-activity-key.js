'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return [
      queryInterface.removeColumn(
        'favorite',
        'activity_key'
      ),
      queryInterface.addColumn(
        'favorite',
        'activity_key',
        {
          type: Sequelize.INTEGER,
          defaultValue: null,
          allowNull: true,
          references: { model: 'activitynew', key: 'activity_key' }
        }),
    ]
  },

  down: function (queryInterface, Sequelize) {
    return [
      queryInterface.removeColumn(
        'favorite',
        'activity_key'
      ),
      queryInterface.addColumn(
        'favorite',
        'activity_key',
        {
          type: Sequelize.INTEGER,
          defaultValue: null,
          allowNull: true,
          references: { model: 'activity', key: 'activity_key' }
        }),
    ]
  }
};
