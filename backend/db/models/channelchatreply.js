'use strict';
const { Model } = require('sequelize');

/**
 * @typedef {object} ChannelChatReplyAttributes
 * @property {number} channelChatId - The ID of the channel chat.
 * @property {number} userId - The ID of the user who replied.
 * @property {string} body - The reply body.
 * @property {boolean} visible - Whether the reply is visible.
 */

/**
 * @typedef {ChannelChatReplyAttributes & { id: number, createdAt: Date, updatedAt: Date }} ChannelChatReplyInstance
 */

/**
 * @param {import('sequelize').Sequelize} sequelize - The Sequelize instance.
 * @param {typeof DataTypes} DataTypes - The Sequelize DataTypes.
 * @returns {typeof Model<ChannelChatReplyAttributes>}
 */
module.exports = (sequelize, DataTypes) => {
  class ChannelChatReply extends Model {
    /**
     * @param {object} models - All defined models
     * @returns {void}
     */
    static associate(models) {
      ChannelChatReply.belongsTo(models.User, {
        foreignKey: 'userId'
      });

      ChannelChatReply.belongsTo(models.ChannelChat, {
        foreignKey: 'channelChatId'
      });
    }
  }

  ChannelChatReply.init({
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
    body: {
      type: DataTypes.STRING,
      allowNull: false
    },
    visible: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'ChannelChatReply',
  });

  return ChannelChatReply;
};