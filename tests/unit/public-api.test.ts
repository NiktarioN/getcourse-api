import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import type {
  ApiResponse,
  CallWebhook,
  GetCourseConfig,
  Logger,
  MessageAttachment,
  User,
} from '../../src/index.ts';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const api = await import('../../src/index.ts');
const indexSource = await readFile(join(ROOT, 'src/index.ts'), 'utf8');

/** Механика транспорта — наружу не идёт */
const INTERNAL_TYPES = [
  'BaseResultResponse',
  'ExportInfo',
  'LegacyAction',
  'LegacyExportApiResponse',
  'LegacyImportApiResponse',
  'LegacyImportResult',
  'ResultResponse',
  'SuccessResultResponse',
];

/** Файлы, где рядом со служебными типами лежат публичные — перечисляются поимённо */
const EXPLICIT_FILES = ['types/common.ts', 'types/legacy/common.ts', 'types/legacy/export.ts'];

/** Собирает пути всех .ts внутри директории, включая вложенные */
const collectTypeFiles = async (dir: string): Promise<string[]> => {
  const entries = await readdir(dir, { withFileTypes: true });

  const nested = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = join(dir, entry.name);

      if (entry.isDirectory()) {
        return collectTypeFiles(entryPath);
      }

      return entry.name.endsWith('.ts') ? [entryPath] : [];
    }),
  );

  return nested.flat();
};

/** Пути вида types/models/deal.ts — в таком виде они пишутся в src/index.ts */
const typeFiles = (await collectTypeFiles(join(ROOT, 'src/types'))).map((entryPath) =>
  relative(join(ROOT, 'src'), entryPath).replaceAll('\\', '/'),
);

/** Имена типов, объявленных в файле */
const readDeclaredNames = async (file: string): Promise<string[]> => {
  const source = await readFile(join(ROOT, 'src', file), 'utf8');

  return [...source.matchAll(/^export (?:type|interface) ([A-Za-z0-9_]+)/gm)].map(
    (match) => match[1],
  );
};

/** Имена из явного списка реэкспорта для этого файла */
const readExportedNames = (file: string): string[] => {
  const escaped = file.replaceAll('.', String.raw`\.`);

  const block = new RegExp(String.raw`export type \{([^}]*)\} from '\./${escaped}'`).exec(
    indexSource,
  );

  if (block === null) {
    return [];
  }

  return block[1]
    .split(',')
    .map((name) => name.trim())
    .filter(Boolean);
};

// Проверки на этапе компиляции: если тип не экспортирован, npm run lint упадёт на tsc
const config: GetCourseConfig = {
  devKey: 'dev',
  apiKey: 'api',
  domain: 'test.getcourse.ru',
};

const logger: Logger = {
  debug: () => undefined,
  info: () => undefined,
  warn: () => undefined,
  error: () => undefined,
};

const response: ApiResponse<User> = {
  status: true,
  message: '',
  code: 200,
  errors: [],
  data: { id: 1 } as User,
};

const webhook = { id: 1, type: 'call' } as CallWebhook;

const attachment: MessageAttachment = {
  filename: 'Счёт №1024.pdf',
  content: new Uint8Array([37, 80, 68, 70]),
};

describe('публичный API пакета', () => {
  it('отдаёт клиент и как default, и как именованный экспорт', () => {
    expect(typeof api.default).toBe('function');
    expect(api.GetCourse).toBe(api.default);
  });

  it('отдаёт классы ошибок с правильной иерархией', () => {
    expect(api.GetCourseError.prototype).toBeInstanceOf(Error);
    expect(api.GetCourseApiError.prototype).toBeInstanceOf(api.GetCourseError);
    expect(api.GetCourseNetworkError.prototype).toBeInstanceOf(api.GetCourseError);
    expect(api.GetCourseValidationError.prototype).toBeInstanceOf(api.GetCourseError);
  });

  it('не отдаёт наружу внутренние классы', () => {
    expect(api).not.toHaveProperty('HttpTransport');
    expect(api).not.toHaveProperty('LegacyTransport');
    expect(api).not.toHaveProperty('ExportPoller');
    expect(api).not.toHaveProperty('ConsoleLogger');
  });

  it('реэкспортирует каждый файл типов', () => {
    const missing = typeFiles.filter((file) => !indexSource.includes(`'./${file}'`));

    expect(missing).toEqual([]);
  });

  it('перечисляет все публичные типы файлов с явным списком', async () => {
    const found = await Promise.all(
      EXPLICIT_FILES.map(async (file) => {
        const exported = readExportedNames(file);
        const declared = await readDeclaredNames(file);

        return declared
          .filter((name) => !INTERNAL_TYPES.includes(name) && !exported.includes(name))
          .map((name) => `${file}: ${name}`);
      }),
    );

    expect(found.flat()).toEqual([]);
  });

  it('не выпускает наружу служебные типы', () => {
    const leaked = EXPLICIT_FILES.flatMap((file) =>
      readExportedNames(file)
        .filter((name) => INTERNAL_TYPES.includes(name))
        .map((name) => `${file}: ${name}`),
    );

    expect(leaked).toEqual([]);
  });

  it('отдаёт наружу типы', () => {
    expect(config.domain).toBe('test.getcourse.ru');
    expect(typeof logger.debug).toBe('function');
    expect(response.data.id).toBe(1);
    expect(webhook.type).toBe('call');
    expect(attachment.filename).toBe('Счёт №1024.pdf');
  });
});
