'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LiveEvent extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      LiveEvent.belongsTo(models.User, {
        foreignKey: 'userId'
      })

      LiveEvent.belongsTo(models.Group, {
        foreignKey: 'groupId'
      })
    }
  }
  LiveEvent.init({
    userId: {
      type:DataTypes.INTEGER
    },
    groupId: {
      type:DataTypes.INTEGER
    },
    name: {
      type:DataTypes.STRING,
      allowNull:false,
      validate: {
        len: [3,256]
      }
    },
    description: {
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        len: [5, 3000]
      }
    },
    repeat: {
      type:DataTypes.ENUM,
      allowNull: false,
      values: ['daily', 'weekly', 'monthly']
    },
    private: {
      type:DataTypes.BOOLEAN,
      allowNull: false
    },
    privateInvitation:{
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [16,16]
      }
    }
  }, {
    sequelize,
    modelName: 'LiveEvent',
  });
  return LiveEvent;
};
