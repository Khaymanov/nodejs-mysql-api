const express = require('express');
const mysql = require('mysql2');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const app = express();
const port = 3000;

app.use(express.json());

// Настройки подключения к БД
const db = mysql.createConnection({
  host: 'db', // имя сервиса из docker-compose
  user: 'root',
  password: 'root', // проверь в docker-compose.yml
  database: 'library'
});

// Проверка соединения
db.connect(err => {
  if (err) {
    console.error('Ошибка подключения к БД:', err);
    return;
  }
  console.log('Успешное подключение к MySQL!');
});

// Swagger UI доступен по адресу http://localhost:3000/api-docs
/*const swaggerDocument = YAML.load('./api.yaml');*/
const swaggerDocument = YAML.load('./library-api/swagger/api.yaml');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Простой эндпоинт
app.get('/', (req, res) => {
  res.send('Приложение работает!');
});

// Запуск сервера
/*app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);*/

app.listen(port, '0.0.0.0', () => {
  console.log(`Сервер запущен на http://0.0.0.0:${port}`);
});


