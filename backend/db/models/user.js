'use strict';

const { Model, Validator } = require('sequelize');

/**
 * @typedef {object} UserAttributes
 * @property {string} firstName - The user's first name.
 * @property {string} lastName - The user's last name.
 * @property {string} username - The user's username.
 * @property {string} email - The user's email address.
 * @property {string} hashedPassword - The user's hashed password.
 */

/**
 * @typedef {UserAttributes & { id: number, createdAt: Date, updatedAt: Date }} UserInstance
 */


/**
 * @param {import('sequelize').Sequelize} sequelize - The Sequelize instance.
 * @param {typeof DataTypes} DataTypes - The Sequelize DataTypes.
 * @returns {typeof Model<UserAttributes>}
 */
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * @param {object} models - All defined models
     * @returns {void}
     */
    static associate(models) {
      User.hasMany(models.Group, {
        as: 'OrganizedGroups',
        foreignKey: 'organizerId',
        onDelete: 'CASCADE',
        hooks: true
      });

      User.hasMany(models.Channel, {
        foreignKey: 'channelCreatorId',
        onDelete: 'CASCADE',
        hooks: true
      });

      User.hasMany(models.ChannelChat, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
        hooks: true
      });

      User.hasMany(models.ChannelChatPhoto, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
        hooks: true
      });

      User.hasMany(models.LiveEvent, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
        hooks: true
      });

      User.hasMany(models.GroupMembership, {
        foreignKey: 'memberId',
        onDelete: 'CASCADE',
        hooks: true
      });

      User.hasMany(models.ChannelChatReply, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
        hooks: true
      });

      User.hasMany(models.AttendanceLiveEvent, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
        hooks: true
      });

      User.hasMany(models.Conversation, {
        foreignKey: 'user1Id',
        onDelete: 'CASCADE',
        hooks: true
      })

      User.hasMany(models.Conversation, {
        foreignKey: 'user2Id',
        onDelete: 'CASCADE',
        hooks: true
      })

      User.hasMany(models.Message, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
        hooks: true
      })
    }
  }

  User.init(
    {
      firstName: { type: DataTypes.STRING, allowNull: false, validate: { len: [3, 40] } },
      lastName: { type: DataTypes.STRING, allowNull: false, validate: { len: [3, 40] } },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [4, 30],
          isNotEmail(value) {
            if (Validator.isEmail(value)) {
              throw new Error("An email in the username is not allowed");
            }
          }
        }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [3, 256],
          isEmail: true
        }
      },
      hashedPassword: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [60, 60]
        }
      }
    },
    {
      sequelize,
      modelName: 'User',
      defaultScope: {
        attributes: {
          exclude: ['hashedPassword', 'email', 'createdAt', 'updatedAt']
        }
      }
    }
  );

  return User;
};
