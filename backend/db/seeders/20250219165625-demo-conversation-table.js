'use strict';

const { Conversation } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production'){
  options.schema = process.env.SCHEMA // We define the schema in the options objust to allow render to create a database in production
}

options.tableName = 'Conversations'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Conversation.bulkCreate([
      {
        user1Id: 1,
        user2Id: 2
      },
      {
        user1Id: 1,
        user2Id: 3
      },
      {
        user1Id: 1,
        user2Id: 4
      },
      // {
      //   user1Id: 1,
      //   user2Id: 5
      // }
    ], { validate: true })
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Conversations'

    return queryInterface.bulkDelete(options, null, {})
  }
};
