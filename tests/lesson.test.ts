import { describe, expect, it } from 'vitest';
import gc from './helpers/client.ts';
import { envNum } from './helpers/env.ts';

const lessonId = envNum(process.env.TEST_LESSON_ID);
const lessonAnswerId = envNum(process.env.TEST_LESSON_ANSWER_ID);
const userId = envNum(process.env.TEST_ADMIN_USER_ID);

describe('lesson', () => {
  it.skipIf(Number.isNaN(lessonId))('getLessonAnswers', async () => {
    const result = await gc.getLessonAnswers(lessonId);

    globalThis.console.dir(result, { depth: null });
    expect(result.status).toBe(true);
  });

  it.skipIf(Number.isNaN(lessonAnswerId) || Number.isNaN(userId))(
    'addCommentToLessonAnswer',
    async () => {
      const result = await gc.addCommentToLessonAnswer({
        lessonAnswerId,
        text: 'Тест',
        userId,
      });

      globalThis.console.dir(result, { depth: null });
      expect(result.status).toBe(true);
    },
  );

  it.skipIf(Number.isNaN(lessonAnswerId))('changeStatusAnswers', async () => {
    const result = await gc.changeStatusAnswers({
      lessonAnswerId,
      status: 'new',
    });

    globalThis.console.dir(result, { depth: null });
    expect(result.status).toBe(true);
  });
});
