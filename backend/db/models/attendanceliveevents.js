'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AttendanceLiveEvent extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  AttendanceLiveEvent.init({
    liveEventId: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    invitationForPrivateLiveEvents: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len:[16,16]
      }
    }
  }, {
    sequelize,
    modelName: 'AttendanceLiveEvent',
  });
  return AttendanceLiveEvent;
};
