module.exports = function definetag(sequelize, DataTypes) {
  const tag = sequelize.define('tag', {
    name: DataTypes.STRING,
  });
  tag.associate = function associate(models) {
  	tag.hasMany(models.question)
    // associations can be defined here
  };
  return tag;
};