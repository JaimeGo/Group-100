module.exports = function defineExam(sequelize, DataTypes) {
  const Exam = sequelize.define('exam', {
    name: DataTypes.STRING,
  });
  Exam.associate = function associate(models) {
    // associations can be defined here

    Exam.hasMany(models.exammodule);
  };
  return Exam;
};