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


    // ADDED E4
    // qtQuestionId: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    //   validate: {
    //     notEmpty: true,
    //   },
    // }, // changed


    userId: DataTypes.INTEGER,
  });
  Question.associate = function associate(models) {
    // associations can be defined here
    Question.belongsTo(models.user);
    Question.hasMany(models.answer);
    Question.hasMany(models.tagquestion);
    Question.hasMany(models.report);

    // Question.belongsToMany(models.tag, {
    //   as: 'qtQuestionId',
    //   through: 'questionTag',
    //   foreignKey: 'question_rowId'
    // });

    // Question.hasMany(models.tag, {
    //   through: 'questionTag',
    //   foreignKey: 'question_rowId'
    // })
  };
  return Question;
};