'use strict';
const { Model } = require('sequelize');

/**
 * @typedef {object} ChannelChatAttributes
 * @property {number} userId - The ID of the user who sent the message.
 * @property {number} channelId - The ID of the channel.
 * @property {string} body - The message body.
 * @property {boolean} visible - Whether the message is visible.
 */

/**
 * @typedef {ChannelChatAttributes & { id: number, createdAt: Date, updatedAt: Date }} ChannelChatInstance
 */

/**
 * @param {import('sequelize').Sequelize} sequelize - The Sequelize instance.
 * @param {typeof DataTypes} DataTypes - The Sequelize DataTypes.
 * @returns {typeof Model<ChannelChatAttributes>}
 */
module.exports = (sequelize, DataTypes) => {
  class ChannelChat extends Model {
    /**
     * @param {object} models - All defined models
     * @returns {void}
     */
    static associate(models) {
      ChannelChat.belongsTo(models.User, {
        foreignKey: 'userId'
      });

      ChannelChat.belongsTo(models.Channel, {
        foreignKey: 'channelId'
      });

      ChannelChat.hasMany(models.ChannelChatReply, {
        foreignKey: 'channelChatId',
        onDelete: 'CASCADE',
        hooks: true
      });
    }
  }

  ChannelChat.init({
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'User', // Correct model name: User
        key: 'id'
      }
    },
    channelId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Channel', // Correct model name: Channel
        key: 'id'
      }
    },
    body: {
      type: DataTypes.STRING,
      allowNull: false
    },
    visible: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    isEdited: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'ChannelChat',
  });

  return ChannelChat;
};
