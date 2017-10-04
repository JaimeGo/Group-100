const faker = require('faker');

module.exports = {
  async up(queryInterface) {
    const ongIds = (await queryInterface.select(null, 'ongs', { attributes: ['id'] }))
      .map(ong => ong.id);
    const initiativesBulkInsertPromises = ongIds.map((ongId) => {
      const quantity = faker.random.number({ min: 1, max: 20 });
      const initiativesData = [];
      for (let i = 0; i < quantity; i += 1) {
        initiativesData.push({
          ongId,
          title: faker.lorem.sentence(),
          description: faker.lorem.sentences(10),
          image: faker.image.imageUrl(),
          active: Math.random() < 0.8,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
      return queryInterface.bulkInsert('initiatives', initiativesData);
    });
    return Promise.all(initiativesBulkInsertPromises);
  },

  down(queryInterface) {
    return queryInterface.bulkDelete('initiatives', null, {});
  },
};
