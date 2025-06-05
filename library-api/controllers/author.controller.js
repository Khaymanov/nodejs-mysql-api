const db = require("../models");
const Author = db.author;
const Book = db.book;

// Создать нового автора
// Создать одного или нескольких авторов
exports.create = async (req, res) => {
  try {
    const authors = Array.isArray(req.body) ? req.body : [req.body];

    // Проверим, что у каждого автора есть имя
    for (const author of authors) {
      if (!author.name) {
        return res.status(400).send({ message: "Name is required" });
      }
    }

    const createdAuthors = await Author.bulkCreate(authors);
    res.status(201).send(createdAuthors);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};


// Получить всех авторов
exports.findAll = async (req, res) => {
  try {
    const authors = await Author.findAll({ include: ["books"] });
    res.send(authors);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Получить одного автора по ID
exports.findOne = async (req, res) => {
  try {
    const id = req.params.id;
    const author = await Author.findByPk(id, { include: ["books"] });

    if (!author) {
      return res.status(404).send({ message: "Автор не найден" });
    }

    res.send(author);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Обновить автора по ID
exports.updateAuthor = async (req, res) => {
  try {
    const id = req.params.authorId;
    const [updated] = await Author.update(req.body, { where: { id } });

    if (updated) {
      const updatedAuthor = await Author.findByPk(id);
      return res.send(updatedAuthor);
    }

    res.status(404).send({ message: "Автор не найден" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Удалить автора по ID
exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await Author.destroy({ where: { id } });

    if (deleted) {
      return res.send({ message: "Автор удалён" });
    }

    res.status(404).send({ message: "Автор не найден" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
