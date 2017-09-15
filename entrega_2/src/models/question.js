module.exports = function defineQuestion(sequelize, DataTypes) {
  const Question = sequelize.define('Question', {
    title: DataTypes.STRING,
    body: DataTypes.TEXT,
    userId: DataTypes.INTEGER,
  });
  Question.associate = function associate(models) {
    // associations can be defined here
  };
  return Question;
};