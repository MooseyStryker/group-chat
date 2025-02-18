'use strict';
const { Model } = require('sequelize');

/**
 * @typedef {object} LiveEventAttributes
 * @property {number} userId - The ID of the user who created the live event.
 * @property {number} groupId - The ID of the group the live event belongs to.
 * @property {string} name - The name of the live event.
 * @property {string} description - The description of the live event.
 * @property {string} repeat - The repeat frequency ('daily', 'weekly', 'monthly').
 * @property {boolean} private - Whether the live event is private.
 * @property {string} privateInvitation - The private invitation code.
 */

/**
 * @typedef {LiveEventAttributes & { id: number, createdAt: Date, updatedAt: Date }} LiveEventInstance
 */

/**
 * @param {import('sequelize').Sequelize} sequelize - The Sequelize instance.
 * @param {typeof DataTypes} DataTypes - The Sequelize DataTypes.
 * @returns {typeof Model<LiveEventAttributes>}
 */
module.exports = (sequelize, DataTypes) => {
  class LiveEvent extends Model {
    /**
     * @param {object} models - All defined models
     * @returns {void}
     */
    static associate(models) {
      LiveEvent.hasMany(models.AttendanceLiveEvent, {
        foreignKey: 'liveEventId',
        onDelete: 'CASCADE',
        hooks: true
      });

      LiveEvent.belongsTo(models.User, {
        foreignKey: 'userId'
      });

      LiveEvent.belongsTo(models.Group, {
        foreignKey: 'groupId'
      });
    }
  }

  LiveEvent.init({
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    groupId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Group',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 256]
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [5, 3000]
      }
    },
    repeat: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: ['daily', 'weekly', 'monthly']
    },
    private: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    privateInvitation: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [16, 16]
      }
    }
  }, {
    sequelize,
    modelName: 'LiveEvent',
    defaultScope:{
      attributes:{
        exclude: ['privateInvitation']
      }
    }
  });

  return LiveEvent;
};
