module.exports = function defineAnswer(sequelize, DataTypes) {
  const Answer = sequelize.define('Answer', {
    title: DataTypes.STRING,
    body: DataTypes.STRING,
  });
  Answer.associate = function associate(models) {
    // associations can be defined here
    Answer.belongsTo(models.User);
    Answer.belongsTo(models.Question);
    Answer.hasMany(models.Comment);
  };
  return Answer;
};