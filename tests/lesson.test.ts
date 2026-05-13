import { describe, expect, it } from 'vitest';
import gc from './helpers/client.ts';
import { envNum } from './helpers/env.ts';

const lessonAnswerId = envNum(process.env.TEST_LESSON_ANSWER_ID);
const userId = envNum(process.env.TEST_USER_ID);

describe('lesson', () => {
  it('getLessonAnswers', async () => {
    const result = await gc.getLessonAnswers();

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
      status: 'viewed',
    });

    globalThis.console.dir(result, { depth: null });
    expect(result.status).toBe(true);
  });
});
