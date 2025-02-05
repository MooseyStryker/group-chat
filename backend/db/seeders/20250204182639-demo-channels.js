'use strict';

const { Channel } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production'){
  options.schema = process.env.SCHEMA // We define the schema in the options objust to allow render to create a database in production
}

options.tableName = 'Channels'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Channel.bulkCreate([
      {
        channelCreatorId: 1,
        groupId: 1,
        channelName: "Python General",
        channelType: "Text",
        private: false
      },
      {
        channelCreatorId: 2,
        groupId: 1,
        channelName: "Python Voice Lounge",
        channelType: "Voice",
        private: true
      },
      {
        channelCreatorId: 3,
        groupId: 1,
        channelName: "Python Updates",
        channelType: "Announcements",
        private: false
      },
      {
        channelCreatorId: 4,
        groupId: 1,
        channelName: "Python Forums",
        channelType: "Forum",
        private: false
      },
      {
        channelCreatorId: 5,
        groupId: 1,
        channelName: "Python Dev Meeting Room",
        channelType: "Voice",
        private: true
      }
    ], { validate: true })
  },

  async down (queryInterface, Sequelize) {

    options.tableName = 'Channels'

    return queryInterface.bulkDelete(options, null, {})
  }
};
