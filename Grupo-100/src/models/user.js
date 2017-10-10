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
    }, //ADDED
    admin: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }

  });
  User.associate = function associate(models) {
  	User.hasMany(models.question);
    User.hasMany(models.answer);
    User.hasMany(models.comment);
  };
  return User;
};