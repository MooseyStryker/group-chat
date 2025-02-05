'use strict';

const { LiveEvent } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production'){
  options.schema = process.env.SCHEMA // We define the schema in the options objust to allow render to create a database in production
}

options.tableName = 'ChannelChatPhotos'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await LiveEvent.bulkCreate([
      {
        userId: 1,
        groupId: 1,
        name: "Daily Python Study Group",
        description: "A daily meetup to study and discuss Python programming.",
        repeat: "daily",
        private: false,
        privateInvitation: "abc123xyz789def0"
      },
      {
        userId: 2,
        groupId: 1,
        name: "Weekly Python Workshop",
        description: "A weekly workshop to learn and practice Python.",
        repeat: "weekly",
        private: true,
        privateInvitation: "ghi456jkl012mno3"
      },
      {
        userId: 3,
        groupId: 1,
        name: "Monthly Python Project Meeting",
        description: "A monthly meeting to work on a collaborative Python project.",
        repeat: "monthly",
        private: false,
        privateInvitation: "pqr789stu345vwx4"
      },
      {
        userId: 4,
        groupId: 1,
        name: "Weekly Python Q&A",
        description: "A weekly Q&A session for Python enthusiasts.",
        repeat: "weekly",
        private: true,
        privateInvitation: "abc890def567ghi8"
      },
      {
        userId: 5,
        groupId: 1,
        name: "Daily Python Coding Challenge",
        description: "A daily coding challenge to improve Python skills.",
        repeat: "daily",
        private: false,
        privateInvitation: "jkl234mno678pqr9"
      }
    ])
  },

  async down (queryInterface, Sequelize) {

    options.tableName = 'LiveEvents'

    return queryInterface.bulkDelete(options,null, {})
  }
};
