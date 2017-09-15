module.exports = function defineUser(sequelize, DataTypes) {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    password: DataTypes.STRING,
  });
  User.associate = function associate(models) {
  	User.hasMany(models.Question);
  };
  return User;
};