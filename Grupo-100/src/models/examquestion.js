module.exports = function defineExamQuestion(sequelize, DataTypes) {
  const ExamQuestion = sequelize.define('examquestion', {
    body: DataTypes.TEXT,
  });
  ExamQuestion.associate = function associate(models) {
    // associations can be defined here

    ExamQuestion.hasMany(models.examanswer);
    ExamQuestion.belongsTo(models.exammodule);
  };
  return ExamQuestion;
};