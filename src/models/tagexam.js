module.exports = function definetagexam(sequelize, DataTypes) {
  const tagexam = sequelize.define('tagexam', {
    userId: DataTypes.INTEGER,
    examId: DataTypes.INTEGER,
    tagId: DataTypes.INTEGER,
  });
  tagexam.associate = function associate(models) {
    // associations can be defined here
  };
  return tagexam;
};