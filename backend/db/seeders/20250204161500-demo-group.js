'use strict';

const { Group } = require('../models')

let options = {};
if (process.env.NODE_ENV === 'production'){
  options.schema = process.env.SCHEMA // We define the schema in the options objust to allow render to create a database in production
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Group.bulkCreate([
      {
        organizerId: 1,
        name: "Hackathon 2025",
        description: "A 48-hour coding marathon where developers collaborate to create innovative software solutions.",
        private: false,
        groupInvitation: "a1b2c3d4e5f6g7h8"
      },
      {
        organizerId: 2,
        name: "CodeCamp",
        description: "An intensive bootcamp designed to teach coding fundamentals and advanced programming skills.",
        private: true,
        groupInvitation: "z9y8x7w6v5u4t3s2"
      },
      {
        organizerId: 3,
        name: "AI Symposium",
        description: "A symposium focusing on the latest developments in artificial intelligence and machine learning.",
        private: false,
        groupInvitation: "r5q4p3o2n1m0l9k8"
      },
      {
        organizerId: 4,
        name: "DevOps Workshop",
        description: "A hands-on workshop for learning and implementing DevOps practices and tools.",
        private: true,
        groupInvitation: "g7f6e5d4c3b2a1z0"
      },
      {
        organizerId: 5,
        name: "Open Source Conference",
        description: "A conference dedicated to promoting and discussing open-source software and community contributions.",
        private: false,
        groupInvitation: "h8i7j6k5l4m3n2o1"
      }
    ], { validate: true })
  },

  async down (queryInterface, Sequelize) {

    options.tableNmae = 'Groups'

    return queryInterface.bulkDelete(options, null, {})
  }
};
