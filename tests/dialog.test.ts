import { describe, expect, it } from 'vitest';
import gc from './helpers/client.ts';
import { envNum } from './helpers/env.ts';

const dialogId = envNum(process.env.TEST_DIALOG_ID);
const userId = envNum(process.env.TEST_ADMIN_USER_ID);
const departmentId = envNum(process.env.TEST_DEPARTMENT_ID);

describe('dialog', () => {
  it.skipIf(Number.isNaN(dialogId))('getDialogHistory', async () => {
    const result = await gc.getDialogHistory({ dialogId: 318232881 });

    globalThis.console.dir(result, { depth: null });
    expect(result.status).toBe(true);
  });

  it.skipIf(Number.isNaN(dialogId) || Number.isNaN(userId))('addCommentToDialog', async () => {
    const result = await gc.addCommentToDialog({
      dialogId,
      commentText: 'Тестовый ответ в диалоге',
      transport: [0],
      userId,
    });

    globalThis.console.dir(result, { depth: null });
    expect(result.status).toBe(true);
  });

  it.skipIf(Number.isNaN(dialogId) || Number.isNaN(departmentId))('changeDepartment', async () => {
    const result = await gc.changeDepartment({
      dialogId,
      newDepartmentId: departmentId,
    });

    globalThis.console.dir(result, { depth: null });
    expect(result.status).toBe(true);
  });

  it.skipIf(Number.isNaN(dialogId))('closeDialog', async () => {
    const result = await gc.closeDialog({ dialogId });

    globalThis.console.dir(result, { depth: null });
    expect(result.status).toBe(true);
  });

  it.skipIf(Number.isNaN(dialogId))('addNote', async () => {
    const result = await gc.addNote({ dialogId, text: 'Тестовая заметка в диалоге' });

    globalThis.console.dir(result, { depth: null });
    expect(result.status).toBe(true);
  });
});
