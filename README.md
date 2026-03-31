# getcourse-api

TypeScript SDK РґР»СЏ РЅРѕРІРѕРіРѕ Tech API GetCourse. Zero dependencies, Node 18+.

## РЈСЃС‚Р°РЅРѕРІРєР°

```bash
npm install getcourse-api
```

## Р‘С‹СЃС‚СЂС‹Р№ СЃС‚Р°СЂС‚

```ts
import { GetCourse } from "getcourse-api";

const getcourse = new GetCourse({
  devKey: "XXXXXXXX", // РљР»СЋС‡ СЂР°Р·СЂР°Р±РѕС‚С‡РёРєР°
  apiKey: "YYYYYYYYYYYYYYYYYYY", // РљР»СЋС‡ API С€РєРѕР»С‹
  domain: "test.getcourse.ru",
});

// РџРѕР»СѓС‡РёС‚СЊ РґР°РЅРЅС‹Рµ РїРѕР»СЊР·РѕРІР°С‚РµР»СЏ
const user = await getcourse.getUserFields({ userId: 123 });
console.log(user.data[0]?.first_name);

// РџРѕР»СѓС‡РёС‚СЊ Р·Р°РєР°Р·С‹ РїРѕР»СЊР·РѕРІР°С‚РµР»СЏ
const deals = await getcourse.getUserDeals({ email: "user@mail.ru" });

// РџРѕР»СѓС‡РёС‚СЊ РґР°РЅРЅС‹Рµ Р·Р°РєР°Р·Р°
const deal = await getcourse.getDealFields(12345);
```

## РџРѕР»СѓС‡РµРЅРёРµ С‚РѕРєРµРЅР°

РўРѕРєРµРЅ СЃРѕСЃС‚РѕРёС‚ РёР· РґРІСѓС… С‡Р°СЃС‚РµР№:

