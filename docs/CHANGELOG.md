# Changelog

## [0.1.0] - 2026-03-31

### Добавлено

- Полная поддержка всех 48 эндпоинтов GetCourse Tech API v1
- TypeScript типы для всех запросов и ответов
- Классы ошибок: `GetCourseApiError`, `GetCourseNetworkError`
- Встроенный логгер с уровнями `silent | error | debug`; поддержка кастомного логгера (winston, pino)
- Dual ESM/CJS сборка через tsdown: `.dist/main.js`, `.dist/main.cjs`, `.dist/main.d.ts`

### Технические решения

- **Инструмент сборки** — tsdown (ESM + CJS + `.d.ts` из коробки)
- **HTTP-клиент** — axios (работает в Node и браузере, нет зависимости от `AbortSignal.timeout`)
- **Типы** — обычные `.ts` файлы с `export`, явные `import type` во всех модулях
- **`package.json`** — `"type": "module"`, `exports` с отдельными путями для ESM/CJS типов
- **`LICENSE`** — добавлен автор NiktarioN
