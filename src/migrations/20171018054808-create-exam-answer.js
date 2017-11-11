module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('examanswers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      body: {
        type: Sequelize.TEXT,
      },
      examQuestionId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'examquestions',
          key: 'id',
        }, // added
        onDelete: 'cascade', // added
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down(queryInterface, Sequelize) {
    return queryInterface.dropTable('examanswers');
  },
};