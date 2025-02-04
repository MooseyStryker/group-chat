'use strict';
const {
  Model,
  Validator
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Group.init({
    organizerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [3,256]
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        len: [5, 3000]
      }
    },
    private: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    groupInvitation: {
      type: DataTypes.STRING,
      allowNull: false
    },
    imgAWSLink: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'Group',

    defaultScope: {
      attributes: {
        exclude: [
          'groupInvitation'
        ]
      }
    }
  });
  return Group;
};
