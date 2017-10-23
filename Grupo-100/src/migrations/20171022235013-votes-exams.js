module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.addColumn('exams','votes_sum', 
      {
        type: Sequelize.INTEGER,
        
      })
  },

  down(queryInterface) {
    return queryInterface.removeColumn('exams', 'votes_sum')
  },
};
