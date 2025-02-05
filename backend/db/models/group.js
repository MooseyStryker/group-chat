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

      Group.hasMany(models.Channel, {
        foreignKey: 'groupId',
        onDelete: 'CASCADE',
        hooks: true
      });


      Group.belongsTo(models.User, {
        foreignKey: 'organizerId'
      })

    }
  }
  Group.init({
    organizerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id'
      }
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
      allowNull: false,
      validate: {
        len: [16, 16]
      }
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
