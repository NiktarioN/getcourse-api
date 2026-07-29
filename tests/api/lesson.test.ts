import { describe, it } from 'vitest';

import gc from '../helpers/client.ts';
import envNum from '../helpers/env.ts';
import expectTrue from '../helpers/expect-true.ts';

const lessonId = envNum(process.env.TEST_LESSON_ID);
const lessonAnswerId = envNum(process.env.TEST_LESSON_ANSWER_ID);
const userId = envNum(process.env.TEST_ADMIN_USER_ID);

describe('lesson', () => {
  it.skipIf(Number.isNaN(lessonId))('getLessonAnswers', async () => {
    await expectTrue(gc.getLessonAnswers(lessonId));
  });

  it.skipIf(Number.isNaN(lessonAnswerId) || Number.isNaN(userId))(
    'addLessonAnswerComment',
    async () => {
      await expectTrue(
        gc.addLessonAnswerComment({
          lessonAnswerId,
          text: 'Тест',
          userId,
        }),
      );
    },
  );

  it.skipIf(Number.isNaN(lessonAnswerId))('changeLessonAnswerStatus', async () => {
    await expectTrue(
      gc.changeLessonAnswerStatus({
        lessonAnswerId,
        status: 'new',
      }),
    );
  });
});
