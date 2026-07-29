import { describe, expect, it } from 'vitest';

import gc from '../helpers/client.ts';
import envNum from '../helpers/env.ts';
import expectResultTrue from '../helpers/expect-result-true.ts';
import expectTrue from '../helpers/expect-true.ts';

const dialogId = envNum(process.env.TEST_DIALOG_ID);
const userId = envNum(process.env.TEST_ADMIN_USER_ID);
const departmentId = envNum(process.env.TEST_DEPARTMENT_ID);

describe('dialog', () => {
  it.skipIf(Number.isNaN(dialogId))('getDialogHistory', async () => {
    await expectTrue(gc.getDialogHistory({ dialogId }));
  });

  it.skipIf(Number.isNaN(dialogId) || Number.isNaN(userId))('sendDialogMessage', async () => {
    await expectResultTrue(
      gc.sendDialogMessage({
        dialogId,
        commentText: 'Тестовый ответ в диалоге',
        transport: [0],
        userId,
      }),
    );
  });

  it.skipIf(Number.isNaN(dialogId) || Number.isNaN(userId))(
    'sendDialogMessage с вложением',
    async () => {
      const before = await gc.getDialogHistory({ dialogId, limit: 50 });
      const known = new Set(before.data.map((message) => message.message_id));

      await expectResultTrue(
        gc.sendDialogMessage({
          dialogId,
          commentText: 'Тестовый ответ с вложением',
          transport: [0],
          userId,
          attachedFiles: [
            {
              filename: 'Тестовое вложение.txt',
              content: new TextEncoder().encode('Содержимое тестового вложения'),
            },
          ],
        }),
      );

      const after = await gc.getDialogHistory({ dialogId, limit: 50 });
      const fresh = after.data.filter((message) => !known.has(message.message_id));

      expect(fresh.flatMap((message) => message.attached_files ?? [])).toHaveLength(1);
    },
  );

  it.skipIf(Number.isNaN(dialogId))('addDialogNote', async () => {
    await expectTrue(gc.addDialogNote({ dialogId, text: 'Тестовая заметка в диалоге' }));
  });

  it.skipIf(Number.isNaN(dialogId) || Number.isNaN(departmentId))(
    'changeDialogDepartment',
    async () => {
      await expectResultTrue(
        gc.changeDialogDepartment({
          dialogId,
          newDepartmentId: departmentId,
        }),
      );
    },
  );

  it.skipIf(Number.isNaN(dialogId))('closeDialog', async () => {
    await expectResultTrue(gc.closeDialog({ dialogId }));
  });
});
