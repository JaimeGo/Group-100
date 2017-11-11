module.exports = function definetag(sequelize, DataTypes) {
  const tag = sequelize.define('tag', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    }, // changed

    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  });
  tag.associate = function associate(models) {
  	tag.hasMany(models.tagquestion)
    tag.hasMany(models.tagexam)

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