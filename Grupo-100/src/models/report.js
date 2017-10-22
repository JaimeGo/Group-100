module.exports = function definereport(sequelize, DataTypes) {
  const report = sequelize.define('report', {
    questionId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    reason: DataTypes.TEXT,
  });
  report.associate = function associate(models) {
  	report.belongsTo(models.user);
  	report.belongsTo(models.question);
    // associations can be defined here
  };
  return report;
};