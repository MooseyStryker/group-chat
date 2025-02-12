'use strict';
const { Model } = require('sequelize');

/**
 * @typedef {object} GroupMembershipAttributes
 * @property {number} groupId - The ID of the group.
 * @property {number} memberId - The ID of the member (user).
 * @property {string} invitation - The invitation code.
 * @property {string} [status] - The membership status ('member', 'co-admin', 'pending').
 */

/**
 * @typedef {GroupMembershipAttributes & { id: number, createdAt: Date, updatedAt: Date }} GroupMembershipInstance
 */

/**
 * @param {import('sequelize').Sequelize} sequelize - The Sequelize instance.
 * @param {typeof DataTypes} DataTypes - The Sequelize DataTypes.
 * @returns {typeof Model<GroupMembershipAttributes>}
 */
module.exports = (sequelize, DataTypes) => {
  class GroupMembership extends Model {
    /**
     * @param {object} models - All defined models
     * @returns {void}
     */
    static associate(models) {
      GroupMembership.belongsTo(models.Group, {
        foreignKey: 'groupId'
      });

      GroupMembership.belongsTo(models.User, {
        foreignKey: 'memberId'
      });
    }
  }

  GroupMembership.init({
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Group',
        key: 'id'
      }
    },
    memberId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    invitation: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [16, 16]
      }
    },
    status: {
      type: DataTypes.ENUM,
      values: ['member', 'co-admin', 'pending']
    }
  }, {
    sequelize,
    modelName: 'GroupMembership',
    defaultScope: {
      attributes: {
        exclude: ['invitation']
      }
  }
  });

  return GroupMembership;
};
