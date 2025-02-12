'use strict';
const { Model } = require('sequelize');

/**
 * @typedef {object} GroupAttributes
 * @property {number} organizerId - The ID of the user who organized the group.
 * @property {string} name - The name of the group.
 * @property {string} description - The description of the group.
 * @property {boolean} private - Whether the group is private.
 * @property {string} groupInvitation - The group invitation code.
 * @property {string} [imgAWSLink] - The AWS link for the group's image (optional).
 */

/**
 * @typedef {GroupAttributes & { id: number, createdAt: Date, updatedAt: Date }} GroupInstance
 */

/**
 * @param {import('sequelize').Sequelize} sequelize - The Sequelize instance.
 * @param {typeof DataTypes} DataTypes - The Sequelize DataTypes.
 * @returns {typeof Model<GroupAttributes>}
 */
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * @param {object} models - All defined models
     * @returns {void}
     */
    static associate(models) {
      Group.belongsTo(models.User, { as: 'Organizer', foreignKey: 'organizerId' });
      Group.hasMany(models.Channel, { foreignKey: 'groupId', onDelete: 'CASCADE', hooks: true });
      Group.hasMany(models.LiveEvent, { foreignKey: 'groupId', onDelete: 'CASCADE', hooks: true });
      Group.hasMany(models.GroupMembership, { foreignKey: 'groupId', onDelete: 'CASCADE', hooks: true });
    }
  }

  /**
   * @param {import('sequelize').Sequelize} sequelize - The Sequelize instance.
   * @param {typeof DataTypes} DataTypes - The Sequelize DataTypes.
   * @returns {Group} The initialized Group model.
   */
  Group.init(
    {
      organizerId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'User', key: 'id' } },
      name: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { len: [3, 256] } },
      description: { type: DataTypes.STRING, allowNull: false, validate: { len: [5, 3000] } },
      private: { type: DataTypes.BOOLEAN, allowNull: false },
      groupInvitation: { type: DataTypes.STRING, allowNull: false, validate: { len: [16, 16] } },
      imgAWSLink: { type: DataTypes.STRING }
    },
    {
      sequelize,
      modelName: 'Group',
      defaultScope: { attributes: { exclude: ['groupInvitation'] } }
    }
  );

  return Group;
};