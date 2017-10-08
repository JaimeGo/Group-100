module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('ongs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      logo: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.TEXT,
      },
      webpage: {
        type: Sequelize.STRING,
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

  down(queryInterface) {
    return queryInterface.dropTable('ongs');
  },
};
