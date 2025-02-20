'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

      Message.belongsTo(models.User, {
        foreignKey: 'userId'
      })

      Message.belongsTo(models.Conversation, {
        foreignKey: 'conversationId'
      })
    }
  }
  Message.init({
    conversationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references:{
        model: 'Conversation',
        key: 'id'
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references:{
        model: 'User',
        key: 'id'
      }
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false
    },
    previousContentBeforeEditted: {
      type: DataTypes.STRING
    },
    sentAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Message',
  });
  return Message;
};
