# ⚙️ GetCourse API

> **All in one пакет для нового и старого API**

[![npm version](https://img.shields.io/npm/v/getcourse-api)](https://www.npmjs.com/package/getcourse-api)
[![license](https://img.shields.io/github/license/NiktarioN/getcourse-api)](https://github.com/NiktarioN/getcourse-api/blob/master/LICENSE)

> **Обновляетесь с 1.x?** В 2.х есть глобальные изменения: переименованы методы, изменился импорт через `require`, поднялась минимальная версия Node. Что и на что менять — [заметках к релизу](https://github.com/NiktarioN/getcourse-api/releases/tag/v2.0.0)
>
> Перед обновлением до любой новой версии заглядывайте в [релизы](https://github.com/NiktarioN/getcourse-api/releases) — там описано, что изменилось

Официальная документация:

- [GetCourse API](https://getcourse.ru/pl/postback/redoc)
- [GetCourse Legacy API](https://getcourse.ru/help/api)

---

## 💡 Основная идея

GetCourse предоставляет два API: новое и старое. Оба этих API независимы друг от друга, не имеют типизацию и неудобны в использовании

Мне, как разработчику, захотелось создать пакет, который объединяет оба API в одном SDK с полной TypeScript-типизацией и с понятным неймингом методов, который был в Chatium SDK

Теперь не нужно вручную разбираться в документации, формировать HTTP-запросы и описывать типы. Просто добавь воды (вызывай методы) и работай

Пакет покрывает все актуальные эндпоинты: работу с пользователями, заказами, предложениями, уроками, вебинарами, диалогами и экспорт данных

Приятной работы, коллеги 😉

---

## 📦 Установка

```bash
npm install getcourse-api
```

Нужен `Node 22` или новее

## 🚀 Быстрый старт

```ts
import GetCourse from "getcourse-api";

const gc = new GetCourse({
  devKey: "XXXXXXXX", // Ключ разработчика
  apiKey: "YYYYYYYYYYYYYYY", // Ключ API школы
  domain: "test.getcourse.ru", // Подойдет технический или любой подключенный домен к аккаунту
});

// Получить данные пользователя
const userInfo = await gc.getUserInfo({ userId: 123 });

// Получить данные заказа
const dealInfo = await gc.getDealInfo(12345);
```

## 🔑 Получение токена

- **Ключ разработчика** — после заполнения [анкеты](https://getcourse.ru/issuedeveloperkey)
- **Ключ API школы** — выдаётся в каждой школе отдельно. Должны быть права на чтение и запись

## 🎛 Конфигурация

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

### 🪵 Кастомный логгер (winston, pino)

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

## 🚨 Обработка ошибок

Все методы бросают исключения — используй `try/catch`:

```ts
import { GetCourseApiError, GetCourseNetworkError, GetCourseValidationError } from "getcourse-api";

try {
  const deal = await gc.getDealInfo(99999);
} catch (err) {
  if (err instanceof GetCourseValidationError) {
    console.error(err.message); // Текст ошибки
    console.error(err.details); // Причина с машиночитаемым кодом

    return;
  }

  if (err instanceof GetCourseApiError) {
    console.error(err.message); // Текст ошибки
    console.error(err.statusCode); // HTTP статус: 400, 403, 404...
    console.error(err.apiCode); // Код ошибки из тела ответа
    console.error(err.errors); // string[] — список ошибок валидации

    return;
  }

  if (err instanceof GetCourseNetworkError) {
    console.error(err.message); // Таймаут, DNS, connection refused
    console.error(err.cause); // Исходная ошибка

    return;
  }

  throw err;
}
```

| Класс                      | Когда бросается                            | Дополнительные поля               |
| -------------------------- | ------------------------------------------ | --------------------------------- |
| `GetCourseError`           | базовый класс, наследник `Error`           | —                                 |
| `GetCourseValidationError` | данные не прошли проверку, запроса не было | `details` — причина с кодом       |
| `GetCourseApiError`        | сервер ответил ошибкой или `status: false` | `statusCode`, `apiCode`, `errors` |
| `GetCourseNetworkError`    | таймаут, DNS, connection refused           | `cause` — исходная ошибка         |

`GetCourseValidationError` отличается от остальных тем, что запрос к API вообще не выполнялся — данные не прошли проверку на стороне пакета. Разбирать причину по тексту не нужно, для этого есть `details` с кодом:

```ts
if (err instanceof GetCourseValidationError) {
  if (err.details.code === "attachments_limit") {
    // Файлов больше разрешённого: details.limit и details.received
  }

  if (err.details.code === "attachment_size") {
    // Файл больше лимита: details.filename, details.size и details.limit
  }
}
```

Чтобы поймать любую ошибку SDK разом, хватит базового класса:

```ts
import { GetCourseError } from "getcourse-api";

if (err instanceof GetCourseError) {
  // и ошибка проверки, и ошибка API, и сетевая
}
```

## 🧩 Типы

Всё, что встречается в сигнатурах методов, импортируется из корня пакета — отдельных путей вроде `getcourse-api/types` нет:

```ts
import type { CallWebhook, User } from "getcourse-api";

// Получить Telegram-ID пользователя
function getTelegramId(user: User): number | undefined {
  return user.bot_link.telegram[0]?.tg_user_id;
}

app.post("/gc/calls", (req, res) => {
  const call = req.body as CallWebhook;

  if (call.finish_status === "failed") {
    console.log("Недозвон:", call.failed_reason);
  }

  res.sendStatus(200);
});
```

В чистом JavaScript типы доступны через JSDoc:

```js
/** @param {import("getcourse-api").User} user */
function getTelegramId(user) {
  return user.bot_link.telegram[0]?.tg_user_id;
}
```

## 📚 Справочник методов

### 🔔 Вебхуки

| Метод                       | Описание               |
| --------------------------- | ---------------------- |
| `subscribeWebhook(body)`    | Подписаться на событие |
| `unsubscribeWebhook(event)` | Отписаться от события  |

| Объект события        | `event_object_id` | `event_id`                                                                                     |
| --------------------- | ----------------- | ---------------------------------------------------------------------------------------------- |
| Входящие сообщения    | 1                 | 1 — новый диалог, 2 — переоткрыт диалог, 3 — сообщение от ученика, 4 — сообщение от сотрудника |
| Заказы                | 2                 | 1 — создан, 2 — смена статуса, 3 — оплачен                                                     |
| Комментарии к урокам  | 4                 | 1 — добавлен ответ на урок                                                                     |
| Комментарии к ответам | 5                 | 1 — добавлен комментарий к ответу                                                              |
| Комментарии вебинаров | 7                 | 1 — новый комментарий от зрителя                                                               |
| Звонки                | 8                 | 1 — новый звонок                                                                               |
| HelpDesk              | 9                 | 1 — новый тикет, 2 — сообщение от клиента, 3 — сообщение от сотрудника                         |

```ts
await gc.subscribeWebhook({
  uri: "https://example.com/webhook",
  event_object_id: 2,
  event_id: 3,
});

await gc.unsubscribeWebhook({
  uri: "https://example.com/webhook",
  event_object_id: 2,
  event_id: 3,
});
```

Здесь собраны примеры тел вебхуков, которые прилетают на подписанный URI: [examples/webhooks](https://github.com/NiktarioN/getcourse-api/tree/master/examples/webhooks)

---

### 🏫 Общее

| Метод                      | Описание                              |
| -------------------------- | ------------------------------------- |
| `getGroups()`              | Получить все группы пользователей     |
| `getPersonalManagers()`    | Получить всех персональных менеджеров |
| `getTrainings()`           | Получить все тренинги                 |
| `getDepartments()`         | Получить все отделы                   |
| `getSurveyAnswers(params)` | Получить ответы анкеты                |

---

### 🧾 Заказы

| Метод                          | Описание                            |
| ------------------------------ | ----------------------------------- |
| `getDealInfo(dealId)`          | Получить информацию по заказу       |
| `getDealCustomFields(dealId)`  | Получить дополнительные поля заказа |
| `getDealComments(dealId)`      | Получить комментарии заказа         |
| `getDealCalls(dealId)`         | Получить звонки по заказу           |
| `getDealCancelReasons()`       | Получить причины отмены заказовы    |
| `getDealsWithTags(params?)`    | Получить заказы с тегами            |
| `addDealComment(body)`         | Добавить комментарий заказу         |
| `addDealPositions(body)`       | Добавить позиции в заказ            |
| `removeDealPositions(body)`    | Удалить позиции из заказа           |
| `updateDealInfo(body)`         | Обновить информацию по заказу       |
| `updateDealCustomFields(body)` | Обновить дополнительные поля заказа |

```ts
// Получить информацию по заказу
const dealInfo = await gc.getDealInfo(12345);

// Обновить статус заказа
await gc.updateDealInfo({
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

### 📞 Звонки

| Метод                        | Описание                                 |
| ---------------------------- | ---------------------------------------- |
| `addCallComment(body)`       | Добавить комментарий (в поле «Описание») |
| `addCallTranscription(body)` | Добавить транскрибацию звонка            |

```ts
await gc.addCallComment({
  callId: 8421,
  text: "Клиент просил перезвонить в пятницу",
});

await gc.addCallTranscription({
  callId: 8421,
  text: "<p>— Здравствуйте! Вам удобно говорить?</p><p>— Да, слушаю вас</p>",
});
```

У полей разный формат, и переносы строк в них делаются по-разному:

| Поле                        | Формат | Перенос строки                                 |
| --------------------------- | ------ | ---------------------------------------------- |
| «Описание» — `description`  | текст  | `\n`, `\r` или `\r\n` — работает любой         |
| «Транскрибация» — `comment` | HTML   | `<p>текст</p>` для абзаца, `<br>` для переноса |

Транскрибация отображается в школе как HTML, поэтому обычный `\n` сохранится и вернётся в ответе, но в интерфейсе схлопнется в пробел — разговор будет выглядеть сплошным абзацем:

```ts
const replicas = ["— Здравствуйте! Вам удобно говорить?", "— Да, слушаю вас"];

await gc.addCallTranscription({
  callId: 8421,
  text: replicas.map((line) => `<p>${line}</p>`).join(""),
});

// Короче и без map — реплики пойдут подряд, без абзацных отступов
await gc.addCallTranscription({ callId: 8421, text: replicas.join("<br />") });
```

Расшифровка попадает в разметку как есть, поэтому символы `<`, `>` и `&` в тексте нужно экранировать

Оба метода перезаписывают значение: повторный вызов заменяет текст, а не добавляет ещё один

У транскрибации есть недокументированный предел длины: на превышении API отвечает `500` с пустым `errors`, отличить это от падения сервера нельзя. Замеры по живому API — кириллица упирается около 4600 символов, латиница держит больше 60 000, текст пополам — около 8700. Для русского текста безопасный ориентир — **до 4000 символов**

---

### 💬 Диалоги (раздел «Входящие»)

| Метод                          | Описание                     |
| ------------------------------ | ---------------------------- |
| `getDialogHistory(body)`       | Получить историю диалога     |
| `sendDialogMessage(body)`      | Отправить сообщение в диалог |
| `startDialog(body)`            | Начать диалог с учеником     |
| `addDialogNote(body)`          | Добавить заметку             |
| `changeDialogDepartment(body)` | Изменить отдел диалога       |
| `closeDialog(body)`            | Закрыть диалог               |

Написать ученику первым — по ID ученика, а не по ID диалога

```ts
await gc.startDialog({
  recipientId: 251804773,
  commentText: "Здравствуйте! Ваш заказ готов",
  transport: [3],
  userId: 903417,
});
```

### 🔗 Вложения в сообщениях

К сообщению в диалоге или тикете можно приложить до 5 файлов, каждый до 5 МБ

```ts
import { readFile } from "node:fs/promises";

await gc.sendDialogMessage({
  dialogId: 48812,
  commentText: "Счёт во вложении",
  transport: [1],
  userId: 903417,
  attachedFiles: [{ filename: "Счёт №1024.pdf", content: await readFile("./invoice.pdf") }],
});
```

Файл принимается байтами — `Buffer`, `Uint8Array` или `Blob`

Что стоит знать:

- **Расширение в `filename` обязательно** — GetCourse определяет тип файла только по нему, MIME-тип запроса он игнорирует
- **Лимиты проверяются до отправки** — при шести файлах или файле больше 5 МБ пакет бросит `GetCourseValidationError`, не заливая файлы на сервер
- **Без вложений запрос не меняется** — уходит прежний JSON
- **Ссылки на вложения приходят с разных доменов** — часть файлов лежит на `fs.getcourse.ru`, часть на домене школы, причём вторые открываются только авторизованному пользователю. Разбирать URL по домену не стоит

---

### 🎫 HelpDesk

| Метод                          | Описание                    |
| ------------------------------ | --------------------------- |
| `getTicketHistory(body)`       | Получить историю тикета     |
| `sendTicketMessage(body)`      | Отправить сообщение в тикет |
| `addTicketNote(body)`          | Добавить заметку            |
| `changeTicketDepartment(body)` | Изменить отдел тикета       |
| `closeTicket(body)`            | Закрыть тикет               |

```ts
await gc.closeTicket({
  ticketId: 123,
  closedReason: 2,
  closedComment: "Вопрос решён",
});
```

HelpDesk работает по аналогии с обычными диалогами: те же транспорты, тот же формат истории. Причины закрытия — справочник `TicketCloseReason`

---

### 📘 Уроки

| Метод                            | Описание                      |
| -------------------------------- | ----------------------------- |
| `getLessonAnswers(lessonId?)`    | Получить ответы на урок       |
| `addLessonAnswerComment(body)`   | Добавить комментарий к ответу |
| `changeLessonAnswerStatus(body)` | Изменить статус ответа        |

---

### 🏷 Предложения

| Метод                        | Описание                      |
| ---------------------------- | ----------------------------- |
| `getOffers()`                | Получить все предложения      |
| `getOfferById(offerId)`      | Получить предложение по ID    |
| `getOffersWithTags(params?)` | Получить предложения с тегами |

---

### 👤 Пользователи

| Метод                             | Описание                            |
| --------------------------------- | ----------------------------------- |
| `getUserInfo(params)`             | Получить информацию по пользователю |
| `getUserCustomFields(params)`     | Получить дополнительные поля        |
| `getUserDeals(params)`            | Получить заказы пользователя        |
| `getUserDiplomas(params)`         | Получить дипломы                    |
| `getUserGroups(params)`           | Получить группы                     |
| `getUserBalance(params)`          | Получить баланс                     |
| `getUserPurchases(params)`        | Получить покупки                    |
| `getUserTrainings(params)`        | Получить тренинги                   |
| `getUserSchedule(params)`         | Получить расписание                 |
| `getUserGoalRecords(params)`      | Получить записи целей               |
| `getUserSurveyAnswers(params)`    | Получить ответы на анкеты           |
| `getUserLessonAnswers(params)`    | Получить ответы на уроки            |
| `getUserDialogs(params)`          | Получить диалоги из Входящих        |
| `getUserTickets(params)`          | Получить тикеты HelpDesk            |
| `getUserByTelegramChatId(chatId)` | Найти по Telegram Chat ID           |
| `getUserByChatId(params)`         | Найти по chat ID мессенджера        |
| `addUserBalance(body)`            | Пополнить баланс                    |
| `addUserComment(body)`            | Добавить комментарий пользователю   |
| `addUserGroups(body)`             | Добавить в группы                   |
| `removeUserGroups(body)`          | Удалить из групп                    |
| `setUserGroups(body)`             | Установить группы                   |
| `setPersonalManager(body)`        | Закрепить персонального менеджера   |
| `updateUserInfo(body)`            | Обновить информацию по пользователю |
| `updateUserCustomFields(body)`    | Обновить дополнительные поля        |
| `createDiploma(body)`             | Выдать диплом                       |

### 🔍 Поиск пользователя

По `userId` или `email` метод возвращает одного пользователя, по телефону — словарь `{ [userId]: User }`: один номер может принадлежать нескольким

```ts
const userInfo = await gc.getUserInfo({ userId: 251804773 });

const usersByPhone = await gc.getUserInfo({ phone: "+70000000000" });
const emails = Object.values(usersByPhone.data).map((person) => person.email);
```

Если совпадений нет ни по одному из способов поиска — метод бросает `GetCourseApiError`, а не возвращает пустой результат

Поиск по chat ID мессенджера — Telegram, VK или MAX (всегда возвращает одного пользователя)

```ts
const userInfo = await gc.getUserByChatId({
  messengerType: "tg",
  chatId: 118472905,
});
```

```ts
// Получить баланс
const userBalance = await gc.getUserBalance({ userId: 123, type: "virtual" });

// Добавить баланс
await gc.addUserBalance({
  userId: 123,
  value: 500,
  type: "virtual",
  comment: "Бонус за активность",
});

// Добавить комментарий пользователю (userId — адресат, authorId — автор)
await gc.addUserComment({
  userId: 123,
  authorId: 456,
  text: "Тестовый комментарий в ленту пользователя",
});

// Обновить информацию
await gc.updateUserInfo({
  userId: 123,
  first_name: "Иван",
  last_name: "Иванов",
  phone: "+70000000001",
});
```

---

### 🎥 Вебинары

| Метод                          | Описание                            |
| ------------------------------ | ----------------------------------- |
| `getWebinars()`                | Получить все вебинары               |
| `getWebinarsByIds(body)`       | Получить вебинары по ID             |
| `sendWebinarMessage(body)`     | Отправить сообщение в чат вебинара  |
| `moderateWebinarMessage(body)` | Модерация сообщения в чате вебинара |
| `moderateWebinarUser(body)`    | Модерация пользователя вебинара     |

---

### 👴🏻 Старое API (Legacy API)

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
  user: { email: "test@example.com", first_name: "Иван" },
  system: { refresh_if_exists: 1 },
});

// Создать сделку (вариант 1: по offer_code)
await gc.createDeal({
  user: { email: "test@example.com" },
  deal: { offer_code: "offer123", deal_cost: "1990" },
});

// Создать сделку (вариант 2: по offer_id)
await gc.createDeal({
  user: { email: "test@example.com" },
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

## 🧪 Тестирование

Тесты в `tests/api` работают с реальным проектом на GetCourse. Для запуска нужен файл `.env` с ключами API и тестовыми ID (пример в `.env.example`)

Тесты охватывают все методы

```bash
# Все тесты
npm run test

# Только экспорт (медленно — тратит лимит API: 100 запросов за 2 часа)
npm run test:export

# Запуск тестов отдельного файла
npm run test -- tests/api/user.test.ts

# Запуск конкретного теста в файле по имени
npm run test -- tests/api/user.test.ts -t "getUserInfo"

# Подписка на все события вебхуков и отписка от всех
npm run test -- tests/api/webhooks/subscribe.test.ts
npm run test -- tests/api/webhooks/unsubscribe.test.ts

# Точечно, по названиям или номерам событий
npm run test -- tests/api/webhooks/subscribe.test.ts -t "1,1"
npm run test -- tests/api/webhooks/unsubscribe.test.ts -t "1,1"
npm run test -- tests/api/webhooks/subscribe.test.ts -t "Заказ оплачен: 2,3"
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

## 📄 Лицензия

MIT
