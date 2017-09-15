module.exports = function defineUser(sequelize, DataTypes) {
  const User = sequelize.define('user', {
    name: DataTypes.STRING,
    password: DataTypes.STRING,
  });
  User.associate = function associate(models) {
  	User.hasMany(models.question);
  };
  return User;
};