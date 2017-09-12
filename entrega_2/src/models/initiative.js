module.exports = function defineinitiative(sequelize, DataTypes) {
  const initiative = sequelize.define('initiative', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    image: DataTypes.STRING,
    active: DataTypes.BOOLEAN,
    hashtag: DataTypes.STRING,
  });
  initiative.associate = function associate(models) {
    initiative.belongsTo(models.ong);
  };
  return initiative;
};
