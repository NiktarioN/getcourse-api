import { describe, expect, it } from 'vitest';
import gc from './helpers/client.ts';
import { envNum } from './helpers/env.ts';

const webinarId = envNum(process.env.TEST_WEBINAR_ID);
const webinarCommentId = envNum(process.env.TEST_WEBINAR_COMMENT_ID);
const userId = envNum(process.env.TEST_USER_ID);

describe('webinar', () => {
  it('getAllWebinars', async () => {
    expect((await gc.getAllWebinars()).status).toBe(true);
  });

  it.skipIf(Number.isNaN(webinarId))('getWebinarsByIds', async () => {
    expect((await gc.getWebinarsByIds({ ids: [webinarId] })).status).toBe(true);
  });

  it.skipIf(Number.isNaN(webinarId) || Number.isNaN(userId))('addCommentToWebinar', async () => {
    expect(
      (
        await gc.addCommentToWebinar({
          webinarId,
          moderatorId: userId,
          text: 'Тест',
        })
      ).status,
    ).toBe(true);
  });

  it.skipIf(Number.isNaN(webinarId) || Number.isNaN(webinarCommentId) || Number.isNaN(userId))(
    'moderateWebinarComment',
    async () => {
      expect(
        (
          await gc.moderateWebinarComment({
            webinarId,
            commentId: webinarCommentId,
            action: 'delete',
            moderatorId: userId,
          })
        ).status,
      ).toBe(true);
    },
  );

  it.skipIf(Number.isNaN(webinarId) || Number.isNaN(userId))('moderateWebinarUser', async () => {
    expect(
      (
        await gc.moderateWebinarUser({
          webinarId,
          userId,
          userType: 0,
          action: 'isolation',
        })
      ).status,
    ).toBe(true);
  });
});
