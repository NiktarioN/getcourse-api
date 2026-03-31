# Публикация и поддержка пакета

## Первичная публикация

### 1. Создать аккаунт на npm

```bash
npm adduser
# Или через сайт: https://www.npmjs.com/signup
```

### 2. Войти в npm

```bash
npm login
```

### 3. Проверить перед публикацией

```bash
# Проверить типы
npm run typecheck

# Запустить тесты
npm test

# Проверить линтер
npm run lint

# Собрать пакет
npm run build

# Посмотреть что войдёт в пакет (без реальной публикации)
npm pack --dry-run
```

### 4. Опубликовать

```bash
npm publish
```

---

## Обновление пакета (новая версия)

### Семантическое версионирование (SemVer)

- **PATCH** `0.1.0 → 0.1.1` — баг-фикс, ничего не сломалось
- **MINOR** `0.1.0 → 0.2.0` — новые методы/фичи, обратная совместимость сохранена
- **MAJOR** `0.1.0 → 1.0.0` — breaking changes (переименовали метод, изменили сигнатуру)

### Процесс выпуска новой версии

```bash
# 1. Убедиться что всё чисто
git status

# 2. Обновить версию (автоматически создаёт git tag)
npm version patch   # для баг-фиксов
npm version minor   # для новых фич
npm version major   # для breaking changes

# 3. Обновить CHANGELOG.md (описать что изменилось)

# 4. Запушить коммит и тег
git push && git push --tags

# 5. Опубликовать
npm publish
```

---

## GitHub Actions (автоматическая публикация)

Файл `.github/workflows/publish.yml` автоматически публикует пакет при создании тега.

### Настройка

1. Перейти в Settings → Secrets → Actions в репозитории на GitHub
2. Добавить секрет `NPM_TOKEN` — токен с npm (создать на npmjs.com: Access Tokens → Generate New Token → Automation)

После настройки процесс выпуска упрощается:
```bash
npm version patch
git push && git push --tags
# GitHub Actions сам опубликует пакет
```

---

## Добавление нового метода API

1. **Добавить тип запроса** в `src/types/requests.ts` (если POST):
```ts
export interface MyNewRequest {
  someId: number;
  value: string;
}
```

2. **Добавить тип модели** в `src/types/models.ts` (если нужна новая модель ответа):
```ts
export interface MyNewModel {
  id: number;
  name: string;
}
```

3. **Экспортировать типы** в `src/types/index.ts`

4. **Добавить метод** в `src/client.ts`:
```ts
/** Описание нового метода */
async myNewMethod(body: MyNewRequest): Promise<ApiResponse<MyNewModel[]>> {
  return this.transport.post('my/endpoint', body);
}
```

5. **Экспортировать тип** в `src/index.ts` если нужно

6. **Написать тест** в `tests/client.test.ts`

7. **Обновить README.md** — добавить в таблицу методов

---

## Поддержка CI/CD

### Локальная проверка перед PR

```bash
npm run typecheck  # Типы
npm test           # Тесты
npm run lint       # Линтер
npm run build      # Сборка
```

### GitHub Actions

- **`ci.yml`** — запускается на каждый PR: typecheck + test + build
- **`publish.yml`** — запускается при пуше тега `v*`: публикует на npm

---

## Полезные команды

```bash
# Посмотреть текущую версию
npm version

# Проверить что пойдёт в пакет
npm pack --dry-run

# Посмотреть опубликованные версии
npm info getcourse-api versions

# Откатить (если что-то пошло не так, в течение 72 часов)
npm unpublish getcourse-api@0.1.1
```
