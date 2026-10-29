import { describe, expect, it } from 'vitest';

import gc from '../helpers/client.ts';
import envNum from '../helpers/env.ts';
import expectTrue from '../helpers/expect-true.ts';

const surveyId = envNum(process.env.TEST_SURVEY_ID);
const mailingId = envNum(process.env.TEST_MAILING_ID);

describe('school', () => {
  it('getGroups', async () => {
    await expectTrue(gc.getGroups());
  });

  it('getManagers', async () => {
    await expectTrue(gc.getManagers());
  });

  it('getTrainings', async () => {
    await expectTrue(gc.getTrainings());
  });

  it('getDepartments', async () => {
    await expectTrue(gc.getDepartments());
  });

  it.skipIf(Number.isNaN(surveyId))('getSurveyAnswers', async () => {
    await expectTrue(gc.getSurveyAnswers({ surveyId }));
  });

  it('getMailings', async () => {
    await expectTrue(gc.getMailings({ limit: 5 }));
  });

  it('getMailings: с настройками', async () => {
    const response = await gc.getMailings({ showInfo: true, limit: 5 });

    globalThis.console.dir(
      response.data.map((mailing) => mailing.params),
      { depth: null },
    );

    expect(response.status).toBe(true);
    expect(response.data.every((mailing) => Object.hasOwn(mailing, 'params'))).toBe(true);
  });

  it.skipIf(Number.isNaN(mailingId))('getMailingContent', async () => {
    await expectTrue(gc.getMailingContent(mailingId));
  });

  it.skipIf(Number.isNaN(mailingId))('getMailingStats', async () => {
    const response = await gc.getMailingStats({ ids: [mailingId] });

    globalThis.console.dir(response, { depth: null });
    expect(response.status).toBe(true);
    expect(Object.keys(response.data)).toEqual([String(mailingId)]);
  });

  it('getAchievementResults', async () => {
    await expectTrue(gc.getAchievementResults({ limit: 5 }));
  });
});
