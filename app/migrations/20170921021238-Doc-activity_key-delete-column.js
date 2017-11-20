'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return [ 
      queryInterface.removeColumn(
        'doc',
        'activity_key'
      )
    ]
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'doc',
      'activity_key',
      {
        type: Sequelize.INTEGER,
        defaultValue: null,
        allowNull: true,
        references: { model: 'activity', key: 'activity_key' }
      })
  }
};
