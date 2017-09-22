'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      return queryInterface.renameColumn('doc', 'activity_key_alter', 'activity_key');
  },

  down: function (queryInterface, Sequelize) {
      return queryInterface.renameColumn('doc', 'activity_key', 'activity_key_alter');
  }
};
