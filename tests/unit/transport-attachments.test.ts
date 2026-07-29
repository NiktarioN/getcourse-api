import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { MessageAttachment } from '../../src/index.ts';

const post = vi.fn();

vi.mock('axios', () => ({
  default: { create: () => ({ post, get: vi.fn() }) },
  AxiosError: class AxiosError extends Error {},
}));

const { default: HttpTransport } = await import('../../src/helpers/transport.ts');
const payload = { dialogId: 48812, commentText: 'Счёт во вложении', userId: 903417 };

const pdf: MessageAttachment = {
  filename: 'Счёт №1024.pdf',
  content: new Uint8Array([37, 80, 68, 70]),
};

const transport = new HttpTransport({
  baseUrl: 'https://test.getcourse.ru/pl/api/v1',
  token: 'Bearer dev_api',
  logLevel: 'silent',
});

describe('postWithAttachments', () => {
  beforeEach(() => {
    post.mockReset();

    post.mockResolvedValue({
      data: { status: true, message: '', code: 200, errors: [], data: { result: true } },
    });
  });

  it('без файлов отправляет прежний JSON', async () => {
    await transport.postWithAttachments('dialog/add-comment', payload);

    expect(post).toHaveBeenCalledWith('dialog/add-comment', payload);
  });

  it('с пустым списком файлов тоже отправляет JSON', async () => {
    await transport.postWithAttachments('dialog/add-comment', payload, []);

    expect(post).toHaveBeenCalledWith('dialog/add-comment', payload);
  });

  it('с файлами отправляет форму, а не объект', async () => {
    await transport.postWithAttachments('dialog/add-comment', payload, [pdf]);

    const body = post.mock.calls[0]?.[1] as unknown;

    expect(body).toBeInstanceOf(FormData);
  });

  it('кладёт в форму тело запроса и файл', async () => {
    await transport.postWithAttachments('dialog/add-comment', payload, [pdf]);

    const requestBody = post.mock.calls[0]?.[1] as FormData;

    expect(requestBody.get('payload')).toBe(JSON.stringify(payload));
    expect(requestBody.getAll('attached_files[]')).toHaveLength(1);
  });

  it('не отправляет запрос, если лимит превышен', async () => {
    const files = Array.from({ length: 6 }, () => pdf);

    await expect(
      transport.postWithAttachments('dialog/add-comment', payload, files),
    ).rejects.toThrow('не больше 5 файлов');

    expect(post).not.toHaveBeenCalled();
  });
});