- **РљР»СЋС‡ СЂР°Р·СЂР°Р±РѕС‚С‡РёРєР°** вЂ” РїРѕР»СѓС‡РёС‚СЊ РїРѕ [Р°РЅРєРµС‚Рµ РЅР° getcourse.ru](https://getcourse.ru/issuedeveloperkey)
- **РљР»СЋС‡ API С€РєРѕР»С‹** вЂ” РїРѕР»СѓС‡РёС‚СЊ Сѓ РїСЂРµРґСЃС‚Р°РІРёС‚РµР»РµР№ С€РєРѕР»С‹ РЅР° РїР»Р°С‚С„РѕСЂРјРµ

## РљРѕРЅС„РёРіСѓСЂР°С†РёСЏ

```ts
const getcourse = new GetCourse({
  devKey: "XXXXXXXX",
  apiKey: "YYYYYYYYYYYYYYYYYYY",
  domain: "myschool.getcourse.ru",

  // РћРїС†РёРѕРЅР°Р»СЊРЅРѕ:
  timeout: 15000, // РўР°Р№РјР°СѓС‚ Р·Р°РїСЂРѕСЃРѕРІ РІ РјСЃ (РїРѕ СѓРјРѕР»С‡Р°РЅРёСЋ: 15000)
  logger: myLogger, // РЎРѕРІРјРµСЃС‚РёРј СЃ winston, pino Рё Р»СЋР±С‹Рј РґСЂСѓРіРёРј Р»РѕРіРіРµСЂРѕРј
  fetch: customFetch, // РљР°СЃС‚РѕРјРЅС‹Р№ fetch (РґР»СЏ РїСЂРѕРєСЃРё, С‚РµСЃС‚РѕРІ Рё С‚.Рґ.)
});
```

### РћС‚РєР»СЋС‡РµРЅРёРµ Р»РѕРіРѕРІ

```ts
import { GetCourse, SilentLogger } from "getcourse-api";

const getcourse = new GetCourse({
  // ...
  logger: new SilentLogger(),
});
```

### РСЃРїРѕР»СЊР·РѕРІР°РЅРёРµ СЃ winston

```ts
import winston from "winston";
import { GetCourse } from "getcourse-api";

const logger = winston.createLogger({
  /* ... */
});

const getcourse = new GetCourse({
  // ...
  logger, // winston СЃРѕРІРјРµСЃС‚РёРј СЃ РёРЅС‚РµСЂС„РµР№СЃРѕРј Logger
});
```

## РћР±СЂР°Р±РѕС‚РєР° РѕС€РёР±РѕРє

```ts
import { GetCourse, GetCourseApiError, GetCourseNetworkError } from "getcourse-api";

try {
  const deal = await getcourse.getDealFields(99999);
} catch (err) {
  if (err instanceof GetCourseApiError) {
    // РћС€РёР±РєР° РѕС‚ API (403, 404, validation error Рё С‚.Рґ.)
    console.error(err.message); // РўРµРєСЃС‚ РѕС€РёР±РєРё
    console.error(err.statusCode); // HTTP СЃС‚Р°С‚СѓСЃ: 403, 404, 400...
    console.error(err.errors); // string[] вЂ” СЃРїРёСЃРѕРє РѕС€РёР±РѕРє РІР°Р»РёРґР°С†РёРё
  } else if (err instanceof GetCourseNetworkError) {
    // РЎРµС‚РµРІР°СЏ РѕС€РёР±РєР° (С‚Р°Р№РјР°СѓС‚, РЅРµС‚ СЃРѕРµРґРёРЅРµРЅРёСЏ)
    console.error("РќРµС‚ СЃРІСЏР·Рё:", err.message);
  }
}
```

## РЎРїСЂР°РІРѕС‡РЅРёРє РјРµС‚РѕРґРѕРІ

### Webhooks

| РњРµС‚РѕРґ          | РћРїРёСЃР°РЅРёРµ                             |
| -------------- | ------------------------------------ |
| `setUri(body)` | РЈСЃС‚Р°РЅРѕРІРёС‚СЊ URI РґР»СЏ РїРѕР»СѓС‡РµРЅРёСЏ СЃРѕР±С‹С‚РёР№ |

**РџСЂРёРјРµСЂ:**

```ts
import { EventObjectId, DealEventId } from "getcourse-api";

await getcourse.setUri({
  uri: "https://myapp.ru/webhook",
  event_object_id: EventObjectId.Deal,
  event_id: DealEventId.DealPaid,
});
```

---

### School (common)

| РњРµС‚РѕРґ                      | РћРїРёСЃР°РЅРёРµ                              |
| -------------------------- | ------------------------------------- |
| `getAllGroups()`           | РџРѕР»СѓС‡РёС‚СЊ РІСЃРµ РіСЂСѓРїРїС‹ РїРѕР»СЊР·РѕРІР°С‚РµР»РµР№     |
| `getAllPersonalManagers()` | РџРѕР»СѓС‡РёС‚СЊ РІСЃРµС… РїРµСЂСЃРѕРЅР°Р»СЊРЅС‹С… РјРµРЅРµРґР¶РµСЂРѕРІ |
| `getTrainings()`           | РџРѕР»СѓС‡РёС‚СЊ РІСЃРµ С‚СЂРµРЅРёРЅРіРё                 |

---

### Deal (Р·Р°РєР°Р·С‹)

| РњРµС‚РѕРґ                         | РћРїРёСЃР°РЅРёРµ                       |
| ----------------------------- | ------------------------------ |
| `getDealFields(dealId)`       | РџРѕР»СѓС‡РёС‚СЊ РїРѕР»СЏ Р·Р°РєР°Р·Р°           |
| `getDealCustomFields(dealId)` | РџРѕР»СѓС‡РёС‚СЊ РєР°СЃС‚РѕРјРЅС‹Рµ РїРѕР»СЏ Р·Р°РєР°Р·Р° |
| `getDealComments(dealId)`     | РџРѕР»СѓС‡РёС‚СЊ РєРѕРјРјРµРЅС‚Р°СЂРёРё Р·Р°РєР°Р·Р°    |
| `getDealCalls(dealId)`        | РџРѕР»СѓС‡РёС‚СЊ Р·РІРѕРЅРєРё РїРѕ Р·Р°РєР°Р·Сѓ      |
| `getDealCancelReasons()`      | РџРѕР»СѓС‡РёС‚СЊ РїСЂРёС‡РёРЅС‹ РѕС‚РјРµРЅС‹        |
| `getDealsTags(params?)`       | РџРѕР»СѓС‡РёС‚СЊ Р·Р°РєР°Р·С‹ СЃ С‚РµРіР°РјРё       |
| `addCommentToDeal(body)`      | Р”РѕР±Р°РІРёС‚СЊ РєРѕРјРјРµРЅС‚Р°СЂРёР№ Рє Р·Р°РєР°Р·Сѓ  |
| `addDealPositions(body)`      | Р”РѕР±Р°РІРёС‚СЊ РїРѕР·РёС†РёРё РІ Р·Р°РєР°Р·       |
| `removeDealPositions(body)`   | РЈРґР°Р»РёС‚СЊ РїРѕР·РёС†РёРё РёР· Р·Р°РєР°Р·Р°      |
| `updateDealFields(body)`      | РћР±РЅРѕРІРёС‚СЊ РїРѕР»СЏ Р·Р°РєР°Р·Р°           |

**РџСЂРёРјРµСЂС‹:**

```ts
// РџРѕР»СѓС‡РёС‚СЊ Р·Р°РєР°Р·
const deal = await getcourse.getDealFields(12345);

// РћР±РЅРѕРІРёС‚СЊ СЃС‚Р°С‚СѓСЃ Р·Р°РєР°Р·Р°
await getcourse.updateDealFields({
  dealId: 12345,
  status: "cancelled",
  cancel_reason_comment: "РљР»РёРµРЅС‚ РїРµСЂРµРґСѓРјР°Р»",
});

// Р”РѕР±Р°РІРёС‚СЊ РїРѕР·РёС†РёРё
await getcourse.addDealPositions({
  dealId: 12345,
  positions: [
    { offerId: 1, price: 1000, quantity: 2 },
    { offerId: 3, price: 500 },
  ],
});
```

---

### Dialog (РґРёР°Р»РѕРіРё)

| РњРµС‚РѕРґ                      | РћРїРёСЃР°РЅРёРµ                      |
| -------------------------- | ----------------------------- |
| `getDialogHistory(body)`   | РџРѕР»СѓС‡РёС‚СЊ РёСЃС‚РѕСЂРёСЋ РґРёР°Р»РѕРіР°      |
| `addCommentToDialog(body)` | Р”РѕР±Р°РІРёС‚СЊ РєРѕРјРјРµРЅС‚Р°СЂРёР№ РІ РґРёР°Р»РѕРі |
| `changeDepartment(body)`   | РР·РјРµРЅРёС‚СЊ РѕС‚РґРµР» РґРёР°Р»РѕРіР°        |
| `closeDialog(body)`        | Р—Р°РєСЂС‹С‚СЊ РґРёР°Р»РѕРі                |

---

### Lesson (СѓСЂРѕРєРё)

| РњРµС‚РѕРґ                            | РћРїРёСЃР°РЅРёРµ                      |
| -------------------------------- | ----------------------------- |
| `getLessonAnswers(lessonId?)`    | РџРѕР»СѓС‡РёС‚СЊ РѕС‚РІРµС‚С‹ РЅР° СѓСЂРѕРє       |
| `addCommentToLessonAnswer(body)` | Р”РѕР±Р°РІРёС‚СЊ РєРѕРјРјРµРЅС‚Р°СЂРёР№ Рє РѕС‚РІРµС‚Сѓ |
| `changeStatusAnswers(body)`      | РР·РјРµРЅРёС‚СЊ СЃС‚Р°С‚СѓСЃ РѕС‚РІРµС‚Р°        |

---

### Note (Р·Р°РјРµС‚РєРё)

| РњРµС‚РѕРґ           | РћРїРёСЃР°РЅРёРµ                   |
| --------------- | -------------------------- |
| `addNote(body)` | Р”РѕР±Р°РІРёС‚СЊ Р·Р°РјРµС‚РєСѓ Рє РґРёР°Р»РѕРіСѓ |

---

### Offer (РїСЂРµРґР»РѕР¶РµРЅРёСЏ)

| РњРµС‚РѕРґ                    | РћРїРёСЃР°РЅРёРµ                 |
| ------------------------ | ------------------------ |
| `getOffers()`            | РџРѕР»СѓС‡РёС‚СЊ РІСЃРµ РѕС„С„РµСЂС‹      |
| `getOfferById(offerId)`  | РџРѕР»СѓС‡РёС‚СЊ РѕС„С„РµСЂ РїРѕ ID     |
| `getOffersTags(params?)` | РџРѕР»СѓС‡РёС‚СЊ РѕС„С„РµСЂС‹ СЃ С‚РµРіР°РјРё |

---

### User (РїРѕР»СЊР·РѕРІР°С‚РµР»Рё)

| РњРµС‚РѕРґ                             | РћРїРёСЃР°РЅРёРµ                     |
| --------------------------------- | ---------------------------- |
| `getUserFields(params)`           | РџРѕР»СѓС‡РёС‚СЊ РїРѕР»СЏ РїРѕР»СЊР·РѕРІР°С‚РµР»СЏ   |
| `getUserCustomFields(params)`     | РџРѕР»СѓС‡РёС‚СЊ РєР°СЃС‚РѕРјРЅС‹Рµ РїРѕР»СЏ      |
| `getUserDeals(params)`            | РџРѕР»СѓС‡РёС‚СЊ Р·Р°РєР°Р·С‹ РїРѕР»СЊР·РѕРІР°С‚РµР»СЏ |
| `getUserDiplomas(params)`         | РџРѕР»СѓС‡РёС‚СЊ РґРёРїР»РѕРјС‹             |
| `getUserGroups(params)`           | РџРѕР»СѓС‡РёС‚СЊ РіСЂСѓРїРїС‹              |
| `getUserBalance(params)`          | РџРѕР»СѓС‡РёС‚СЊ Р±Р°Р»Р°РЅСЃ              |
| `getUserPurchases(params)`        | РџРѕР»СѓС‡РёС‚СЊ РїРѕРєСѓРїРєРё             |
| `getUserTrainings(params)`        | РџРѕР»СѓС‡РёС‚СЊ С‚СЂРµРЅРёРЅРіРё            |
| `getUserSchedule(params)`         | РџРѕР»СѓС‡РёС‚СЊ СЂР°СЃРїРёСЃР°РЅРёРµ          |
| `getUserGoalRecords(params)`      | РџРѕР»СѓС‡РёС‚СЊ Р·Р°РїРёСЃРё С†РµР»РµР№        |
| `getUserAnswers(params)`          | РџРѕР»СѓС‡РёС‚СЊ РѕС‚РІРµС‚С‹              |
| `getUserLessonAnswers(params)`    | РџРѕР»СѓС‡РёС‚СЊ РѕС‚РІРµС‚С‹ РЅР° СѓСЂРѕРєРё     |
| `getUserByTelegramChatId(chatId)` | РќР°Р№С‚Рё РїРѕ Telegram Chat ID    |
| `addUserBalance(body)`            | Р”РѕР±Р°РІРёС‚СЊ Р±Р°Р»Р°РЅСЃ              |
| `addUserGroups(body)`             | Р”РѕР±Р°РІРёС‚СЊ РІ РіСЂСѓРїРїС‹            |
| `removeUserGroups(body)`          | РЈРґР°Р»РёС‚СЊ РёР· РіСЂСѓРїРї             |
| `setUserGroups(body)`             | РЈСЃС‚Р°РЅРѕРІРёС‚СЊ РіСЂСѓРїРїС‹            |
| `setPersonalManager(body)`        | РЈСЃС‚Р°РЅРѕРІРёС‚СЊ РјРµРЅРµРґР¶РµСЂР°         |
| `updateUserFields(body)`          | РћР±РЅРѕРІРёС‚СЊ РїРѕР»СЏ РїРѕР»СЊР·РѕРІР°С‚РµР»СЏ   |
| `updateUserCustomFields(body)`    | РћР±РЅРѕРІРёС‚СЊ РєР°СЃС‚РѕРјРЅС‹Рµ РїРѕР»СЏ      |
| `createDiploma(body)`             | РЎРѕР·РґР°С‚СЊ РґРёРїР»РѕРј               |

**РџСЂРёРјРµСЂС‹:**

```ts
// РџРѕРёСЃРє РїРѕ userId РёР»Рё email
const user = await getcourse.getUserFields({ userId: 123 });
const user2 = await getcourse.getUserFields({ email: "user@mail.ru" });

// РџРѕР»СѓС‡РёС‚СЊ Р±Р°Р»Р°РЅСЃ
const balance = await getcourse.getUserBalance({ userId: 123, type: "virtual" });

// Р”РѕР±Р°РІРёС‚СЊ Р±Р°Р»Р°РЅСЃ
await getcourse.addUserBalance({
  userId: 123,
  value: 500,
  type: "virtual",
  comment: "Р‘РѕРЅСѓСЃ Р·Р° Р°РєС‚РёРІРЅРѕСЃС‚СЊ",
});

// РћР±РЅРѕРІРёС‚СЊ РїРѕР»СЏ
await getcourse.updateUserFields({
  userId: 123,
  first_name: "РРІР°РЅ",
  last_name: "РРІР°РЅРѕРІ",
  phone: "+79991234567",
});
```

---

### Webinar (РІРµР±РёРЅР°СЂС‹)

| РњРµС‚РѕРґ                    | РћРїРёСЃР°РЅРёРµ                |
| ------------------------ | ----------------------- |
| `getAllWebinars()`       | РџРѕР»СѓС‡РёС‚СЊ РІСЃРµ РІРµР±РёРЅР°СЂС‹   |
| `getWebinarsByIds(body)` | РџРѕР»СѓС‡РёС‚СЊ РІРµР±РёРЅР°СЂС‹ РїРѕ ID |

---

## РљРѕРЅСЃС‚Р°РЅС‚С‹ РІРµР±С…СѓРєРѕРІ

```ts
import { EventObjectId, DealEventId, DialogEventId } from "getcourse-api";

// EventObjectId: Dialog=1, Deal=2, LessonComment=4, AnswerComment=5, WebinarComment=7
// DialogEventId: NewDialog=1, DialogReopened=2, NewMessage=3
// DealEventId: DealCreated=1, DealStatusChanged=2, DealPaid=3
// LessonCommentEventId: AnswerAdded=1
// AnswerCommentEventId: CommentAdded=1
// WebinarCommentEventId: NewComment=1
```

## РўСЂРµР±РѕРІР°РЅРёСЏ

- Node.js >= 18.0.0
- Zero runtime dependencies

## Р›РёС†РµРЅР·РёСЏ

MIT

## Smoke Check (Local, No Tests)

1. Create `.env` from `.env.example` and fill `GC_DEV_KEY`, `GC_API_KEY`, `GC_DOMAIN`.
2. Run smoke request:

```bash
npm run smoke
```

For Windows PowerShell with blocked `npm.ps1`, use:

```bash
npm.cmd run smoke
```

Run another SDK method:

```bash
npm.cmd run smoke -- getUserFields
```

For methods with args, set `GC_SMOKE_ARGS` as JSON array in `.env`.

Example for `getUserFields({ userId: 123 })`:

```env
GC_SMOKE_METHOD=getUserFields
GC_SMOKE_ARGS=[{"userId":123}]
```
