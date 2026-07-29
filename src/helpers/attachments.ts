import GetCourseValidationError from './errors/validation-error.ts';

import type { MessageAttachment } from '../types/models/dialog.ts';

export const MAX_FILES = 5;

const MAX_FILE_SIZE_MB = 5;

export const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024;

/** Размер вложения в байтах */
function attachmentSize(content: Uint8Array | Blob): number {
  return content instanceof Blob ? content.size : content.byteLength;
}

export function assertAttachments(files: MessageAttachment[]): void {
  if (files.length > MAX_FILES) {
    throw new GetCourseValidationError({
      message: `Можно приложить не больше ${MAX_FILES} файлов, передано ${files.length}`,
      details: { code: 'attachments_limit', limit: MAX_FILES, received: files.length },
    });
  }

  const measured = files.map((file) => ({ file, size: attachmentSize(file.content) }));
  const oversized = measured.find((entry) => entry.size > MAX_FILE_SIZE);

  if (oversized !== undefined) {
    throw new GetCourseValidationError({
      message: `Файл «${oversized.file.filename}» больше ${MAX_FILE_SIZE_MB} МБ`,
      details: {
        code: 'attachment_size',
        limit: MAX_FILE_SIZE,
        filename: oversized.file.filename,
        size: oversized.size,
      },
    });
  }
}

export function buildAttachmentsForm(payload: object, files: MessageAttachment[]): FormData {
  const requestBody = new FormData();

  requestBody.append('payload', JSON.stringify(payload));

  files.forEach((file) => {
    // Blob принимает любой ArrayBufferView, но типы TypeScript сужают BlobPart до
    // Uint8Array<ArrayBuffer> и отвергают широкий Uint8Array — приведение вместо копии
    const content = file.content as Blob | Uint8Array<ArrayBuffer>;
    const blob = content instanceof Blob ? content : new Blob([content]);

    requestBody.append('attached_files[]', blob, file.filename);
  });

  return requestBody;
}
