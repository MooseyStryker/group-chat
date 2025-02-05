'use strict';

const { AttendanceLiveEvent } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production'){
  options.schema = process.env.SCHEMA // We define the schema in the options objust to allow render to create a database in production
}

options.tableName = 'AttendanceLiveEvents'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await AttendanceLiveEvent.bulkCreate([
      {
        liveEventId: 1,
        userId: 1,
        invitationForPrivateLiveEvents: "abc123xyz789def0"
      },
      {
        liveEventId: 1,
        userId: 2,
        invitationForPrivateLiveEvents: "abc123xyz789def0"
      },
      {
        liveEventId: 1,
        userId: 3,
        invitationForPrivateLiveEvents: "abc123xyz789def0"
      },
      {
        liveEventId: 1,
        userId: 4,
        invitationForPrivateLiveEvents: "abc123xyz789def0"
      },
      {
        liveEventId: 1,
        userId: 5,
        invitationForPrivateLiveEvents: "abc123xyz789def0"
      }
    ], { validate: true })

  },

  async down (queryInterface, Sequelize) {

    options.tableName = 'AttendanceLiveEvents'

    return queryInterface.bulkDelete(options,null, {})
  }
};
