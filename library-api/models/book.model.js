module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define("book", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    publishedDate: {
      type: DataTypes.DATE
    },
    authorId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  // 🔥 Ассоциация
  Book.associate = (models) => {
    Book.belongsTo(models.author, {
      foreignKey: "authorId",
      as: "author"
    });
  };

  return Book;
};



