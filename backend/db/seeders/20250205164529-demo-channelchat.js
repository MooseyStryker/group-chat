'use strict';

const { ChannelChat } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production'){
  options.schema = process.env.SCHEMA // We define the schema in the options objust to allow render to create a database in production
}

options.tableName = 'ChannelChats'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await ChannelChat.bulkCreate([
      {
        userId: 1,
        channelId: 1,
        body: "Hello everyone! Welcome to the Python General channel.",
        visible: true
      },
      {
        userId: 2,
        channelId: 1,
        body: "Does anyone have experience with Django?",
        visible: true
      },
      {
        userId: 3,
        channelId: 1,
        body: "I'm working on a new Python project, any tips?",
        visible: true
      },
      {
        userId: 4,
        channelId: 1,
        body: "Don't forget to check out the Python Voice Lounge for live discussions.",
        visible: true
      },
      {
        userId: 5,
        channelId: 1,
        body: "Can someone help me with a Flask issue?",
        visible: true
      }
    ], { validate: true })
  },

  async down (queryInterface, Sequelize) {

    options.tableName = 'ChannelChats'

    return queryInterface.bulkDelete(options, null, {})
    
  }
};
