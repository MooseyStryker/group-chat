'use strict';

// Helps manage different environments 
let options = {}
if (process.env.NODE_ENV === 'production'){
  options.schema = process.env.SCHEMA
}

options.tableName = "Users"

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    const addColumn = async (columnName) => {
      await queryInterface.addColumn(options, `${columnName}`, {
        type: Sequelize.STRING,
        allowNull: true
      })

      // await queryInterface.sequelize.query(`
      //   UPDATE "Users"
      //   SET "${columnName}" = 'DefaultValue'
      //   WHERE "${columnName}" IS NULL
      // `);

      await queryInterface.changeColumn(options, `${columnName}`, {
        type: Sequelize.STRING,
        allowNull: false
      })

    }

    await addColumn('firstName')
    await addColumn('lastName')

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn(options, 'firstName')

    await queryInterface.removeColumn(options, 'lastName')
  },

};
