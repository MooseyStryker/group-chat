'use strict';
const { Model } = require('sequelize');

/**
 * @typedef {object} ChannelAttributes
 * @property {number} channelCreatorId - The ID of the user who created the channel.
 * @property {number} groupId - The ID of the group the channel belongs to.
 * @property {string} channelName - The name of the channel.
 * @property {string} channelType - The type of the channel ('Text', 'Voice', 'Forum', 'Announcements').
 * @property {boolean} [private] - Whether the channel is private (optional).
 */

/**
 * @typedef {ChannelAttributes & { id: number, createdAt: Date, updatedAt: Date }} ChannelInstance
 */

/**
 * @param {import('sequelize').Sequelize} sequelize - The Sequelize instance.
 * @param {typeof DataTypes} DataTypes - The Sequelize DataTypes.
 * @returns {typeof Model<ChannelAttributes>}
 */
module.exports = (sequelize, DataTypes) => {
  class Channel extends Model {
    /**
     * @param {object} models - All defined models
     * @returns {void}
     */
    static associate(models) {
      Channel.hasMany(models.ChannelChat, {
        foreignKey: 'channelId',
        onDelete: 'CASCADE',
        hooks: true
      });

      Channel.hasMany(models.ChannelChatPhoto, {
        foreignKey: 'channelId',
        onDelete: 'CASCADE',
        hooks: true
      });

      Channel.belongsTo(models.User, {
        foreignKey: 'channelCreatorId'
      });

      Channel.belongsTo(models.Group, {
        foreignKey: 'groupId'
      });
    }
  }

  Channel.init({
    channelCreatorId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'User', // Correct model name: User
        key: 'id'
      }
    },
    groupId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Group', // Correct model name: Group
        key: 'id'
      }
    },
    channelName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    channelType: {
      type: DataTypes.ENUM,
      values: ['Text', 'Voice', 'Forum', 'Announcements']
    },
    private: {
      type: DataTypes.BOOLEAN
    }
  }, {
    sequelize,
    modelName: 'Channel',
  });

  return Channel;
};
