module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Author", {  // <-- название модели с большой буквы
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
};


