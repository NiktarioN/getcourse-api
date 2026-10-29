import { AxiosError } from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { AxiosStatic, CreateAxiosDefaults } from 'axios';

/** vi.mock поднимается наверх файла, поэтому общие переменные создаются через vi.hoisted */
const { get, createdConfigs } = vi.hoisted(() => ({
  get: vi.fn(),
  createdConfigs: [] as CreateAxiosDefaults[],
}));

vi.mock('axios', () => ({
  default: {
    create: (config: CreateAxiosDefaults) => {
      createdConfigs.push(config);

      return { post: vi.fn(), get };
    },
  },
  AxiosError: class extends Error {},
}));

const { default: HttpTransport } = await import('../../src/helpers/transport.ts');
const { default: realAxios } = await vi.importActual<{ default: AxiosStatic }>('axios');
const baseUrl = 'https://test.getcourse.ru/pl/api/v1';

const transport = new HttpTransport({
  baseUrl,
  token: 'Bearer dev_api',
  logLevel: 'silent',
});

const [clientConfig] = createdConfigs;

if (createdConfigs.length !== 1 || clientConfig === undefined) {
  throw new Error('Транспорт должен вызвать axios.create ровно один раз');
}

/** Настоящий клиент axios с конфигом, с которым транспорт вызвал axios.create */
const realClient = realAxios.create(clientConfig);
const ids = [11729467, 11729468];
/** Параметры, которые транспорт отдал axios в первом вызове */
const sentParams = (): unknown => (get.mock.calls[0]?.[1] as { params: unknown }).params;

/** Адрес запроса, который соберёт клиент axios с конфигом транспорта из этих параметров */
const sentQuery = (): string =>
  decodeURIComponent(realClient.getUri({ url: 'path', params: sentParams() }));

/** Ошибка axios с ответом сервера */
const httpError = (status: number, data: unknown): AxiosError =>
  Object.assign(new AxiosError(`Request failed with status code ${status}`), {
    response: { status, data },
  });

describe('get — параметры запроса', () => {
  beforeEach(() => {
    get.mockReset();

    get.mockResolvedValue({
      data: { status: true, message: '', code: 200, errors: [], data: [] },
    });
  });

  it('отдаёт массив массивом строк, а не строкой через запятую', async () => {
    await transport.get('common/get-mailing-stat', { ids });

    expect(sentParams()).toEqual({ ids: ['11729467', '11729468'] });
  });

  it('массив уходит в запрос как ids[]', async () => {
    await transport.get('common/get-mailing-stat', { ids });

    expect(sentQuery()).toBe(`${baseUrl}/path?ids[]=11729467&ids[]=11729468`);
  });

  it('пустой массив не попадает в запрос', async () => {
    await transport.get('common/get-mailing-stat', { ids: [] });

    expect(sentQuery()).toBe(`${baseUrl}/path`);
  });

  it('убирает пустые элементы массива, как пустые параметры', async () => {
    await transport.get('common/get-mailing-stat', {
      ids: [11729467, null, undefined, '', 11729468],
    });

    expect(sentParams()).toEqual({ ids: ['11729467', '11729468'] });
  });

  it('скаляры приводит к строке, пустые значения убирает', async () => {
    await transport.get('common/get-mailing', {
      limit: 5,
      showInfo: true,
      title: '',
      parentId: undefined,
      categoryId: null,
    });

    expect(sentParams()).toEqual({ limit: '5', showInfo: 'true' });
  });
});

describe('get — ошибки', () => {
  beforeEach(() => {
    get.mockReset();
  });

  it('HTML вместо JSON превращает в GetCourseApiError с HTTP-кодом', async () => {
    get.mockRejectedValue(httpError(414, '<html>414 Request-URI Too Large</html>'));

    await expect(transport.get('common/get-mailing-stat', { ids })).rejects.toMatchObject({
      name: 'GetCourseApiError',
      statusCode: 414,
      apiCode: 414,
      message: 'HTTP 414',
    });
  });

  it('404 с телом API отдаёт текст ошибки из тела', async () => {
    get.mockRejectedValue(
      httpError(404, {
        status: false,
        message: 'Mailing 11729467 is not found',
        code: 404,
        errors: [],
        data: [],
      }),
    );

    await expect(
      transport.get('common/get-mailing-content', { id: 11729467 }),
    ).rejects.toMatchObject({
      name: 'GetCourseApiError',
      statusCode: 404,
      message: 'Mailing 11729467 is not found',
    });
  });
});

describe('getRaw', () => {
  beforeEach(() => {
    get.mockReset();
  });

  it('отдаёт тело ответа как есть', async () => {
    const body = { success: 'OK', hooks: [], unsubscribed: [], not_found: [] };

    get.mockResolvedValue({ data: body });

    await expect(transport.getRaw('list-uri')).resolves.toEqual(body);
    expect(get).toHaveBeenCalledWith('list-uri');
  });

  it('тело без success превращает в GetCourseApiError', async () => {
    get.mockResolvedValue({
      data: { status: 200, code: 0, message: 'Доступ к API заблокирован: аккаунт не оплачен.' },
    });

    await expect(transport.getRaw('list-uri')).rejects.toMatchObject({
      name: 'GetCourseApiError',
      message: 'Доступ к API заблокирован: аккаунт не оплачен.',
      statusCode: 200,
      apiCode: 0,
    });
  });
});
