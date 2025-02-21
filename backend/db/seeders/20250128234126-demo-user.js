'use strict';

const { User } = require('../models')
const bcrypt = require('bcryptjs')

let options = {};
if (process.env.NODE_ENV === 'production'){
  options.schema = process.env.SCHEMA // We define the schema in the options objust to allow render to create a database in production
}

options.tableName = 'Users'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await User.bulkCreate([
      {
        firstName:'John',
        lastName:'Doe',
        email: 'john.doe@example.com',
        username: 'john_doe',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName:'Jane',
        lastName:'Smith',
        email: 'jane.smith@example.com',
        username: 'jane_smith',
        hashedPassword: bcrypt.hashSync('securepassword123')
      },
      {
        firstName:'Mike',
        lastName:'Jones',
        email: 'mike.jones@example.com',
        username: 'mike_jones',
        hashedPassword: bcrypt.hashSync('mysecretpass')
      },
      {
        firstName:'Emily',
        lastName:'Johnson',
        email: 'emily.johnson@example.com',
        username: 'emily_johnson',
        hashedPassword: bcrypt.hashSync('anotherpassword')
      },
      {
        firstName:'Chris',
        lastName:'Lee',
        email: 'chris.lee@example.com',
        username: 'chris_lee',
        hashedPassword: bcrypt.hashSync('supersecurepassword')
      },
      {
        firstName: 'Alice',
        lastName: 'Brown',
        email: 'alice.brown@example.com',
        username: 'alice_brown',
        hashedPassword: bcrypt.hashSync('mypassword123')
      },
      {
        firstName: 'David',
        lastName: 'Wilson',
        email: 'david.wilson@example.com',
        username: 'david_wilson',
        hashedPassword: bcrypt.hashSync('davidpassword')
      },
      {
        firstName: 'Sarah',
        lastName: 'Taylor',
        email: 'sarah.taylor@example.com',
        username: 'sarah_taylor',
        hashedPassword: bcrypt.hashSync('taylormade')
      },
      {
        firstName: 'Robert',
        lastName: 'Davis',
        email: 'robert.davis@example.com',
        username: 'robert_davis',
        hashedPassword: bcrypt.hashSync('robertssecret')
      },
      {
        firstName: 'Laura',
        lastName: 'Martin',
        email: 'laura.martin@example.com',
        username: 'laura_martin',
        hashedPassword: bcrypt.hashSync('martinsecure')
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {

    options.tableName = 'Users';

    return queryInterface.bulkDelete(options, null, {})
  }
};
