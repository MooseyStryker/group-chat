'use strict';

// Allows to bypass render.com small db restrictions
let options = {}
if (process.env.NODE_ENV === 'production'){
  options.schema = process.env.SCHEMA
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('AttendanceLiveEvents', {
      liveEventId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'LiveEvents',
          key: 'id'
        }
      },
      userId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      invitationForPrivateLiveEvents: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          len: [16,16]
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {

    options.tableName = 'AttendanceLiveEvents'
    await queryInterface.dropTable(options);

  }
};
