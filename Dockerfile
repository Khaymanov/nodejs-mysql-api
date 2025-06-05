FROM node:18

WORKDIR /app

# Устанавливаем netcat
RUN apt-get update && apt-get install -y netcat-openbsd && rm -rf /var/lib/apt/lists/*

# Копируем зависимости и устанавливаем
COPY library-api/package*.json ./
RUN npm install

# Копируем весь код
COPY library-api ./

# Копируем wait-for.sh из корня проекта
COPY library-api/wait-for.sh ./wait-for.sh
RUN chmod +x ./wait-for.sh

# Запуск через wait-for.sh
CMD ["sh", "-c", "./wait-for.sh db:3306 -- npm start"]








