# Примеры payload вебхуков

Не меньше трёх примеров тела запроса на каждое событие GetCourse. В файле лежит массив — только то, что приходит на подписанный URI

## Входящие сообщения — `event_object_id: 1`

| `event_id` | Событие                 | Примеры                                          | Тип                            |
| ---------- | ----------------------- | ------------------------------------------------ | ------------------------------ |
| 1          | Создан новый диалог     | [created](dialog/created.json)                   | `DialogCreatedWebhook`         |
| 2          | Диалог переоткрыт       | [reopened](dialog/reopened.json)                 | `DialogReopenedWebhook`        |
| 3          | Сообщение от ученика    | [client-message](dialog/client-message.json)     | `DialogClientMessageWebhook`   |
| 4          | Сообщение от сотрудника | [employee-message](dialog/employee-message.json) | `DialogEmployeeMessageWebhook` |

## Заказы — `event_object_id: 2`

| `eventType`                   | Событие              | Примеры                                    | Тип                        |
| ----------------------------- | -------------------- | ------------------------------------------ | -------------------------- |
| `getcourse/dealCreated`       | Заказ создан         | [created](deal/created.json)               | `DealCreatedWebhook`       |
| `getcourse/dealPaid`          | Заказ оплачен        | [paid](deal/paid.json)                     | `DealPaidWebhook`          |
| `getcourse/dealStatusChanged` | Смена статуса заказа | [status-changed](deal/status-changed.json) | `DealStatusChangedWebhook` |

События заказа пересекаются: на одну оплату приходят и `dealPaid`, и `dealStatusChanged` с одинаковым телом и одинаковым `ts`. Считать оплату по обоим — значит посчитать её дважды

`dealPaid` приходит только со статусом `payed`, промежуточный `part_payed` — только в `dealStatusChanged`. Бесплатный заказ создаётся сразу со статусом `payed`, и на него тоже приходит `dealPaid`

## Комментарии к урокам — `event_object_id: 4`

| `eventType`                     | Событие                | Примеры                                      | Тип                          |
| ------------------------------- | ---------------------- | -------------------------------------------- | ---------------------------- |
| `getcourse/lessonAnswerCreated` | Добавлен ответ на урок | [answer-created](lesson/answer-created.json) | `LessonAnswerCreatedWebhook` |

## Комментарии к ответам — `event_object_id: 5`

| `eventType`                      | Событие                       | Примеры                                                      | Тип                           |
| -------------------------------- | ----------------------------- | ------------------------------------------------------------ | ----------------------------- |
| `getcourse/answerCommentCreated` | Добавлен комментарий к ответу | [answer-comment-created](lesson/answer-comment-created.json) | `AnswerCommentCreatedWebhook` |

## Комментарии вебинаров — `event_object_id: 7`

| `eventType`                       | Событие                          | Примеры                                         | Тип                            |
| --------------------------------- | -------------------------------- | ----------------------------------------------- | ------------------------------ |
| `getcourse/webinarCommentCreated` | Добавлен комментарий на вебинаре | [comment-created](webinar/comment-created.json) | `WebinarCommentCreatedWebhook` |

## Звонки — `event_object_id: 8`

| Событие         | Примеры                      | Тип           |
| --------------- | ---------------------------- | ------------- |
| Звонок завершён | [created](call/created.json) | `CallWebhook` |

Тело звонка устроено иначе остальных: в нём нет `ts`, `ts64` и `gcAccountId`, а событие опознаётся по `type: "call"`

В данных видна связь, которой нет в типе: `atc` заполнен только когда `created_by: "atc"` — тогда `context` пустой. Если звонок завёл менеджер (`created_by: "user"`), то `atc` равен `null`, зато заполнены `context` с типом `Deal` и `failed_reason`

## HelpDesk — `event_object_id: 9`

Тело совпадает по структуре с «Входящими»: та же база, то же поле `dialog_id` — только в нём приходит ID тикета. Отличие в `transport`: у сообщения сотрудника здесь `0`, а во «Входящих» — `null`

| `event_id` | Событие                 | Примеры                                            | Тип                              |
| ---------- | ----------------------- | -------------------------------------------------- | -------------------------------- |
| 1          | Создан тикет            | [ticket-created](helpdesk/ticket-created.json)     | `HelpdeskTicketCreatedWebhook`   |
| 2          | Сообщение от клиента    | [client-message](helpdesk/client-message.json)     | `HelpdeskClientMessageWebhook`   |
| 3          | Сообщение от сотрудника | [employee-message](helpdesk/employee-message.json) | `HelpdeskEmployeeMessageWebhook` |

## На что смотреть

GetCourse не всегда последователен, и примеры показывают это намеренно:

- `deal.isPayed` — то число `0`/`1`, то boolean, см. [paid](deal/paid.json)
- `deal.isPayed` у бесплатного заказа — `0` даже в событии `dealPaid`, см. [paid](deal/paid.json)
- `deal.clientDealNumber` — то строка `"0"`, то число: строкой приходит в `dealCreated`, числом в остальных событиях, см. [created](deal/created.json) и [paid](deal/paid.json)
- `deal.payedValue` — бывает дробным и меньше `cost` при статусе `payed`, см. [paid](deal/paid.json)
- `deal.status` — принимает значение `"false"`, см. [status-changed](deal/status-changed.json)
- `deal.currency` — не только `RUB`, см. [status-changed](deal/status-changed.json)
- `gcSessionId` и `gcVisitorId` — оба бывают `null`, см. [status-changed](deal/status-changed.json)
- `answer.id` — строка с одинарными кавычками внутри: `"'501283094'"`
- `comment.files` — строка, внутри которой JSON, разбирается через `JSON.parse`
- `questionary` — пустой массив, если в уроке нет теста, и объект статистики, если тест есть
- `additional_fields[].required` — то boolean, то строка `"1"`
- `transport` — `null` у сотрудника во «Входящих», `0` в HelpDesk
- `message` — бывает пустой строкой, когда пришёл только файл
- `webinar_launch_number` — у скрытого комментария приходит `0`
