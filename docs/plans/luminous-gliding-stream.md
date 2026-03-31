# План: Выполнение следующих шагов из HANDOFF.md

## Контекст

Пакет `getcourse-api` реализован и готов к публикации. В HANDOFF.md зафиксированы задачи перед публикацией. Текущий `package.json` содержит зависимости от другого проекта. Пользователь хочет ambient-типы без импортов внутри проекта и упрощённые index-файлы.

---

## Задача 1: `meta` → `context` в Logger

**Файл:** `src/logger.ts`

Переименовать параметр `meta` → `context` и `_meta` → `_context`:

- Logger interface (строки 5-8): 4 сигнатуры
- ConsoleLogger (строки 17-47): 4 сигнатуры + 8 использований (`if (meta !== undefined)`, `console.xxx(..., meta)`)
- SilentLogger (строки 54-57): 4 сигнатуры (`_meta` → `_context`)

Вызовы в `src/transport.ts` не затронуты (передают объектные литералы позиционно).

---

## Задача 2: `err` → `error` в transport.ts

**Файл:** `src/transport.ts`

Два catch-блока (строки 55-62 и 89-96):
- `catch (err)` → `catch (error)` (2 места)
- Все использования `err` внутри блоков → `error` (8 мест)

Итого: 10 замен в 1 файле.

---

## Задача 3: Ambient типы (.d.ts) + упрощение index-файлов

### 3a. Конвертация типов в ambient .d.ts

Переименовать и убрать `export`:
- `src/types/common.ts` → `src/types/common.d.ts` (убрать все `export`)
- `src/types/models.ts` → `src/types/models.d.ts` (убрать все `export`)
- `src/types/requests.ts` → `src/types/requests.d.ts` (убрать все `export`)
- `src/types/webhooks.ts` → `src/types/webhooks.d.ts` (убрать все `export`)

Типы становятся глобальными — доступны везде без импортов.

### 3b. Убрать импорты типов из исходных файлов

- `src/client.ts`: убрать все `import type { ... }` из `./types/...`
- `src/transport.ts`: убрать `import type { ApiResponse }` из `./types/common.js`
- `src/logger.ts`: не затронут (типы в самом файле)

### 3c. Упростить src/index.ts

Заменить ~90 строк реэкспортов на:
```ts
export { GetCourse } from './client.js';
export { GetCourseError, GetCourseApiError, GetCourseNetworkError } from './errors.js';
export { ConsoleLogger, SilentLogger } from './logger.js';
export type { Logger } from './logger.js';
```

### 3d. Удалить src/types/index.ts

Больше не нужен — типы ambient, классы экспортируются напрямую.

### 3e. Проверить tsconfig.json

Убедиться что `include` покрывает `.d.ts` файлы в `src/types/`. Если нужно — добавить `"src/**/*.d.ts"`.

### 3f. Верификация

- `npm run build` — убедиться что tsup встраивает ambient типы в `dist/index.d.ts`
- Проверить что в `dist/index.d.ts` присутствуют типы `Deal`, `User`, `ApiResponse` и т.д.
- Если tsup не включает ambient типы — скорректировать подход

---

## Задача 4: Обновить package.json (требует утверждения)

**Файл:** `package.json`

Предложить пользователю следующие изменения:

| # | Изменение | Причина |
|---|-----------|---------|
| 1 | Убрать `"private": true` | Блокирует `npm publish` |
| 2 | `"license": "UNLICENSED"` → `"MIT"` | Соответствие файлу LICENSE |
| 3 | Убрать из dependencies: `dotenv`, `esbuild`, `esbuild-plugin-node-externals` | Не нужны SDK в рантайме |
| 4 | Перенести `typescript` в devDependencies | Инструмент сборки |
| 5 | Добавить в devDependencies: `tsup`, `vitest` | Сборка и тесты |
| 6 | Обновить scripts: `build`, `test`, `lint`, `typecheck` | Соответствие CLAUDE.md |
| 7 | Добавить entry points: `main`, `module`, `types`, `exports` | Для ESM/CJS потребителей |
| 8 | Добавить `"files": ["dist", "README.md", "LICENSE"]` | Контроль содержимого пакета |
| 9 | Добавить `"engines": { "node": ">=18" }` | Требуется native fetch |

**Показать пользователю до/после и получить утверждение.**

---

## Порядок выполнения

1. **Задачи 1 и 2** (параллельно) — механические переименования в logger.ts и transport.ts
2. **Задача 3** — ambient типы + упрощение index
3. **Задача 4** — показать изменения package.json, получить утверждение
4. **Верификация** — typecheck + build + проверка dist

## Верификация

```bash
npm run typecheck    # типы корректны после всех изменений
npm run build        # сборка проходит, ambient типы в dist/index.d.ts
npm run lint         # линтер проходит
npm pack --dry-run   # содержимое пакета корректно
```

## Критические файлы

- `src/logger.ts` — задача 1
- `src/transport.ts` — задача 2
- `src/types/common.ts` → `.d.ts` — задача 3
- `src/types/models.ts` → `.d.ts` — задача 3
- `src/types/requests.ts` → `.d.ts` — задача 3
- `src/types/webhooks.ts` → `.d.ts` — задача 3
- `src/types/index.ts` — удалить (задача 3)
- `src/index.ts` — упростить (задача 3)
- `src/client.ts` — убрать import type (задача 3)
- `package.json` — задача 4
- `tsconfig.json` — проверить include (задача 3)
- `docs/CODESTYLE.md` — обновить пункт про ambient (задача 3)
