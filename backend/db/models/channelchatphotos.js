'use strict';
const { Model } = require('sequelize');

/**
 * @typedef {object} ChannelChatPhotoAttributes
 * @property {number} channelChatId - The ID of the channel chat.
 * @property {number} userId - The ID of the user who uploaded the photo.
 * @property {string} [imgAWSLink] - The AWS link for the photo (optional).
 */

/**
 * @typedef {ChannelChatPhotoAttributes & { id: number, createdAt: Date, updatedAt: Date }} ChannelChatPhotoInstance
 */

/**
 * @param {import('sequelize').Sequelize} sequelize - The Sequelize instance.
 * @param {typeof DataTypes} DataTypes - The Sequelize DataTypes.
 * @returns {typeof Model<ChannelChatPhotoAttributes>}
 */
module.exports = (sequelize, DataTypes) => {
  class ChannelChatPhoto extends Model {
    /**
     * @param {object} models - All defined models
     * @returns {void}
     */
    static associate(models) {
      ChannelChatPhoto.belongsTo(models.Channel, {
        foreignKey: 'channelId'
      });

      ChannelChatPhoto.belongsTo(models.User, {
        foreignKey: 'userId' // Correct foreign key here
      });
    }
  }

  ChannelChatPhoto.init({
    channelChatId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'ChannelChat',
        key: 'id'
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    imgAWSLink: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'ChannelChatPhoto',
  });

  return ChannelChatPhoto;
};
