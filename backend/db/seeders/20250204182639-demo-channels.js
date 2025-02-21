'use strict';

const { Channel } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production'){
  options.schema = process.env.SCHEMA // We define the schema in the options objust to allow render to create a database in production
}

options.tableName = 'Channels'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Channel.bulkCreate([
      {
        channelCreatorId: 1,
        groupId: 1,
        channelName: "Python General",
        channelType: "Text",
        private: false
      },
      {
        channelCreatorId: 2,
        groupId: 1,
        channelName: "Python Voice Lounge",
        channelType: "Voice",
        private: true
      },
      {
        channelCreatorId: 3,
        groupId: 1,
        channelName: "Python Updates",
        channelType: "Announcements",
        private: false
      },
      {
        channelCreatorId: 4,
        groupId: 1,
        channelName: "Python Forums",
        channelType: "Forum",
        private: false
      },
      {
        channelCreatorId: 5,
        groupId: 1,
        channelName: "Python Dev Meeting Room",
        channelType: "Voice",
        private: true
      },{
        channelCreatorId: 1,
        groupId: 29,
        channelName: "Self-enabling hybrid project",
        channelType: "Voice",
        private: false
      }, {
        channelCreatorId: 9,
        groupId: 14,
        channelName: "Reactive contextually-based collaboration",
        channelType: "Text",
        private: true
      }, {
        channelCreatorId: 2,
        groupId: 70,
        channelName: "Configurable well-modulated internet solution",
        channelType: "Voice",
        private: true
      }, {
        channelCreatorId: 5,
        groupId: 22,
        channelName: "Stand-alone leading edge attitude",
        channelType: "Voice",
        private: false
      }, {
        channelCreatorId: 1,
        groupId: 28,
        channelName: "Object-based logistical matrix",
        channelType: "Voice",
        private: true
      }, {
        channelCreatorId: 7,
        groupId: 36,
        channelName: "Devolved heuristic info-mediaries",
        channelType: "Voice",
        private: false
      }, {
        channelCreatorId: 8,
        groupId: 4,
        channelName: "Polarised actuating secured line",
        channelType: "Voice",
        private: true
      }, {
        channelCreatorId: 10,
        groupId: 36,
        channelName: "Exclusive web-enabled matrices",
        channelType: "Text",
        private: false
      }, {
        channelCreatorId: 7,
        groupId: 25,
        channelName: "Realigned motivating info-mediaries",
        channelType: "Text",
        private: false
      }, {
        channelCreatorId: 3,
        groupId: 1,
        channelName: "Innovative 24 hour customer loyalty",
        channelType: "Text",
        private: true
      }, {
        channelCreatorId: 8,
        groupId: 31,
        channelName: "Visionary static knowledge user",
        channelType: "Text",
        private: false
      }, {
        channelCreatorId: 9,
        groupId: 5,
        channelName: "Multi-tiered static productivity",
        channelType: "Voice",
        private: true
      }, {
        channelCreatorId: 9,
        groupId: 37,
        channelName: "Devolved modular algorithm",
        channelType: "Text",
        private: false
      }, {
        channelCreatorId: 1,
        groupId: 32,
        channelName: "Triple-buffered executive approach",
        channelType: "Text",
        private: true
      }, {
        channelCreatorId: 4,
        groupId: 65,
        channelName: "Business-focused multi-state product",
        channelType: "Voice",
        private: true
      }, {
        channelCreatorId: 1,
        groupId: 7,
        channelName: "Self-enabling encompassing system engine",
        channelType: "Voice",
        private: true
      }, {
        channelCreatorId: 4,
        groupId: 32,
        channelName: "Optimized uniform challenge",
        channelType: "Voice",
        private: false
      }, {
        channelCreatorId: 8,
        groupId: 62,
        channelName: "Optimized exuding artificial intelligence",
        channelType: "Text",
        private: true
      }, {
        channelCreatorId: 1,
        groupId: 54,
        channelName: "Ameliorated solution-oriented internet solution",
        channelType: "Voice",
        private: true
      }, {
        channelCreatorId: 5,
        groupId: 24,
        channelName: "Universal object-oriented open architecture",
        channelType: "Voice",
        private: false
      }, {
        channelCreatorId: 9,
        groupId: 5,
        channelName: "Extended next generation database",
        channelType: "Voice",
        private: false
      }, {
        channelCreatorId: 8,
        groupId: 11,
        channelName: "Team-oriented directional firmware",
        channelType: "Voice",
        private: true
      }, {
        channelCreatorId: 5,
        groupId: 71,
        channelName: "Monitored high-level task-force",
        channelType: "Voice",
        private: true
      }, {
        channelCreatorId: 5,
        groupId: 14,
        channelName: "Adaptive 24/7 project",
        channelType: "Voice",
        private: false
      }, {
        channelCreatorId: 1,
        groupId: 27,
        channelName: "Automated intermediate superstructure",
        channelType: "Text",
        private: true
      }, {
        channelCreatorId: 6,
        groupId: 14,
        channelName: "Balanced grid-enabled standardization",
        channelType: "Text",
        private: true
      }, {
        channelCreatorId: 8,
        groupId: 36,
        channelName: "Enterprise-wide incremental throughput",
        channelType: "Text",
        private: true
      }, {
        channelCreatorId: 1,
        groupId: 56,
        channelName: "Optional motivating function",
        channelType: "Voice",
        private: true
      }, {
        channelCreatorId: 10,
        groupId: 5,
        channelName: "Future-proofed directional collaboration",
        channelType: "Text",
        private: false
      }, {
        channelCreatorId: 5,
        groupId: 12,
        channelName: "Networked client-driven moratorium",
        channelType: "Voice",
        private: true
      }, {
        channelCreatorId: 7,
        groupId: 64,
        channelName: "Ergonomic impactful array",
        channelType: "Text",
        private: false
      }, {
        channelCreatorId: 1,
        groupId: 19,
        channelName: "Polarised clear-thinking concept",
        channelType: "Text",
        private: false
      }, {
        channelCreatorId: 9,
        groupId: 28,
        channelName: "User-friendly national model",
        channelType: "Voice",
        private: true
      }, {
        channelCreatorId: 10,
        groupId: 67,
        channelName: "Function-based reciprocal middleware",
        channelType: "Voice",
        private: false
      }, {
        channelCreatorId: 8,
        groupId: 25,
        channelName: "Realigned 24/7 protocol",
        channelType: "Voice",
        private: false
      }, {
        channelCreatorId: 3,
        groupId: 64,
        channelName: "Versatile multimedia methodology",
        channelType: "Voice",
        private: false
      }, {
        channelCreatorId: 1,
        groupId: 30,
        channelName: "Customizable zero administration strategy",
        channelType: "Text",
        private: true
      }, {
        channelCreatorId: 2,
        groupId: 58,
        channelName: "Multi-channelled multi-state project",
        channelType: "Voice",
        private: true
      }, {
        channelCreatorId: 4,
        groupId: 21,
        channelName: "Ameliorated 6th generation pricing structure",
        channelType: "Voice",
        private: true
      }, {
        channelCreatorId: 3,
        groupId: 9,
        channelName: "Progressive clear-thinking superstructure",
        channelType: "Voice",
        private: false
      }, {
        channelCreatorId: 10,
        groupId: 33,
        channelName: "Focused bottom-line emulation",
        channelType: "Voice",
        private: false
      }, {
        channelCreatorId: 6,
        groupId: 51,
        channelName: "Open-source bottom-line approach",
        channelType: "Text",
        private: true
      }, {
        channelCreatorId: 2,
        groupId: 32,
        channelName: "Adaptive value-added website",
        channelType: "Text",
        private: false
      }, {
        channelCreatorId: 8,
        groupId: 40,
        channelName: "Devolved national framework",
        channelType: "Text",
        private: true
      }, {
        channelCreatorId: 9,
        groupId: 34,
        channelName: "Switchable global superstructure",
        channelType: "Voice",
        private: false
      }, {
        channelCreatorId: 3,
        groupId: 21,
        channelName: "Future-proofed mission-critical hierarchy",
        channelType: "Text",
        private: true
      }, {
        channelCreatorId: 5,
        groupId: 17,
        channelName: "Seamless optimal time-frame",
        channelType: "Voice",
        private: true
      }, {
        channelCreatorId: 9,
        groupId: 22,
        channelName: "Versatile maximized access",
        channelType: "Voice",
        private: false
      }, {
        channelCreatorId: 3,
        groupId: 11,
        channelName: "Enhanced background software",
        channelType: "Voice",
        private: false
      }, {
        channelCreatorId: 1,
        groupId: 19,
        channelName: "Cloned modular product",
        channelType: "Voice",
        private: true
      }, {
        channelCreatorId: 7,
        groupId: 71,
        channelName: "Persevering web-enabled conglomeration",
        channelType: "Voice",
        private: true
      }, {
        channelCreatorId: 7,
        groupId: 18,
        channelName: "Ergonomic regional knowledge base",
        channelType: "Voice",
        private: false
      }, {
        channelCreatorId: 5,
        groupId: 32,
        channelName: "Exclusive scalable benchmark",
        channelType: "Voice",
        private: false
      }, {
        channelCreatorId: 2,
        groupId: 51,
        channelName: "Future-proofed interactive instruction set",
        channelType: "Voice",
        private: true
      }, {
        channelCreatorId: 2,
        groupId: 51,
        channelName: "Operative transitional benchmark",
        channelType: "Text",
        private: false
      }, {
        channelCreatorId: 10,
        groupId: 53,
        channelName: "User-friendly mission-critical interface",
        channelType: "Text",
        private: false
      }, {
        channelCreatorId: 4,
        groupId: 19,
        channelName: "Balanced zero defect open system",
        channelType: "Voice",
        private: true
      }, {
        channelCreatorId: 5,
        groupId: 36,
        channelName: "Innovative impactful task-force",
        channelType: "Voice",
        private: false
      }, {
        channelCreatorId: 4,
        groupId: 4,
        channelName: "Managed dedicated service-desk",
        channelType: "Voice",
        private: false
      }, {
        channelCreatorId: 7,
        groupId: 46,
        channelName: "Function-based uniform interface",
        channelType: "Text",
        private: false
      }, {
        channelCreatorId: 5,
        groupId: 30,
        channelName: "Reduced non-volatile ability",
        channelType: "Voice",
        private: true
      }, {
        channelCreatorId: 4,
        groupId: 61,
        channelName: "Centralized maximized attitude",
        channelType: "Voice",
        private: false
      }, {
        channelCreatorId: 5,
        groupId: 46,
        channelName: "Programmable bi-directional synergy",
        channelType: "Voice",
        private: false
      }, {
        channelCreatorId: 1,
        groupId: 51,
        channelName: "Polarised homogeneous focus group",
        channelType: "Voice",
        private: true
      }, {
        channelCreatorId: 1,
        groupId: 27,
        channelName: "Reactive regional portal",
        channelType: "Text",
        private: false
      }, {
        channelCreatorId: 6,
        groupId: 25,
        channelName: "Reverse-engineered cohesive strategy",
        channelType: "Voice",
        private: true
      }, {
        channelCreatorId: 5,
        groupId: 22,
        channelName: "Distributed systematic project",
        channelType: "Voice",
        private: true
      }, {
        channelCreatorId: 5,
        groupId: 24,
        channelName: "Synergized disintermediate Graphic Interface",
        channelType: "Voice",
        private: false
      }, {
        channelCreatorId: 7,
        groupId: 18,
        channelName: "Progressive zero administration definition",
        channelType: "Voice",
        private: true
      }, {
        channelCreatorId: 4,
        groupId: 41,
        channelName: "Operative motivating alliance",
        channelType: "Voice",
        private: true
      }, {
        channelCreatorId: 3,
        groupId: 11,
        channelName: "Horizontal content-based superstructure",
        channelType: "Voice",
        private: true
      }, {
        channelCreatorId: 8,
        groupId: 13,
        channelName: "Robust encompassing emulation",
        channelType: "Voice",
        private: false
      }, {
        channelCreatorId: 4,
        groupId: 58,
        channelName: "Centralized high-level attitude",
        channelType: "Text",
        private: true
      }, {
        channelCreatorId: 5,
        groupId: 12,
        channelName: "User-centric human-resource process improvement",
        channelType: "Voice",
        private: true
      }, {
        channelCreatorId: 6,
        groupId: 27,
        channelName: "Enterprise-wide full-range solution",
        channelType: "Voice",
        private: true
      }, {
        channelCreatorId: 7,
        groupId: 33,
        channelName: "Realigned disintermediate moratorium",
        channelType: "Voice",
        private: false
      }, {
        channelCreatorId: 6,
        groupId: 64,
        channelName: "User-friendly scalable capability",
        channelType: "Text",
        private: true
      }, {
        channelCreatorId: 6,
        groupId: 39,
        channelName: "Automated neutral adapter",
        channelType: "Voice",
        private: false
      }, {
        channelCreatorId: 10,
        groupId: 21,
        channelName: "Adaptive full-range conglomeration",
        channelType: "Voice",
        private: false
      }, {
        channelCreatorId: 4,
        groupId: 47,
        channelName: "Function-based impactful synergy",
        channelType: "Voice",
        private: false
      }, {
        channelCreatorId: 9,
        groupId: 33,
        channelName: "Integrated web-enabled capacity",
        channelType: "Text",
        private: false
      }, {
        channelCreatorId: 4,
        groupId: 5,
        channelName: "Integrated tertiary infrastructure",
        channelType: "Voice",
        private: false
      }, {
        channelCreatorId: 1,
        groupId: 44,
        channelName: "Reduced encompassing capability",
        channelType: "Text",
        private: true
      }, {
        channelCreatorId: 4,
        groupId: 13,
        channelName: "Digitized content-based array",
        channelType: "Text",
        private: true
      }, {
        channelCreatorId: 4,
        groupId: 8,
        channelName: "Synchronised encompassing framework",
        channelType: "Voice",
        private: false
      }, {
        channelCreatorId: 10,
        groupId: 61,
        channelName: "Quality-focused uniform database",
        channelType: "Voice",
        private: false
      }, {
        channelCreatorId: 2,
        groupId: 31,
        channelName: "Expanded encompassing productivity",
        channelType: "Voice",
        private: true
      }, {
        channelCreatorId: 4,
        groupId: 27,
        channelName: "Multi-tiered mission-critical knowledge user",
        channelType: "Voice",
        private: false
      }, {
        channelCreatorId: 4,
        groupId: 48,
        channelName: "Face to face full-range frame",
        channelType: "Voice",
        private: false
      }, {
        channelCreatorId: 3,
        groupId: 65,
        channelName: "Reduced national matrices",
        channelType: "Voice",
        private: true
      }, {
        channelCreatorId: 3,
        groupId: 59,
        channelName: "Enhanced systemic capacity",
        channelType: "Text",
        private: false
      }, {
        channelCreatorId: 7,
        groupId: 20,
        channelName: "Business-focused regional database",
        channelType: "Voice",
        private: true
      }, {
        channelCreatorId: 10,
        groupId: 72,
        channelName: "Digitized hybrid analyzer",
        channelType: "Text",
        private: true
      }, {
        channelCreatorId: 3,
        groupId: 53,
        channelName: "Profit-focused solution-oriented forecast",
        channelType: "Voice",
        private: true
      }, {
        channelCreatorId: 5,
        groupId: 44,
        channelName: "Switchable tangible flexibility",
        channelType: "Voice",
        private: false
      }, {
        channelCreatorId: 8,
        groupId: 6,
        channelName: "Cloned user-facing installation",
        channelType: "Voice",
        private: false
      }, {
        channelCreatorId: 6,
        groupId: 11,
        channelName: "Object-based background orchestration",
        channelType: "Voice",
        private: false
      }, {
        channelCreatorId: 2,
        groupId: 18,
        channelName: "Reduced grid-enabled approach",
        channelType: "Text",
        private: true
      }, {
        channelCreatorId: 1,
        groupId: 43,
        channelName: "Programmable background approach",
        channelType: "Text",
        private: false
      }, {
        channelCreatorId: 10,
        groupId: 62,
        channelName: "Organized homogeneous customer loyalty",
        channelType: "Voice",
        private: true
      }
    ], { validate: true })
  },

  async down (queryInterface, Sequelize) {

    options.tableName = 'Channels'

    return queryInterface.bulkDelete(options, null, {})
  }
};
