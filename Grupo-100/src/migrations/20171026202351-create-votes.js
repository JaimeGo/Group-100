module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('vote', {
    });
  },
  down(queryInterface, Sequelize) {
    return queryInterface.dropTable('vote');
  },
};
