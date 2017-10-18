module.exports = function defineExamModule(sequelize, DataTypes) {
  const ExamModule = sequelize.define('exammodule', {
    name: DataTypes.STRING,
  });
  ExamModule.associate = function associate(models) {
    // associations can be defined here
    ExamModule.hasMany(models.examquestion);
    ExamModule.belongsTo(models.exam);

  };
  return ExamModule;
};