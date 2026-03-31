# CLAUDE.md — getcourse-api

## Назначение проекта

Open-source TypeScript SDK для нового Tech API GetCourse (v1). Позволяет разработчикам взаимодействовать с платформой GetCourse через типизированный клиент

## Архитектура

```txt
GetCourse (client.ts)          ← единственный класс, все 48 методов плоско
        ↓
HttpTransport (transport.ts)   ← HTTP запросы, auth, ошибки
        ↓
Native fetch (Node 18+)
```

**Паттерн клиента — flat методы:**

```ts
const getcourse = new GetCourse({ devKey, apiKey, domain });

getcourse.getDealFields(12345);
getcourse.getUserFields({ userId: 123 });
getcourse.addUserBalance({ userId: 123, value: 500, type: "virtual", comment: "..." });
```

Никаких namespace объектов (`getcourse.deal.*`, `getcourse.user.*`) — все методы прямо на классе.

## Структура файлов

```txt
src/
  index.ts           # Главный entry — экспортирует всё публичное
  client.ts          # Класс GetCourse — все 48 методов плоско
  transport.ts       # HttpTransport (HTTP запросы, auth, ошибки)
  errors.ts          # GetCourseError, GetCourseApiError, GetCourseNetworkError
  logger.ts          # Logger interface + ConsoleLogger + SilentLogger
  types/
    index.ts         # Barrel re-export типов
    common.ts        # ResultResponse, ApiResponse<T>, UserIdentifier, PaginationParams, GetCourseConfig
    models.ts        # Data models: User, Deal, Offer, Webinar и т.д. (17 моделей)
    requests.ts      # Request bodies для POST эндпоинтов (18 типов)
    webhooks.ts      # SetUriRequest, EventObjectId, EventId константы
docs/
  new-api-schema.json  # OpenAPI 3.0 схема (4905 строк, 48 эндпоинтов) — только для справки
  new-api-example.js   # Reference JS реализация — только для справки
  HANDOFF.md           # Контекст для передачи между сессиями
```

## Ключевые конвенции

### Именование методов

- GET `deal/get-fields` → `getDealFields(dealId)`
- POST `deal/add-comment` → `addCommentToDeal(body)`
- Простые числовые параметры (dealId, lessonId) → передаются напрямую
- User-эндпоинты → `UserIdentifier` объект `{ userId? } | { email? }`
- Сложные POST-параметры → типизированный request объект

### Типизация

- Все данные API описаны в `src/types/`
- `transport.get()` принимает `object` (не `Record<string, unknown>`) — так интерфейсы `UserIdentifier`, `PaginationParams` передаются без кастов
- `ApiResponse<T>` = `ResultResponse & { data: T }` — общая обёртка

### Обработка ошибок

- Методы **бросают** `GetCourseApiError` или `GetCourseNetworkError`
- НЕ возвращают `{ success: false }`
- `GetCourseApiError` содержит: `message`, `statusCode`, `apiCode`, `errors: string[]`

### Логгер

- Интерфейс `Logger` — методы `debug/info/warn/error(message, context?)`
- `ConsoleLogger` — дефолт, пишет в консоль с префиксом `[getcourse-api]`
- `SilentLogger` — заглушка для тестов
- Совместим с winston/pino (передаётся через `config.logger`)

## Команды

```bash
npm run build      # tsup → dist/ (ESM + CJS + .d.ts)
npm run test       # vitest run
npm run lint       # eslint src tests
npm run typecheck  # tsc --noEmit
npm pack --dry-run # проверить содержимое пакета перед публикацией
```

## Технологический стек

- **Runtime**: Node >= 18 (native fetch, AbortSignal.timeout)
- **Lint**: ESLint 9 flat config + typescript-eslint
- **Format**: Prettier

## Правила кода

Находится в `docs/CODESTYLE.md` и их нужно придерживаться

## Правила работы

- Всегда используй Context7, когда мне нужна документация по библиотеке/API, генерация кода, шаги по установке или настройке — без необходимости, чтобы я явно об этом просил
- Все изменения пиши в `docs/CHANGELOG.md`
