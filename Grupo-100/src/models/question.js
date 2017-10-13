module.exports = function definequestion(sequelize, DataTypes) {
  const Question = sequelize.define('question', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    }, // changed
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    }, // changed
    userId: DataTypes.INTEGER,
  });
  Question.associate = function associate(models) {
    // associations can be defined here
    Question.belongsTo(models.user);
    Question.hasMany(models.answer);
  };
  return Question;
};