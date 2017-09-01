'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      return [ 
        queryInterface.addColumn(
          'user',
          'birthday',
          {
            type: Sequelize.DATE,
            allowNull: true,
            defaultValue: null
          }
        ),
        queryInterface.addColumn(
          'user',
          'email_company',
          {
            type: Sequelize.STRING,
            allowNull: true,
          }
        ),
        queryInterface.addColumn(
          'user',
          'email_company_valid',
          {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
          }
        )
      ]
  },

  down: function (queryInterface, Sequelize) {
    return [ 
      queryInterface.removeColumn('user', 'email_company_valid'),
      queryInterface.removeColumn('user', 'email_company'),
      queryInterface.removeColumn('user', 'birthday')
    ]
  }
};
