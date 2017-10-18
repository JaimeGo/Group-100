module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('exammodules', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },
      examId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'exams',
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
    return queryInterface.dropTable('exammodules');
  },
};