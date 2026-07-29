import { describe, expect, it } from 'vitest';

import {
  assertAttachments,
  buildAttachmentsForm,
  MAX_FILE_SIZE,
  MAX_FILES,
} from '../../src/helpers/attachments.ts';
import GetCourseValidationError from '../../src/helpers/errors/validation-error.ts';

import type { MessageAttachment, ValidationErrorDetails } from '../../src/index.ts';

const payload = { dialogId: 48812, commentText: 'Счёт во вложении', userId: 903417 };

const pdf: MessageAttachment = {
  filename: 'Счёт №1024.pdf',
  content: new Uint8Array([37, 80, 68, 70]),
};

/** Файлы формы с сужением типа — getAll отдаёт union со строкой */
const filesOf = (requestBody: FormData): File[] =>
  requestBody.getAll('attached_files[]').filter((entry) => entry instanceof File);

describe('buildAttachmentsForm', () => {
  it('кладёт тело запроса в поле payload JSON-строкой', () => {
    const requestBody = buildAttachmentsForm(payload, [pdf]);

    expect(requestBody.get('payload')).toBe(JSON.stringify(payload));
  });

  it('кладёт файлы в поле со скобками — без них GetCourse сохранит только последний', () => {
    const requestBody = buildAttachmentsForm(payload, [pdf, pdf]);

    expect(filesOf(requestBody)).toHaveLength(2);
    expect(requestBody.getAll('attached_files')).toHaveLength(0);
  });

  it('сохраняет имя файла как передали, вместе с кириллицей', () => {
    const requestBody = buildAttachmentsForm(payload, [pdf]);
    const [file] = filesOf(requestBody);

    expect(file?.name).toBe('Счёт №1024.pdf');
  });

  it('передаёт содержимое байт в байт', async () => {
    const requestBody = buildAttachmentsForm(payload, [pdf]);
    const [file] = filesOf(requestBody);
    const bytes = new Uint8Array((await file?.arrayBuffer()) ?? new ArrayBuffer(0));

    expect(bytes).toEqual(pdf.content);
  });

  it('принимает Blob без обёртки', () => {
    const content = new Blob(['Тестовое вложение']);
    const requestBody = buildAttachmentsForm(payload, [{ filename: 'note.txt', content }]);
    const [file] = filesOf(requestBody);

    expect(file?.size).toBe(content.size);
  });
});

/** Ловит ошибку валидации и отдаёт её причину — undefined, если ошибки не было */
const detailsOf = (run: () => void): ValidationErrorDetails | undefined => {
  try {
    run();
  } catch (error) {
    return error instanceof GetCourseValidationError ? error.details : undefined;
  }

  return undefined;
};

describe('assertAttachments', () => {
  // Единственное место, где лимиты записаны литералами: остальные тесты берут их
  // из кода и строят сценарии на границе, поэтому сами значения не сторожат.
  // Это внешний контракт GetCourse, проверенный на живом API 2026-07-26
  it('держит лимиты GetCourse', () => {
    expect(MAX_FILES).toBe(5);
    expect(MAX_FILE_SIZE).toBe(5 * 1024 * 1024);
  });

  it('пропускает ровно столько файлов, сколько разрешено', () => {
    const files = Array.from({ length: MAX_FILES }, () => pdf);

    expect(() => assertAttachments(files)).not.toThrow();
  });

  it('роняет файл сверх лимита и отдаёт причину кодом', () => {
    const files = Array.from({ length: MAX_FILES + 1 }, () => pdf);

    expect(detailsOf(() => assertAttachments(files))).toEqual({
      code: 'attachments_limit',
      limit: MAX_FILES,
      received: MAX_FILES + 1,
    });
  });

  it('пропускает файл ровно по лимиту размера', () => {
    const content = new Uint8Array(MAX_FILE_SIZE);

    expect(() => assertAttachments([{ filename: 'big.txt', content }])).not.toThrow();
  });

  it('роняет файл больше лимита и называет его в причине', () => {
    const content = new Uint8Array(MAX_FILE_SIZE + 1);

    expect(detailsOf(() => assertAttachments([{ filename: 'big.txt', content }]))).toEqual({
      code: 'attachment_size',
      limit: MAX_FILE_SIZE,
      filename: 'big.txt',
      size: MAX_FILE_SIZE + 1,
    });
  });

  it('считает размер и у Blob', () => {
    const content = new Blob([new Uint8Array(MAX_FILE_SIZE + 1)]);

    expect(detailsOf(() => assertAttachments([{ filename: 'big.bin', content }]))?.code).toBe(
      'attachment_size',
    );
  });

  it('различает две причины кодом, а не текстом', () => {
    const tooMany = Array.from({ length: MAX_FILES + 1 }, () => pdf);
    const tooBig = [{ filename: 'big.txt', content: new Uint8Array(MAX_FILE_SIZE + 1) }];

    expect(detailsOf(() => assertAttachments(tooMany))?.code).toBe('attachments_limit');
    expect(detailsOf(() => assertAttachments(tooBig))?.code).toBe('attachment_size');
  });
});
