module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.addColumn('questions','votes_sum', 
      {
        type: Sequelize.INTEGER,
        
      })
  },

  down(queryInterface) {
    return queryInterface.removeColumn('questions', 'votes_sum')
  },
};
