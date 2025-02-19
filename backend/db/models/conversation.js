'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Conversation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

      Conversation.belongsTo(models.User, {
        foreignKey: 'user1Id'
      })

      Conversation.belongsTo(models.User, {
        foreignKey: 'user2Id'
      })

      Conversation.hasMany(models.Message, {
        foreignKey: 'conversationId',
        onDelete: 'CASCADE',
        hooks: true
      })
    }
  }
  Conversation.init({
    user1Id: {
      type: DataTypes.INTEGER,
      references:{
        model: 'User',
        key: 'id'
      }

    },
    user2Id: {
      type: DataTypes.INTEGER,
      references:{
        model: 'User',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Conversation',
  });
  return Conversation;
};
