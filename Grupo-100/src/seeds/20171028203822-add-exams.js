const faker = require('faker');

module.exports = {
    async up(queryInterface) {
      const userIds = (await queryInterface.select(null, 'users', { attributes: ['id'] }))
        .map(user => user.id);
      const examsBulkInsertPromises = userIds.map((userId) => {
        const quantity = faker.random.number({ min: 1, max: 3 });
        const examsData = [];
        for (let i = 0; i < quantity; i += 1) {
          examsData.push({
            userId,
            name: faker.lorem.word(),
            votes_sum: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
        return queryInterface.bulkInsert('exams', examsData);
      });
      return Promise.all(examsBulkInsertPromises);
    },

  down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('exams', null, {});
  },
};
