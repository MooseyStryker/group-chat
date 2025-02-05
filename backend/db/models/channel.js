'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Channel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Channel.hasMany(models.ChannelChat, {
        foreignKey: 'channelId',
        onDelete: 'CASCADE',
        hooks: true
      })

      Channel.belongsTo(models.User, {
        foreignKey:'channelCreatorId'
      })

      Channel.belongsTo(models.Group, {
        foreignKey:'groupId'
      })
    }
  }
  Channel.init({
    channelCreatorId: {
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
