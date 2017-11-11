module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('votes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
      },
      questionId: {
        type: Sequelize.INTEGER,
      },
      examId: {
        type: Sequelize.INTEGER,
      },
      fileId: {
        type: Sequelize.INTEGER,
      },
      isUpvote: {
        type: Sequelize.BOOLEAN,
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
    return queryInterface.dropTable('votes');
  },
};