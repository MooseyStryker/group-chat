'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ChannelChatReply extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      ChannelChatReply.belongsTo(models.User, {
        foreignKey: 'userId'
      })

      ChannelChatReply.belongsTo(models.ChannelChat, {
        foreignKey: 'channelChatId'
      })

    }
  }
  ChannelChatReply.init({
    channelChatId: {
      type:DataTypes.INTEGER,
      references: {
        model: 'ChannelChat',
        key: 'id'
      }
    },
    userId: {
      type:DataTypes.INTEGER,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    body: {
      type:DataTypes.STRING,
      allowNull: false
    },
    visible: {
      type:DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'ChannelChatReply',
  });
  return ChannelChatReply;
};
