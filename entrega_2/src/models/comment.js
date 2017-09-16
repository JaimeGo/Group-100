module.exports = function defineComment(sequelize, DataTypes) {
  const Comment = sequelize.define('Comment', {
    body: DataTypes.STRING,
  });
  Comment.associate = function associate(models) {
    // associations can be defined here
    Comment.belongsTo(models.User);
    Comment.belongsTo(models.Answer);
  };
  return Comment;
};