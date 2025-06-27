Склонируйте репозиторий.

Создайте .env файлы в apps/web и apps/api.

DATABASE_URL="postgresql://postgres:mysecretpassword@localhost:5432/challenge_1.0?schema=public"
JWT_SECRET=""
JWT_REFRESH_SECRET=""

API_URL = 'http://localhost:3000'

Запустите проект:

bash
docker-compose up --build
Откройте:

Frontend: http://localhost:3000