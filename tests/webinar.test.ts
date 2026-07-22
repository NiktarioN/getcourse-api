import { describe, it } from 'vitest';

import gc from './helpers/client.ts';
import { envNum } from './helpers/env.ts';
import expectTrue from './helpers/expect-true.ts';

const webinarId = envNum(process.env.TEST_WEBINAR_ID);
const webinarCommentId = envNum(process.env.TEST_WEBINAR_COMMENT_ID);
const userId = envNum(process.env.TEST_ADMIN_USER_ID);

describe('webinar', () => {
  it('getAllWebinars', async () => {
    await expectTrue(gc.getAllWebinars());
  });

  it.skipIf(Number.isNaN(webinarId))('getWebinarsByIds', async () => {
    await expectTrue(gc.getWebinarsByIds({ ids: [webinarId] }));
  });

  it.skipIf(Number.isNaN(webinarId) || Number.isNaN(userId))('addCommentToWebinar', async () => {
    await expectTrue(
      gc.addCommentToWebinar({
        webinarId,
        moderatorId: userId,
        text: 'Тест',
      }),
    );
  });

  it.skipIf(Number.isNaN(webinarId) || Number.isNaN(webinarCommentId) || Number.isNaN(userId))(
    'moderateWebinarComment',
    async () => {
      await expectTrue(
        gc.moderateWebinarComment({
          webinarId,
          commentId: webinarCommentId,
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
