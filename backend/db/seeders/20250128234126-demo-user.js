'use strict';

const { User } = require('../models')
const bcrypt = require('bcryptjs')

let options = {};
if (process.env.NODE_ENV === 'production'){
  options.schema = process.env.SCHEMA // We define the schema in the options objust to allow render to create a database in production
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await User.bulkCreate([
      {
        firstName:'John',
        firstName:'Doe',
        email: 'john.doe@example.com',
        username: 'john_doe',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName:'Jane',
        firstName:'Smith',
        email: 'jane.smith@example.com',
        username: 'jane_smith',
        hashedPassword: bcrypt.hashSync('securepassword123')
      },
      {
        firstName:'Mike',
        firstName:'Jones',
        email: 'mike.jones@example.com',
        username: 'mike_jones',
        hashedPassword: bcrypt.hashSync('mysecretpass')
      },
      {
        firstName:'Emily',
        firstName:'Johnson',
        email: 'emily.johnson@example.com',
        username: 'emily_johnson',
        hashedPassword: bcrypt.hashSync('anotherpassword')
      },
      {
        firstName:'Chris',
        firstName:'Lee',
        email: 'chris.lee@example.com',
        username: 'chris_lee',
        hashedPassword: bcrypt.hashSync('supersecurepassword')
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {

    options.tableName = 'Users';
    const Op = Sequelize.Op;

    return queryInterface.bulkDelete(options, {
      username: {
        [Op.in]: [
          'john_doe',
          'jane_smith',
          'mike_jones',
          'emily_johnson',
          'chris_lee'
        ]
      }
    }, {})
  }
};
