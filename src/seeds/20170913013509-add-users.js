const faker = require('faker');

module.exports = {
  up(queryInterface) {
    const usersData = [];
    usersData.push({
      name: "administrador",
      password: "admini",
      admin: true,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    usersData.push({
      name: "normal",
      password: "normal",
      admin: false,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    for (let i = 0; i < 20; i += 1) {
      admin_ = false;
      if (i == 0) { admin_ = true };
      usersData.push({
        name: faker.company.companyName(),
        password: faker.lorem.words(),
        admin: admin_,
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