module.exports = function defineComment(sequelize, DataTypes) {
  const Comment = sequelize.define('comment', {
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  });
  Comment.associate = function associate(models) {
    // associations can be defined here
    Comment.belongsTo(models.user);
    Comment.belongsTo(models.answer);
  };
  return Comment;
};