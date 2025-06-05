const db = require("../models");
const Book = db.book;
const Author = db.author;

// Создать новую книгу
exports.create = async (req, res) => {
  try {
    const { title, authorId, publishedDate } = req.body;

    if (!title || !authorId) {
      return res.status(400).send({ message: "Title и authorId обязательны!" });
    }

    const book = await Book.create({ title, authorId, publishedDate });
    res.status(201).send(book);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Получить список всех книг
exports.findAll = async (req, res) => {
  try {
    const books = await Book.findAll({ include: ["author"] });
    res.send(books);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Получить одну книгу по ID
exports.findOne = async (req, res) => {
  try {
    const id = req.params.id;
    const book = await Book.findByPk(id, { include: ["author"] });

    if (!book) {
      return res.status(404).send({ message: "Книга не найдена" });
    }

    res.send(book);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Обновить книгу по ID
exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const [updated] = await Book.update(req.body, { where: { id } });

    if (updated) {
      const updatedBook = await Book.findByPk(id);
      return res.send(updatedBook);
    }

    res.status(404).send({ message: "Книга не найдена" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Удалить книгу по ID
exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await Book.destroy({ where: { id } });

    if (deleted) {
      return res.send({ message: "Книга удалена" });
    }

    res.status(404).send({ message: "Книга не найдена" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
