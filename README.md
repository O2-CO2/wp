# WPPR Frontend

Интерфейс для авторизации через miniOrange JWT и управления WordPress-публикациями (просмотр, создание, редактирование, удаление).

## Технологии

- React 19 + Vite 8
- React Router
- TanStack Query
- Zustand
- Axios

## Локальный запуск

1. Установите зависимости:

```bash
npm install
```

2. Создайте `.env` на основе `.env.example`:

```bash
cp .env.example .env
```

3. Укажите URL WordPress REST API:

```env
VITE_API_URL=https://your-wordpress-domain.com/wp-json
```

Важно: для сайта, открытого по HTTPS, `VITE_API_URL` тоже должен быть HTTPS, иначе браузер заблокирует запросы как Mixed Content.

4. Запустите проект:

```bash
npm run dev
```

## Продакшн сборка

Проверка качества перед релизом:

```bash
npm run check
```

Ручные команды:

```bash
npm run lint
npm run build
npm run preview
```

## Что должно быть настроено на WordPress

- Включен miniOrange JWT Authentication for WP REST APIs.
- Рабочий endpoint получения токена: `/wp-json/api/v1/token`.
- Рабочий endpoint проверки токена: `/wp-json/api/v1/token-validate`.
- Разрешен заголовок `Authorization: Bearer <token>` (сервер не должен удалять его).
- Пользователь имеет права на операции с постами, если нужен CRUD.

## Поведение в продакшне

- В dev запросы идут через Vite proxy (`/wp-json`).
- В prod используется `VITE_API_URL`.
- Если `VITE_API_URL` не задан, приложение использует same-origin fallback `/wp-json`.
- При `401` (кроме запроса логина) токен очищается из localStorage.

## Чеклист релиза

- [ ] `.env` заполнен корректным `VITE_API_URL`
- [ ] `npm run check` проходит без ошибок
- [ ] Успешный сценарий: вход -> список -> создание -> редактирование -> удаление -> выход
- [ ] В Network нет CORS/401 ошибок на защищенных запросах
# wp
# wp
# wp
# wp
# wp
# wp
