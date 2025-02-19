'use strict';

const { Message } = require('../models')

let options = {};
if (process.env.NODE_ENV === 'production'){
  options.schema = process.env.SCHEMA // We define the schema in the options objust to allow render to create a database in production
}

options.tableName = 'Messages'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Message.bulkCreate([
      {
        conversationId: 1,
        userId: 1,
        content: 'Hey there!',
        previousContentBeforeEdited: null,
        sentAt: '2025-02-19T11:00:00Z'
      },
      {
        conversationId: 1,
        userId: 2,
        content: 'Hi! How can I help you today?',
        previousContentBeforeEdited: null,
        sentAt: '2025-02-19T11:01:00Z'
      },
      {
        conversationId: 2,
        userId: 1,
        content: 'Do you have any updates?',
        previousContentBeforeEdited: null,
        sentAt: '2025-02-19T12:00:00Z'
      },
      {
        conversationId: 2,
        userId: 2,
        content: 'Yes, we do. Please check your email.',
        previousContentBeforeEdited: null,
        sentAt: '2025-02-19T12:01:00Z'
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Messages'

    return queryInterface.bulkDelete(options, null, {})
  }
};
