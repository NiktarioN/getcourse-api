import { describe, expect, it } from 'vitest';
import gc from './helpers/client.ts';
import { envNum } from './helpers/env.ts';

const lessonAnswerId = envNum(process.env.TEST_LESSON_ANSWER_ID);
const userId = envNum(process.env.TEST_USER_ID);

describe('lesson', () => {
  it('getLessonAnswers', async () => {
    expect((await gc.getLessonAnswers()).status).toBe(true);
  });

  it.skipIf(Number.isNaN(lessonAnswerId) || Number.isNaN(userId))(
    'addCommentToLessonAnswer',
    async () => {
      expect(
        (
          await gc.addCommentToLessonAnswer({
            lessonAnswerId,
            text: 'Тест',
            userId,
          })
        ).status,
      ).toBe(true);
    },
  );

  it.skipIf(Number.isNaN(lessonAnswerId))('changeStatusAnswers', async () => {
    expect(
      (
        await gc.changeStatusAnswers({
          lessonAnswerId,
          status: 'viewed',
        })
      ).status,
    ).toBe(true);
  });
});
