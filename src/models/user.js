// const bcrypt = require('bcrypt')

async function buildPasswordHash(instance){
  if (instance.changed('password')){
    console.log('Cambiando password antes de hashing')
    const hash = await bcrypt.hash(instance.password, 10)
    instance.set('password', hash)
    console.log('Cambiando password luego de hashing')
  }
}

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

  //
  User.beforeCreate(buildPasswordHash);
  User.beforeUpdate(buildPasswordHash);
  //

  //
  User.prototype.checkPassword = function checkPassword(password){
    return bcrypt.compare(password, this.password)
  }
  //


  User.associate = function associate(models) {
  	User.hasMany(models.question);
    User.hasMany(models.answer);
    User.hasMany(models.comment);
    User.hasMany(models.tagquestion);
    User.hasMany(models.report);
    User.hasMany(models.exam);
    User.hasMany(models.tagexam);
  };
  return User;
};
