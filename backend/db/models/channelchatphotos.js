'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ChannelChatPhoto extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      ChannelChatPhoto.belongsTo(models.ChannelChat,{
        foreignKey: 'channelChatId'
      })

      ChannelChatPhoto.belongsTo(models.User,{
        foreignKey: 'channelChatId'
      })
    }
  }


  ChannelChatPhoto.init({
    channelChatId: {
      type: DataTypes.INTEGER,
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
    imgAWSLink: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'ChannelChatPhoto',
  });
  return ChannelChatPhoto;
};
