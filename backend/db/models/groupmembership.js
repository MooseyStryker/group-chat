'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GroupMembership extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      GroupMembership.belongsTo(models.Group, {
        foreignKey: 'groupId'
      })

      GroupMembership.belongsTo(models.User, {
        foreignKey: 'memberId'
      })
    }
  }
  GroupMembership.init({
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    memberId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    invitation:{
      type:  DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [16,16]
      }
    },
    status: {
      type:DataTypes.ENUM,
      values: ['member', 'co-admin', 'pending']
    }
  }, {
    sequelize,
    modelName: 'GroupMembership',
  });
  return GroupMembership;
};
