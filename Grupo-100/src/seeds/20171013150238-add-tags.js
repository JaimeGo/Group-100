const faker = require('faker');

module.exports = {
  // async up(queryInterface) {
  //   const userIds = (await queryInterface.select(null, 'users', { attributes: ['id'] }))
  //     .map(user => user.id);
  //   const questionsBulkInsertPromises = userIds.map((userId) => {
  //     const quantity = faker.random.number({ min: 1, max: 3 });
  //     const questionsData = [];
  //     for (let i = 0; i < quantity; i += 1) {
  //       questionsData.push({
  //         userId,
  //         title: faker.lorem.sentence(),
  //         body: faker.lorem.sentences(10),
  //         createdAt: new Date(),
  //         updatedAt: new Date(),
  //       });
  //     }
  //     return queryInterface.bulkInsert('questions', questionsData);
  //   });
  //   return Promise.all(questionsBulkInsertPromises);
  // },

  up(queryInterface) {
    const tags_ = ['ICS1513', 'Módulo matemática'];
    const tagsData = [];
    for (let i = 0; i < 2; i += 1) {
      tagsData.push({
        name: tags_[i],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    return queryInterface.bulkInsert('tags', tagsData);
  },

  down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('tags', null, {});
  },
};
