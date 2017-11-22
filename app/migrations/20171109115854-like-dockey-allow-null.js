'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn('like', 'doc_key', { type: Sequelize.INTEGER, allowNull: true });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn('like', 'doc_key', { type: Sequelize.INTEGER, allowNull: false });
  }
};
