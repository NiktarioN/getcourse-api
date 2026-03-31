# План рефакторинга getcourse-api

## Контекст

SDK реализован (48 методов), но требует технической доработки перед публикацией на npm:

- Транспорт на нативном `fetch` → заменить на `axios`
- Ambient `.d.ts` типы → конвертировать в `.ts` с `export`, tsdown собирает в один `dist/main.d.ts`
- Сборка только ESM через esbuild → заменить на **tsdown** (ESM + CJS + единый .d.ts)
- README устарел → переписать на русском
- Мелкие правки: LICENSE, file structure, npm publish readiness

---

## Шаг 1 — Обновить зависимости

```bash
npm install axios
npm install -D tsdown
npm uninstall esbuild esbuild-plugin-node-externals
```

---

## Шаг 2 — Конвертировать типы: ambient .d.ts → .ts с export

Переименовать файлы и добавить `export` к каждому интерфейсу/типу:

- `src/types/common.d.ts` → `src/types/common.ts`
- `src/types/models.d.ts` → `src/types/models.ts`
- `src/types/requests.d.ts` → `src/types/requests.ts`
- `src/types/webhooks.d.ts` → `src/types/webhooks.ts`

Пример:

```ts
// было: common.d.ts
interface ApiResponse<T> extends ResultResponse {
  data: T;
}

// стало: common.ts
export interface ApiResponse<T> extends ResultResponse {
  data: T;
}
```

---

## Шаг 3 — Обновить src/main.ts

```ts
import GetCourse from "./client.ts";

export type * from "./types/common.ts";
export type * from "./types/models.ts";
export type * from "./types/requests.ts";
export type * from "./types/webhooks.ts";

export default GetCourse;
```

---

## Шаг 4 — Добавить импорты типов в src/client.ts, transport.ts, errors.ts, logger.ts

Раньше типы были ambient — теперь нужны явные `import type`. По одному блоку на файл.

Пример для `src/client.ts`:

```ts
import type { GetCourseConfig, ApiResponse, UserIdentifier, PaginationParams } from './types/common.ts'
import type { User, Deal, Offer, Training, Webinar, ... } from './types/models.ts'
import type { AddCommentToDealRequest, ... } from './types/requests.ts'
import type { SetUriRequest, ... } from './types/webhooks.ts'
```

---

## Шаг 5 — Переписать transport.ts на axios

**Файл:** `src/transport.ts`

Убрать: `AbortSignal.timeout()`, поле `fetch` из конфига, нативный `fetch`.

```ts
import axios, { type AxiosInstance, AxiosError } from "axios";

// В конструкторе:
this.client = axios.create({
  baseURL: config.baseUrl,
  timeout: config.timeout ?? 15_000,
  headers: { Authorization: `Bearer ${config.token}` },
});
```

Обработка ошибок:

```ts
// error.response → GetCourseApiError
// !error.response → GetCourseNetworkError
```

Убрать из `GetCourseConfig` поле `fetch?: ...`.

---

## Шаг 6 — Создать tsdown.config.ts

```ts
import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/main.ts"],
  format: ["esm", "cjs"],
  outDir: "dist",
  dts: true,
  clean: true,
  platform: "neutral",
  target: "es2020",
});
```

Выходные файлы:

- `dist/main.js` — ESM
- `dist/main.cjs` — CJS
- `dist/main.d.ts` — единый файл типов

---

## Шаг 7 — Обновить package.json

```json
{
  "name": "getcourse-api",
  "version": "0.1.0",
  "description": "TypeScript SDK для GetCourse Tech API (v1)",
  "keywords": ["getcourse", "api", "sdk", "typescript"],
  "author": "NiktarioN",
  "license": "MIT",
  "repository": { "type": "git", "url": "https://github.com/NiktarioN/getcourse-api-npm.git" },
  "bugs": { "url": "https://github.com/NiktarioN/getcourse-api-npm/issues" },
  "main": "./dist/main.cjs",
  "module": "./dist/main.js",
  "types": "./dist/main.d.ts",
  "exports": {
    ".": {
      "import": { "types": "./dist/main.d.ts", "default": "./dist/main.js" },
      "require": { "types": "./dist/main.d.ts", "default": "./dist/main.cjs" }
    }
  },
  "files": ["dist", "LICENSE", "README.md"],
  "engines": { "node": ">=18" },
  "scripts": {
    "build": "tsdown"
  },
  "dependencies": { "axios": "^1.x.x" }
}
```

---

## Шаг 8 — Обновить LICENSE

```
Copyright (c) 2025 NiktarioN
```

---

## Шаг 9 — Убрать лишнее

- Удалить `esbuild.prod.ts`
- Удалить `tsconfig.build.json`
- Удалить папку `.dist/`
- Обновить `.npmignore`: исключить `src/`, `tsdown.config.ts`, `.github/`, `docs/`

---

## Шаг 10 — Переписать README.md

Содержание на русском:

1. Заголовок + бейджи (npm version, license)
2. Краткое описание
3. Установка
4. Быстрый старт
5. Таблица параметров конфигурации
6. Все 48 методов сгруппированы по категориям с примерами
7. Обработка ошибок
8. Настройка логгера
9. Использование в браузере и Node.js

---

## Шаг 11 — Проверка перед публикацией

```bash
npm run build          # dist/ собирается без ошибок
npm pack --dry-run     # убедиться что попадает в пакет
npm run typecheck      # нет ошибок TypeScript
npm run lint           # нет lint ошибок
```

Убедиться что `dist/main.d.ts` содержит все типы и `GetCourse`.

---

## Порядок выполнения

1. Установить axios + tsdown, удалить esbuild
2. Конвертировать `src/types/*.d.ts` → `.ts` с `export`
3. Обновить `src/main.ts` (добавить `export type *`)
4. Добавить `import type` в `client.ts`, `transport.ts`, `errors.ts`, `logger.ts`
5. Переписать `transport.ts` на axios
6. Создать `tsdown.config.ts`
7. Обновить `package.json`
8. Обновить `LICENSE`
9. Удалить лишние файлы
10. `npm run build` — убедиться что собирается
11. Переписать `README.md`
12. `npm pack --dry-run` — финальная проверка

---

## Критические файлы

| Файл                      | Действие                                            |
| ------------------------- | --------------------------------------------------- |
| `src/main.ts`             | Добавить `export type *` для каждого типового файла |
| `src/transport.ts`        | Переписать (fetch → axios)                          |
| `src/types/common.d.ts`   | → `common.ts`, добавить `export`                    |
| `src/types/models.d.ts`   | → `models.ts`, добавить `export`                    |
| `src/types/requests.d.ts` | → `requests.ts`, добавить `export`                  |
| `src/types/webhooks.d.ts` | → `webhooks.ts`, добавить `export`                  |
| `src/client.ts`           | Добавить `import type` блоки                        |
| `tsdown.config.ts`        | Создать                                             |
| `package.json`            | Обновить metadata, exports, deps, scripts           |
| `LICENSE`                 | Добавить NiktarioN                                  |
| `README.md`               | Полностью переписать на русском                     |
| `esbuild.prod.ts`         | Удалить                                             |
| `tsconfig.build.json`     | Удалить                                             |
| `.dist/`                  | Удалить                                             |
