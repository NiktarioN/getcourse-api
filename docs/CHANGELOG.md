# Changelog

## [Unreleased] - 2026-03-30

### Изменено

- **Ambient типы** — `src/types/common.ts`, `models.ts`, `requests.ts`, `webhooks.ts` конвертированы в `.d.ts` без `export`, типы доступны глобально без импортов
- **Точка входа** — `src/index.ts` переименован в `src/getcourse-api.ts` (правило ESLint `check-file/no-index`)
- **`src/types/index.ts` удалён** — barrel-реэкспорт типов больше не нужен
- **Все `import type`** удалены из `src/client.ts` и `src/transport.ts` — типы берутся из ambient деклараций
- **`meta` → `context`** — переименован параметр в интерфейсе `Logger` и всех реализациях
- **`err` → `error`** — переименована переменная в catch-блоках `transport.ts`
- **`GetCourse`** — стал `export default` (ESLint `prefer-default-export`)
- **`HttpTransport`** — стал `export default` (ESLint `prefer-default-export`)
- **`Logger` interface** — перенесён в `src/types/common.d.ts` как ambient, из `logger.ts` удалён

### Исправлено

- ESLint `no-negated-condition` — все тернарные условия с `!== undefined` инвертированы
- ESLint `no-console` — добавлен `eslint-disable` в `logger.ts`
- ESLint `max-classes-per-file` — добавлен `eslint-disable` в `logger.ts` и `errors.ts`
- ESLint `class-methods-use-this` — добавлен `eslint-disable` для `SilentLogger`
- ESLint `no-restricted-syntax` — `for...of` заменён на `forEach` в `transport.ts`
- ESLint `no-unnecessary-type-assertion` — убран лишний `as string[]` в `transport.ts`
- ESLint `no-unnecessary-boolean-literal-compare` — `=== false` → `!` в `transport.ts`
- ESLint `method-signature-style` — Logger interface в `common.d.ts` использует function properties
- ESLint `docs/examples` — добавлен в `globalIgnores` в `eslint.config.js`

## [0.1.0] - 2026-03-25

### Добавлено

- Первый релиз пакета
- Полная поддержка всех 48 эндпоинтов GetCourse Tech API v1
- TypeScript типы для всех запросов и ответов
- Zero runtime dependencies (native fetch, Node 18+)
- Dual ESM/CJS сборка
- Классы ошибок: `GetCourseApiError`, `GetCourseNetworkError`
- Встроенный логгер с поддержкой winston/pino
- Поддержка кастомного `fetch` (для прокси и тестов)
- Константы для вебхук-событий (`EventObjectId`, `DealEventId` и т.д.)
