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
    }
  }
  GroupMembership.init({
    groupId: DataTypes.INTEGER,
    memberId: DataTypes.INTEGER,
    invitation: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'GroupMembership',
  });
  return GroupMembership;
};