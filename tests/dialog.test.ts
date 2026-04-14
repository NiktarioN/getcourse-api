import { describe, expect, it } from 'vitest';
import gc from './helpers/client.ts';
import { envNum } from './helpers/env.ts';

const dialogId = envNum(process.env.TEST_DIALOG_ID);
const userId = envNum(process.env.TEST_USER_ID);
const departmentId = envNum(process.env.TEST_DEPARTMENT_ID);

describe('dialog', () => {
  it.skipIf(Number.isNaN(dialogId))('getDialogHistory', async () => {
    expect((await gc.getDialogHistory({ dialogId })).status).toBe(true);
  });

  it.skipIf(Number.isNaN(dialogId) || Number.isNaN(userId))('addCommentToDialog', async () => {
    expect(
      (
        await gc.addCommentToDialog({
          dialogId,
          commentText: 'Тест',
          transport: [0],
          userId,
        })
      ).status,
    ).toBe(true);
  });

  it.skipIf(Number.isNaN(dialogId) || Number.isNaN(departmentId))('changeDepartment', async () => {
    expect(
      (
        await gc.changeDepartment({
          dialogId,
          newDepartmentId: departmentId,
        })
      ).status,
    ).toBe(true);
  });

  it.skipIf(Number.isNaN(dialogId))('closeDialog', async () => {
    expect((await gc.closeDialog({ dialogId })).status).toBe(true);
  });

  it.skipIf(Number.isNaN(dialogId))('addNote', async () => {
    expect((await gc.addNote({ dialogId, text: 'Тест' })).status).toBe(true);
  });
});
