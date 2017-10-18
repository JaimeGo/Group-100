module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('examquestions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      body: {
        type: Sequelize.TEXT,
      },
      examModuleId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'exammodules',
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
    return queryInterface.dropTable('examquestions');
  },
};