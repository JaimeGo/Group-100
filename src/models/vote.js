module.exports = function definevote(sequelize, DataTypes) {
  const vote = sequelize.define('vote', {
    userId: DataTypes.INTEGER,
    questionId: DataTypes.INTEGER,
    examId: DataTypes.INTEGER,
    fileId: DataTypes.INTEGER,
    isUpvote: DataTypes.BOOLEAN,
  });
  vote.associate = function associate(models) {
    vote.belongsTo(models.question)
    vote.belongsTo(models.exam)
    // associations can be defined here
  };
  return vote;
};