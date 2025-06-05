const { Sequelize, DataTypes } = require("sequelize");
const config = require("../config/db.config.js");

const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    port: config.PORT,
    dialect: config.dialect,
    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// подключаем модели
db.book = require("./book.model.js")(sequelize, DataTypes);
db.author = require("./author.model.js")(sequelize, DataTypes);

// связи
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.book.belongsTo(db.author, { foreignKey: "authorId" });
db.author.hasMany(db.book, { foreignKey: "authorId" });

module.exports = db;






