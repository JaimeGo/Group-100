const faker = require('faker');

module.exports = {
  up(queryInterface) {
    const usersData = [];
    for (let i = 0; i < 20; i += 1) {
      usersData.push({
        name: faker.company.companyName(),
        password: faker.lorem.words(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    return queryInterface.bulkInsert('users', usersData);
  },

  down(queryInterface) {
    return queryInterface.bulkDelete('users', null, {});
  },
};