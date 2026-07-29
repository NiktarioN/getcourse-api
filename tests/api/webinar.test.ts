import { describe, it } from 'vitest';

import gc from '../helpers/client.ts';
import envNum from '../helpers/env.ts';
import expectTrue from '../helpers/expect-true.ts';

const webinarId = envNum(process.env.TEST_WEBINAR_ID);
const webinarMessageId = envNum(process.env.TEST_WEBINAR_MESSAGE_ID);
const userId = envNum(process.env.TEST_ADMIN_USER_ID);

describe('webinar', () => {
  it('getWebinars', async () => {
    await expectTrue(gc.getWebinars());
  });

  it.skipIf(Number.isNaN(webinarId))('getWebinarsByIds', async () => {
    await expectTrue(gc.getWebinarsByIds({ ids: [webinarId] }));
  });

  it.skipIf(Number.isNaN(webinarId) || Number.isNaN(userId))('sendWebinarMessage', async () => {
    await expectTrue(
      gc.sendWebinarMessage({
        webinarId,
        moderatorId: userId,
        text: 'Тест',
      }),
    );
  });

  it.skipIf(Number.isNaN(webinarId) || Number.isNaN(webinarMessageId) || Number.isNaN(userId))(
    'moderateWebinarMessage',
    async () => {
      await expectTrue(
        gc.moderateWebinarMessage({
          webinarId,
          commentId: webinarMessageId,
          action: 'delete',
          moderatorId: userId,
        }),
      );
    },
  );

  it.skipIf(Number.isNaN(webinarId) || Number.isNaN(userId))('moderateWebinarUser', async () => {
    await expectTrue(
      gc.moderateWebinarUser({
        webinarId,
        userId,
        userType: 1,
        action: 'isolation',
        moderatorId: userId,
      }),
    );
  });
});
