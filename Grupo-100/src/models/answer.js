module.exports = function defineAnswer(sequelize, DataTypes) {
  const Answer = sequelize.define('answer', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    }, 
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  });
  Answer.associate = function associate(models) {
    // associations can be defined here
    Answer.belongsTo(models.user);
    Answer.belongsTo(models.question);
    Answer.hasMany(models.comment);
  };
  return Answer;
};