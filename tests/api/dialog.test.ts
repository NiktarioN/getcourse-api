import { describe, it } from 'vitest';

import gc from '../helpers/client.ts';
import { envNum } from '../helpers/env.ts';
import expectResultTrue from '../helpers/expect-result-true.ts';
import expectTrue from '../helpers/expect-true.ts';

const dialogId = envNum(process.env.TEST_DIALOG_ID);
const userId = envNum(process.env.TEST_ADMIN_USER_ID);
const departmentId = envNum(process.env.TEST_DEPARTMENT_ID);

describe('dialog', () => {
  it.skipIf(Number.isNaN(dialogId))('getDialogHistory', async () => {
    await expectTrue(gc.getDialogHistory({ dialogId }));
  });

  it.skipIf(Number.isNaN(dialogId) || Number.isNaN(userId))('addCommentToDialog', async () => {
    await expectResultTrue(
      gc.addCommentToDialog({
        dialogId,
        commentText: 'Тестовый ответ в диалоге',
        transport: [0],
        userId,
      }),
    );
  });

  it.skipIf(Number.isNaN(dialogId) || Number.isNaN(departmentId))('changeDepartment', async () => {
    await expectResultTrue(
      gc.changeDepartment({
        dialogId,
        newDepartmentId: departmentId,
      }),
    );
  });

  it.skipIf(Number.isNaN(dialogId))('closeDialog', async () => {
    await expectResultTrue(gc.closeDialog({ dialogId }));
  });

  it.skipIf(Number.isNaN(dialogId))('addNote', async () => {
    await expectTrue(gc.addNote({ dialogId, text: 'Тестовая заметка в диалоге' }));
  });
});
