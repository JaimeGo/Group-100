module.exports = function defineExam(sequelize, DataTypes) {
  const Exam = sequelize.define('exam', {
    name: {
	    type: DataTypes.STRING,
	      allowNull: false,
	      validate: {
	        notEmpty: true,
	    },
	},

  });
  Exam.associate = function associate(models) {
    // associations can be defined here

    Exam.hasMany(models.exammodule);
    Exam.belongsTo(models.user);
  };
  return Exam;
};