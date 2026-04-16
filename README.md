# ⚙️ GetCourse API

> **All-in-one пакет для нового и старого API**

[![npm version](https://img.shields.io/npm/v/getcourse-api)](https://www.npmjs.com/package/getcourse-api)
[![license](https://img.shields.io/github/license/NiktarioN/getcourse-api)](LICENSE)

Официальная документация:

- [GetCourse API](https://getcourse.ru/pl/postback/redoc)
- [GetCourse Legacy API](https://getcourse.ru/help/api)

---

## Основная идея

GetCourse предоставляет два API: новое и старое. Оба этих API независимы друг от друга, не имеют типизацию и неудобны в использовании

Мне, как разработчику, захотелось создать пакет, который объединяет оба API в одном SDK с полной TypeScript-типизацией и с понятным неймингом методов, который был в Chatium SDK

Теперь не нужно вручную разбираться в документации, формировать HTTP-запросы и описывать типы. Просто добавь воды (вызывай методы) и работай

Пакет покрывает все актуальные эндпоинты: работу с пользователями, заказами, предложениями, уроками, вебинарами, диалогами и экспорт данных

Приятной работы, коллеги 😉

---

## Установка

```bash
npm install getcourse-api
```

## Быстрый старт

```ts
import GetCourse from "getcourse-api";

const gc = new GetCourse({
  devKey: "XXXXXXXX", // Ключ разработчика
  apiKey: "YYYYYYYYYYYYYYY", // Ключ API школы
  domain: "test.getcourse.ru", // Подойдет технический или любой подключенный домен к аккаунту
});

// Получить данные пользователя
const user = await gc.getUserFields({ userId: 123 });
console.log(user.data[0]?.first_name);

// Получить заказы пользователя
const deals = await gc.getUserDeals({ email: "user@mail.ru" });

// Получить данные заказа
const deal = await gc.getDealFields(12345);
```

## Получение токена

- **Ключ разработчика** — после заполнения [анкеты](https://getcourse.ru/issuedeveloperkey)
- **Ключ API школы** — выдаётся в каждой школе отдельно. Должны быть права на чтение и запись

## Конфигурация

| Параметр   | Тип                              | Обязательный | По умолчанию | Описание                                  |
| ---------- | -------------------------------- | ------------ | ------------ | ----------------------------------------- |
| `devKey`   | `string`                         | да           | —            | Ключ разработчика                         |
| `apiKey`   | `string`                         | да           | —            | Ключ API школы                            |
| `domain`   | `string`                         | да           | —            | Домен школы, например `test.getcourse.ru` |
| `timeout`  | `number`                         | нет          | `15000`      | Таймаут запросов в мс                     |
| `logLevel` | `'silent' \| 'error' \| 'debug'` | нет          | `'silent'`   | Уровень встроенного логгера               |
| `logger`   | `Logger`                         | нет          | —            | Кастомный логгер (winston, pino и др.)    |

```ts
const gc = new GetCourse({
  devKey: "XXXXXXXX",
  apiKey: "YYYYYYYYYYYYYYY",
  domain: "test.getcourse.ru",
  timeout: 10_000,
  logLevel: "debug",
});
```

### Кастомный логгер (winston, pino)

```ts
import winston from "winston";
import GetCourse from "getcourse-api";

const logger = winston.createLogger({
  /* ... */
});

const gc = new GetCourse({
  devKey: "XXXXXXXX",
  apiKey: "YYYYYYYYYYYYYYY",
  domain: "test.getcourse.ru",
  logger, // Совместим с интерфейсом Logger
});
```

## Обработка ошибок

Все методы бросают исключения — используй `try/catch`:

```ts
try {
  const deal = await gc.getDealFields(99999);
} catch (err) {
  console.error(err.message); // Текст ошибки
  console.error(err.statusCode); // HTTP статус: 400, 403, 404...
  console.error(err.apiCode); // Код ошибки из тела ответа
  console.error(err.errors); // string[] — список ошибок валидации
}
```

## Справочник методов

### Вебхуки

| Метод          | Описание                             |
| -------------- | ------------------------------------ |
| `setUri(body)` | Установить URI для получения событий |

```ts
await gc.setUri({
  uri: "https://myapp.ru/webhook",
  event_object_id: 2, // Deal
  event_id: 3, // DealPaid
});
```

---

### Общее

| Метод                      | Описание                              |
| -------------------------- | ------------------------------------- |
| `getAllGroups()`           | Получить все группы пользователей     |
| `getAllPersonalManagers()` | Получить всех персональных менеджеров |
| `getTrainings()`           | Получить все тренинги                 |

---

### Заказы

| Метод                         | Описание                       |
| ----------------------------- | ------------------------------ |
| `getDealFields(dealId)`       | Получить поля заказа           |
| `getDealCustomFields(dealId)` | Получить кастомные поля заказа |
| `getDealComments(dealId)`     | Получить комментарии заказа    |
| `getDealCalls(dealId)`        | Получить звонки по заказу      |
| `getDealCancelReasons()`      | Получить причины отмены        |
| `getDealsTags(params?)`       | Получить заказы с тегами       |
| `addCommentToDeal(body)`      | Добавить комментарий к заказу  |
| `addDealPositions(body)`      | Добавить позиции в заказ       |
| `removeDealPositions(body)`   | Удалить позиции из заказа      |
| `updateDealFields(body)`      | Обновить поля заказа           |

```ts
// Получить заказ
const deal = await gc.getDealFields(12345);

// Обновить статус заказа
await gc.updateDealFields({
  dealId: 12345,
  status: "cancelled",
  cancel_reason_comment: "Клиент передумал",
});

// Добавить позиции
await gc.addDealPositions({
  dealId: 12345,
  positions: [{ offerId: 1, price: 1000, quantity: 2 }, { offerId: 3 }],
});
```

---

### Диалоги

| Метод                      | Описание                      |
| -------------------------- | ----------------------------- |
| `getDialogHistory(body)`   | Получить историю диалога      |
| `addCommentToDialog(body)` | Добавить комментарий в диалог |
| `changeDepartment(body)`   | Изменить отдел диалога        |
| `closeDialog(body)`        | Закрыть диалог                |

---

### Уроки

| Метод                            | Описание                      |
| -------------------------------- | ----------------------------- |
| `getLessonAnswers(lessonId?)`    | Получить ответы на урок       |
| `addCommentToLessonAnswer(body)` | Добавить комментарий к ответу |
| `changeStatusAnswers(body)`      | Изменить статус ответа        |

---

### Заметки

| Метод           | Описание                   |
| --------------- | -------------------------- |
| `addNote(body)` | Добавить заметку к диалогу |

---

### Предложения

| Метод                    | Описание                      |
| ------------------------ | ----------------------------- |
| `getOffers()`            | Получить все предложения      |
| `getOfferById(offerId)`  | Получить предложение по ID    |
| `getOffersTags(params?)` | Получить предложения с тегами |

---

### Пользователи

| Метод                             | Описание                     |
| --------------------------------- | ---------------------------- |
| `getUserFields(params)`           | Получить поля пользователя   |
| `getUserCustomFields(params)`     | Получить кастомные поля      |
| `getUserDeals(params)`            | Получить заказы пользователя |
| `getUserDiplomas(params)`         | Получить дипломы             |
| `getUserGroups(params)`           | Получить группы              |
| `getUserBalance(params)`          | Получить баланс              |
| `getUserPurchases(params)`        | Получить покупки             |
| `getUserTrainings(params)`        | Получить тренинги            |
| `getUserSchedule(params)`         | Получить расписание          |
| `getUserGoalRecords(params)`      | Получить записи целей        |
| `getUserAnswers(params)`          | Получить ответы              |
| `getUserLessonAnswers(params)`    | Получить ответы на уроки     |
| `getUserByTelegramChatId(chatId)` | Найти по Telegram Chat ID    |
| `addUserBalance(body)`            | Добавить баланс              |
| `addUserGroups(body)`             | Добавить в группы            |
| `removeUserGroups(body)`          | Удалить из групп             |
| `setUserGroups(body)`             | Установить группы            |
| `setPersonalManager(body)`        | Установить менеджера         |
| `updateUserFields(body)`          | Обновить поля пользователя   |
| `updateUserCustomFields(body)`    | Обновить кастомные поля      |
| `createDiploma(body)`             | Создать диплом               |

```ts
// Поиск по userId или email
const user = await gc.getUserFields({ userId: 123 });
const user2 = await gc.getUserFields({ email: "user@mail.ru" });

// Получить баланс
const balance = await gc.getUserBalance({ userId: 123, type: "virtual" });

// Добавить баланс
await gc.addUserBalance({
  userId: 123,
  value: 500,
  type: "virtual",
  comment: "Бонус за активность",
});

// Обновить поля
await gc.updateUserFields({
  userId: 123,
  first_name: "Иван",
  last_name: "Иванов",
  phone: "+79991234567",
});
```

---

### Вебинары

| Метод                          | Описание                            |
| ------------------------------ | ----------------------------------- |
| `getAllWebinars()`             | Получить все вебинары               |
| `getWebinarsByIds(body)`       | Получить вебинары по ID             |
| `addCommentToWebinar(body)`    | Добавить комментарий в чат вебинара |
| `moderateWebinarComment(body)` | Модерация сообщения в чате вебинара |
| `moderateWebinarUser(body)`    | Модерация пользователя вебинара     |

---

### Старое API (Legacy API)

> Используй эти методы для задач, которых нет в новом API: создание пользователей/сделок и массовый экспорт данных
>
> **Лимит Export API:** 100 запросов за 2 часа

#### Импорт

| Метод                | Описание                          |
| -------------------- | --------------------------------- |
| `addUser(params)`    | Создать или обновить пользователя |
| `createDeal(params)` | Создать сделку                    |

```ts
// Создать пользователя
await gc.addUser({
  user: { email: "user@mail.ru", first_name: "Иван" },
  system: { refresh_if_exists: 1 },
});

// Создать сделку (вариант 1: по offer_code)
await gc.createDeal({
  user: { email: "user@mail.ru" },
  deal: { offer_code: "offer123", deal_cost: "1990" },
});

// Создать сделку (вариант 2: по offer_id)
await gc.createDeal({
  user: { email: "user@mail.ru" },
  deal: { offer_id: "42" },
});
```

#### Экспорт

Методы экспорта запускают асинхронный процесс на сервере и автоматически ждут результата

| Метод                                           | Описание                                |
| ----------------------------------------------- | --------------------------------------- |
| `exportUsers(filters?, polling?)`               | Экспорт пользователей                   |
| `exportGroupUsers(groupId, filters?, polling?)` | Экспорт пользователей группы            |
| `exportDeals(filters?, polling?)`               | Экспорт сделок                          |
| `exportPayments(filters?, polling?)`            | Экспорт платежей                        |
| `getCustomFields()`                             | Дополнительные поля аккаунта            |
| `getExportResult(exportId)`                     | Результат экспорта по ID (ручной режим) |

```ts
// Экспорт всех пользователей
const users = await gc.exportUsers();

// Экспорт с фильтрами
const activeUsers = await gc.exportUsers({ status: "active" });

// Экспорт пользователей группы
const groupUsers = await gc.exportGroupUsers(12345);

// Экспорт сделок за период
const deals = await gc.exportDeals({
  created_at: { from: "2026-01-01", to: "2026-03-31" },
});

// Настройка поллинга (интервал 5с, таймаут 5 мин)
const payments = await gc.exportPayments(
  { status: "accepted" },
  { pollInterval: 5_000, timeout: 300_000 },
);

// Ручное получение результата по ID
const result = await gc.getExportResult(456789);
```

---

## Тестирование

Все тесты интеграционные — работают с реальным проектом на GetCourse. Для запуска нужен файл `.env` с ключами API и тестовыми ID (пример в `.env.example`)

Тесты охватывают все методы, кроме установки вебхука

```bash
# Все тесты
npm run test

# Только экспорт (медленно — тратит лимит API: 100 запросов за 2 часа)
npm run test:export

# Можно запускать тесты на отдельных файлах
npx vitest run tests/user.test.ts
```

---

## 🤓 Автор

### NiktarioN

- GitHub: [github.com/NiktarioN](https://github.com/NiktarioN)
- Telegram: [NiktarioN](https://t.me/niktarion_channels)
- Telegram-чат: [Присоединяйся](https://t.me/+dwbz2Ksle485YmVi)

---

Если проект полезен — поставь ⭐️ на [GitHub](https://github.com/NiktarioN/getcourse-api)

---

## Лицензия

MIT
