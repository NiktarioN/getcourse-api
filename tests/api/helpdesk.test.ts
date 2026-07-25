import { describe, it } from 'vitest';

import gc from '../helpers/client.ts';
import { envNum } from '../helpers/env.ts';
import expectResultTrue from '../helpers/expect-result-true.ts';
import expectTrue from '../helpers/expect-true.ts';

const ticketId = envNum(process.env.TEST_TICKET_ID);
const userId = envNum(process.env.TEST_ADMIN_USER_ID);
const departmentId = envNum(process.env.TEST_DEPARTMENT_ID);

describe('helpdesk', () => {
  it.skipIf(Number.isNaN(ticketId))('helpdeskGetHistory', async () => {
    await expectTrue(gc.helpdeskGetHistory({ ticketId }));
  });

  it.skipIf(Number.isNaN(ticketId) || Number.isNaN(userId))('helpdeskAddComment', async () => {
    await expectResultTrue(
      gc.helpdeskAddComment({
        ticketId,
        commentText: 'Тестовый ответ в тикете',
        transport: [0],
        userId,
      }),
    );
  });

  it.skipIf(Number.isNaN(ticketId) || Number.isNaN(departmentId))(
    'helpdeskChangeDepartment',
    async () => {
      await expectResultTrue(
        gc.helpdeskChangeDepartment({
          ticketId,
          newDepartmentId: departmentId,
        }),
      );
    },
  );

  it.skipIf(Number.isNaN(ticketId))('helpdeskCloseTicket', async () => {
    await expectResultTrue(
      gc.helpdeskCloseTicket({
        ticketId,
        closedReason: 4,
        closedComment: 'Тестовое закрытие',
      }),
    );
  });
});
