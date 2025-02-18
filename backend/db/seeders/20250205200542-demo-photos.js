'use strict';

const { ChannelChatPhoto } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production'){
  options.schema = process.env.SCHEMA // We define the schema in the options objust to allow render to create a database in production
}

options.tableName = 'ChannelChatPhotos'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await ChannelChatPhoto.bulkCreate([
      {
        channelId: 1,
        userId: 1,
        imgAWSLink: "https://example.com/image1.jpg"
      },
      {
        channelId: 1,
        userId: 2,
        imgAWSLink: "https://example.com/image2.jpg"
      },
      {
        channelId: 1,
        userId: 3,
        imgAWSLink: "https://example.com/image3.jpg"
      },
      {
        channelId: 1,
        userId: 4,
        imgAWSLink: "https://example.com/image4.jpg"
      },
      {
        channelId: 1,
        userId: 5,
        imgAWSLink: "https://example.com/image5.jpg"
      }
    ], { validate: true })

  },

  async down (queryInterface, Sequelize) {

    options.tableName = 'ChannelChatPhotos'

    return queryInterface.bulkDelete(options,null, {})
  }
};
