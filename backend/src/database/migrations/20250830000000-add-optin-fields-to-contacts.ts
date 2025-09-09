'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Contacts', 'optinConfirmed', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false
    });

    await queryInterface.addColumn('Contacts', 'optinConfirmedAt', {
      type: Sequelize.DATE,
      allowNull: true
    });

    await queryInterface.addColumn('Contacts', 'optinMessageSent', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false
    });

    await queryInterface.addColumn('Contacts', 'optinMessageSentAt', {
      type: Sequelize.DATE,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Contacts', 'optinConfirmed');
    await queryInterface.removeColumn('Contacts', 'optinConfirmedAt');
    await queryInterface.removeColumn('Contacts', 'optinMessageSent');
    await queryInterface.removeColumn('Contacts', 'optinMessageSentAt');
  }
};
