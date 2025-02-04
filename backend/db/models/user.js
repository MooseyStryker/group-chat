'use strict';

const {  Model, Validator } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      User.hasMany(models.Group, {
        foreignKey: 'organizerId',
        onDelete: 'CASCADE',
        hooks: true
      })

      User.hasMany(models.Channel, {
        foreignKey: 'channelCreatorId',
        onDelete: 'CASCADE',
        hooks: true
      })

    }
  }
  User.init({
    firstName:{
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 40]
      }
    },
    lastName:{
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 40]
      }
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate:{
        len: [4, 30],
        isNotEmail(value){
          if (Validator.isEmail(value)){
            throw new Error("An email in the username is not allowed")
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
        len: [60,60]
      }
    }
  }, {
    sequelize,
    modelName: 'User',

    // The reason we removed the elements from the scope, is to prevent this data being leaked through the React frontend
    defaultScope:{
      attributes:{
        exclude:[
          'hashedPassword', 'email', 'createdAt', 'updatedAt'
        ]
      }
    }
  });
  return User;
};
