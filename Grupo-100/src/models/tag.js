module.exports = function definetag(sequelize, DataTypes) {
  const tag = sequelize.define('tag', {
    name: DataTypes.STRING,
  });
  tag.associate = function associate(models) {
  	tag.hasMany(models.tagquestion)

  	// tag.belongsToMany(models.question, {
  	//   as: 'qtTagId',
   //    through: 'questionTag',
   //    foreignKey: 'tag_rowId'
  	// })

  	// tag.hasMany(models.question, {
  	// 	through: 'questionTag',
   // 		foreignKey: 'tag_rowId'
  	// })
    // associations can be defined here
  };
  return tag;
};