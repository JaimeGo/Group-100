module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.addColumn('users','admin', Sequelize.BOOLEAN)
  },

  down(queryInterface) {
    return queryInterface.removeColumn('users', 'admin')
  },
};
