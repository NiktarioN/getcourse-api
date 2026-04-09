# getcourse-api

TypeScript SDK для [GetCourse API](https://getcourse.ru) (v1)
[Официальная и полная документация по API](https://getcourse.ru/pl/postback/redoc)

[![npm version](https://img.shields.io/npm/v/getcourse-api)](https://www.npmjs.com/package/getcourse-api)
[![license](https://img.shields.io/npm/l/getcourse-api)](LICENSE)

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
  domain: "test.getcourse.ru",
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

- **Ключ разработчика** — получить по [анкете на getcourse.ru](https://getcourse.ru/issuedeveloperkey)
- **Ключ API школы** — выдаётся представителями школы на платформе

## Конфигурация

| Параметр   | Тип                              | Обязательный | По умолчанию | Описание                                    |
| ---------- | -------------------------------- | ------------ | ------------ | ------------------------------------------- |
| `devKey`   | `string`                         | да           | —            | Ключ разработчика                           |
| `apiKey`   | `string`                         | да           | —            | Ключ API школы                              |
| `domain`   | `string`                         | да           | —            | Домен школы, например `school.getcourse.ru` |
| `timeout`  | `number`                         | нет          | `15000`      | Таймаут запросов в мс                       |
| `logLevel` | `'silent' \| 'error' \| 'debug'` | нет          | `'silent'`   | Уровень встроенного логгера                 |
| `logger`   | `Logger`                         | нет          | —            | Кастомный логгер (winston, pino и др.)      |

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
  logger, // совместим с интерфейсом Logger
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

### Webhooks

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

### School (общее)

| Метод                      | Описание                              |
| -------------------------- | ------------------------------------- |
| `getAllGroups()`           | Получить все группы пользователей     |
| `getAllPersonalManagers()` | Получить всех персональных менеджеров |
| `getTrainings()`           | Получить все тренинги                 |

---

### Deal (заказы)

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

### Dialog (диалоги)

| Метод                      | Описание                      |
| -------------------------- | ----------------------------- |
| `getDialogHistory(body)`   | Получить историю диалога      |
| `addCommentToDialog(body)` | Добавить комментарий в диалог |
| `changeDepartment(body)`   | Изменить отдел диалога        |
| `closeDialog(body)`        | Закрыть диалог                |

---

### Lesson (уроки)

| Метод                            | Описание                      |
| -------------------------------- | ----------------------------- |
| `getLessonAnswers(lessonId?)`    | Получить ответы на урок       |
| `addCommentToLessonAnswer(body)` | Добавить комментарий к ответу |
| `changeStatusAnswers(body)`      | Изменить статус ответа        |

---

### Note (заметки)

| Метод           | Описание                   |
| --------------- | -------------------------- |
| `addNote(body)` | Добавить заметку к диалогу |

---

### Offer (предложения)

| Метод                    | Описание                 |
| ------------------------ | ------------------------ |
| `getOffers()`            | Получить все офферы      |
| `getOfferById(offerId)`  | Получить оффер по ID     |
| `getOffersTags(params?)` | Получить офферы с тегами |

---

### User (пользователи)

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

### Webinar (вебинары)

| Метод                          | Описание                            |
| ------------------------------ | ----------------------------------- |
| `getAllWebinars()`             | Получить все вебинары               |
| `getWebinarsByIds(body)`       | Получить вебинары по ID             |
| `addCommentToWebinar(body)`    | Добавить комментарий в чат вебинара |
| `moderateWebinarComment(body)` | Модерация сообщения в чате вебинара |
| `moderateWebinarUser(body)`    | Модерация пользователя вебинара     |

---

## Требования

- Node.js >= 18.0.0

## Лицензия

MIT
