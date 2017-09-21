module.exports = function definequestion(sequelize, DataTypes) {
  const question = sequelize.define('question', {
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
  question.associate = function associate(models) {
    // associations can be defined here
    question.belongsTo(models.user);
  };
  return question;
};