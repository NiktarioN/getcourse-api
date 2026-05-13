import { describe, expect, it } from 'vitest';
import gc from './helpers/client.ts';
import { envNum } from './helpers/env.ts';

const webinarId = envNum(process.env.TEST_WEBINAR_ID);
const webinarCommentId = envNum(process.env.TEST_WEBINAR_COMMENT_ID);
const userId = envNum(process.env.TEST_ADMIN_USER_ID);

describe('webinar', () => {
  it('getAllWebinars', async () => {
    const result = await gc.getAllWebinars();

    globalThis.console.dir(result, { depth: null });
    expect(result.status).toBe(true);
  });

  it.skipIf(Number.isNaN(webinarId))('getWebinarsByIds', async () => {
    const result = await gc.getWebinarsByIds({ ids: [webinarId] });

    globalThis.console.dir(result, { depth: null });
    expect(result.status).toBe(true);
  });

  it.skipIf(Number.isNaN(webinarId) || Number.isNaN(userId))('addCommentToWebinar', async () => {
    const result = await gc.addCommentToWebinar({
      webinarId,
      moderatorId: userId,
      text: 'Тест',
    });

    globalThis.console.dir(result, { depth: null });
    expect(result.status).toBe(true);
  });

  it.skipIf(Number.isNaN(webinarId) || Number.isNaN(webinarCommentId) || Number.isNaN(userId))(
    'moderateWebinarComment',
    async () => {
      const result = await gc.moderateWebinarComment({
        webinarId,
        commentId: webinarCommentId,
        action: 'delete',
        moderatorId: userId,
      });

      globalThis.console.dir(result, { depth: null });
      expect(result.status).toBe(true);
    },
  );

  it.skipIf(Number.isNaN(webinarId) || Number.isNaN(userId))('moderateWebinarUser', async () => {
    const result = await gc.moderateWebinarUser({
      webinarId,
      userId,
      userType: 1,
      action: 'isolation',
      moderatorId: userId,
    });

    globalThis.console.dir(result, { depth: null });
    expect(result.status).toBe(true);
  });
});
