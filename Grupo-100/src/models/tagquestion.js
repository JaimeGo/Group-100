module.exports = function definetagquestion(sequelize, DataTypes) {
  const tagquestion = sequelize.define('tagquestion', {
    questionId: DataTypes.INTEGER,
    tagId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  });
  tagquestion.associate = function associate(models) {
   	tagquestion.belongsTo(models.question);
    tagquestion.belongsTo(models.tag);
    tagquestion.belongsTo(models.user)
    // associations can be defined here
  };
  return tagquestion;
};