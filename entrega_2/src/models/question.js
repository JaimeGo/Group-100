module.exports = function definequestion(sequelize, DataTypes) {
  const question = sequelize.define('question', {
    title: DataTypes.STRING,
    body: DataTypes.TEXT,
    userId: DataTypes.INTEGER,
  });
  question.associate = function associate(models) {
    // associations can be defined here
    question.belongsTo(models.user);
  };
  return question;
};