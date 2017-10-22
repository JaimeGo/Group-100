module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.addColumn('tagquestions','userId', 
      {
        type: Sequelize.INTEGER,
        allowNull: false,
      })
  },

  down(queryInterface) {
    return queryInterface.removeColumn('tagquestions','userId')
  },
};

