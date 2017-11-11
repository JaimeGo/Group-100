module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.addColumn('tags','active', 
      {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      })
  },

  down(queryInterface) {
    return queryInterface.removeColumn('tags','active')
  },
};

