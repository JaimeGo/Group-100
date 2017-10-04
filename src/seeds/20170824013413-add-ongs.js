const faker = require('faker');

module.exports = {
  up(queryInterface) {
    const ongsData = [];
    for (let i = 0; i < 10; i += 1) {
      ongsData.push({
        name: faker.company.companyName(),
        logo: faker.image.business(),
        email: faker.internet.email(),
        description: faker.lorem.sentences(5),
        webpage: faker.internet.url(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    return queryInterface.bulkInsert('ongs', ongsData);
  },

  down(queryInterface) {
    return queryInterface.bulkDelete('ongs', null, {});
  },
};
