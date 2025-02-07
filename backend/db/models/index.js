'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../../config/database.js')[env];
const attendanceliveevents = require("./attendanceliveevents")
const channel = require("./channel")
const channelchat = require("./channelchat")
const channelchatphotos = require("./channelchatphotos")
const channelchatreply = require("./channelchatreply")
const group = require("./group")
const groupmembership = require("./groupmembership")
const liveevents = require("./liveevents")
const user = require("./user")

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

const db = {
  Channel: channel(sequelize, Sequelize.DataTypes),
  ChannelChat: channelchat(sequelize, Sequelize.DataTypes),
  ChannelChatPhotos: channelchatphotos(sequelize, Sequelize.DataTypes),
  ChannelChatReply: channelchatreply(sequelize, Sequelize.DataTypes),
  Group: group(sequelize, Sequelize.DataTypes),
  GroupMembership: groupmembership(sequelize, Sequelize.DataTypes),
  LiveEvent: liveevents(sequelize, Sequelize.DataTypes),
  AttendanceLiveEvent: attendanceliveevents(sequelize, Sequelize.DataTypes),
  User: user(sequelize, Sequelize.DataTypes),
};

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
