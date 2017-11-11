module.exports = {
  
  up(queryInterface, Sequelize) {
    return queryInterface.addColumn('exams','userId', 

      {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        }, // added
        onDelete: 'cascade', // added
      })

  },

  down(queryInterface) {
    return queryInterface.removeColumn('exams', 'userId')
  },
};