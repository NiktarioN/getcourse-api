import { describe, expect, it } from 'vitest';

import gc from '../helpers/client.ts';
import envNum from '../helpers/env.ts';
import expectResultTrue from '../helpers/expect-result-true.ts';
import expectTrue from '../helpers/expect-true.ts';

const ticketId = envNum(process.env.TEST_TICKET_ID);
const userId = envNum(process.env.TEST_ADMIN_USER_ID);
const departmentId = envNum(process.env.TEST_DEPARTMENT_ID);

describe('helpdesk', () => {
  it.skipIf(Number.isNaN(ticketId))('getTicketHistory', async () => {
    await expectTrue(gc.getTicketHistory({ ticketId }));
  });

  it.skipIf(Number.isNaN(ticketId) || Number.isNaN(userId))('sendTicketMessage', async () => {
    await expectResultTrue(
      gc.sendTicketMessage({
        ticketId,
        commentText: 'Тестовый ответ в тикете',
        transport: [0],
        userId,
      }),
    );
  });

  it.skipIf(Number.isNaN(ticketId) || Number.isNaN(userId))(
    'sendTicketMessage с вложением',
    async () => {
      const before = await gc.getTicketHistory({ ticketId, limit: 50 });
      const known = new Set(before.data.map((message) => message.message_id));

      await expectResultTrue(
        gc.sendTicketMessage({
          ticketId,
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

      const after = await gc.getTicketHistory({ ticketId, limit: 50 });
      const fresh = after.data.filter((message) => !known.has(message.message_id));

      expect(fresh.flatMap((message) => message.attached_files ?? [])).toHaveLength(1);
    },
  );

  it.skipIf(Number.isNaN(ticketId) || Number.isNaN(departmentId))(
    'changeTicketDepartment',
    async () => {
      await expectResultTrue(
        gc.changeTicketDepartment({
          ticketId,
          newDepartmentId: departmentId,
        }),
      );
    },
  );

  it.skipIf(Number.isNaN(ticketId))('closeTicket', async () => {
    await expectResultTrue(
      gc.closeTicket({
        ticketId,
        closedReason: 4,
        closedComment: 'Тестовое закрытие',
      }),
    );
  });
});
