module.exports = function defineUser(sequelize, DataTypes) {
  const User = sequelize.define('user', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      }
    }, //changed
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [6,100],
      }
    }, //changed
  });
  User.associate = function associate(models) {
  	User.hasMany(models.question);
  };
  return User;
};