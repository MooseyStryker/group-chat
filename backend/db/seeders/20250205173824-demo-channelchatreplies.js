'use strict';

const { ChannelChatReply } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production'){
  options.schema = process.env.SCHEMA // We define the schema in the options objust to allow render to create a database in production
}

options.tableName = 'ChannelChats'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await ChannelChatReply.bulkCreate([
      {
        channelChatId: 1,
        userId: 1,
        body: "Welcome to the Python General Chat! How can I help you today?",
        visible: true
      },
      {
        channelChatId: 1,
        userId: 2,
        body: "Does anyone know how to set up a virtual environment in Python?",
        visible: true
      },
      {
        channelChatId: 1,
        userId: 3,
        body: "@user2 You can use the `venv` module to create a virtual environment. Just run `python -m venv myenv`.",
        visible: true
      },
      {
        channelChatId: 1,
        userId: 4,
        body: "Check out the Python Voice Lounge for live help.",
        visible: true
      },
      {
        channelChatId: 1,
        userId: 5,
        body: "I have a question about Python decorators. Any experts here?",
        visible: true
      }
    ], { validate: true })
  },

  async down (queryInterface, Sequelize) {

    options.tableName = 'ChannelChatReplies'

    return queryInterface.bulkDelete(options, null, {})
  }
};
