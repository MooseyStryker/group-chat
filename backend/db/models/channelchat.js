'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ChannelChat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      ChannelChat.belongsTo(models.User, {
        foreignKey: 'userId'
      })

      ChannelChat.belongsTo(models.Channel, {
        foreignKey: 'channelId'
      })

      ChannelChat.hasMany(models.ChannelChatPhoto, {
        foreignKey: 'channelChatId',
        onDelete: 'CASCADE',
        hooks: true
      })
    }
  }
  ChannelChat.init({
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    channelId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Channels',
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
    modelName: 'ChannelChat',
  });
  return ChannelChat;
};
