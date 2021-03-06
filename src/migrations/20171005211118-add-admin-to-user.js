module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.addColumn('users','admin', 
      {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      })
  },

  down(queryInterface) {
    return queryInterface.removeColumn('users', 'admin')
  },
};
