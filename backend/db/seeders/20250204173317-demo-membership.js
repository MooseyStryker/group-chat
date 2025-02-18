'use strict';

const { GroupMembership } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production'){
  options.schema = process.env.SCHEMA // We define the schema in the options objust to allow render to create a database in production
}

options.tableName = 'GroupMemberships'


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await GroupMembership.bulkCreate([
      {
        groupId: 1,
        memberId: 2,
        invitation: "a1b2c3d4e5f6g7h8",
        status: "member"
      },
      {
        groupId: 1,
        memberId: 3,
        invitation: "a1b2c3d4e5f6g7h8",
        status: "co-admin"
      },
      {
        groupId: 1,
        memberId: 4,
        invitation: "a1b2c3d4e5f6g7h8",
        status: "pending"
      },
      {
        groupId: 3,
        memberId: 1,
        invitation: "a1b2c3d4e5f6g7h8",
        status: "co-admin"
      },
      {
        groupId: 1,
        memberId: 5,
        invitation: "a1b2c3d4e5f6g7h8",
        status: "member"
      }
    ], { validate: true })
  },

  async down (queryInterface, Sequelize) {

    options.tableName = 'GroupMemberships'

    return queryInterface.bulkDelete(options, null, {})
  }
};
