'use strict';
const { Model } = require('sequelize');

/**
 * @typedef {object} AttendanceLiveEventAttributes
 * @property {number} liveEventId - The ID of the live event.
 * @property {number} userId - The ID of the user attending.
 * @property {string} invitationForPrivateLiveEvents - The invitation code for private live events.
 */

/**
 * @typedef {AttendanceLiveEventAttributes & { id: number, createdAt: Date, updatedAt: Date }} AttendanceLiveEventInstance
 */

/**
 * @param {import('sequelize').Sequelize} sequelize - The Sequelize instance.
 * @param {typeof DataTypes} DataTypes - The Sequelize DataTypes.
 * @returns {typeof Model<AttendanceLiveEventAttributes>}
 */
module.exports = (sequelize, DataTypes) => {
  class AttendanceLiveEvent extends Model {
    /**
     * @param {object} models - All defined models
     * @returns {void}
     */
    static associate(models) {
      AttendanceLiveEvent.belongsTo(models.LiveEvent, {
        foreignKey: 'liveEventId'
      });

      AttendanceLiveEvent.belongsTo(models.User, {
        foreignKey: 'userId'
      });
    }
  }

  AttendanceLiveEvent.init({
    liveEventId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'LiveEvent',
        key: 'id'
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    invitationForPrivateLiveEvents: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [16, 16]
      }
    }
  }, {
    sequelize,
    modelName: 'AttendanceLiveEvent',
    // Composite primary key:
    primaryKey: {
      name: 'id', // You can give it a name
      fields: ['liveEventId', 'userId']
    }
  });

  return AttendanceLiveEvent;
};
