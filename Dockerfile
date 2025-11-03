FROM node:20-alpine

WORKDIR /app

# Копируем зависимости
COPY package*.json ./
RUN npm install

# Копируем весь проект
COPY . .

# Копируем .env внутрь контейнера
COPY .env .env

# Пробрасываем порт
EXPOSE 4001

# Запускаем приложение
CMD ["npm", "run", "start:dev"]