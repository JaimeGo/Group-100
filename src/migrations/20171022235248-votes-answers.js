module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.addColumn('answers','votes_sum', 
      {
        type: Sequelize.INTEGER,
        
      })
  },

  down(queryInterface) {
    return queryInterface.removeColumn('answers', 'votes_sum')
  },
};
