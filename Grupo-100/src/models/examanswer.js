module.exports = function defineExamAnswer(sequelize, DataTypes) {
  const ExamAnswer = sequelize.define('examanswer', {
    body: DataTypes.TEXT,
  });
  ExamAnswer.associate = function associate(models) {
    // associations can be defined here

    ExamAnswer.belongsTo(models.examquestion);
  };
  return ExamAnswer;
};