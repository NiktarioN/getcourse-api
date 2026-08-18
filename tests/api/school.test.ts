import { describe, it } from 'vitest';

import gc from '../helpers/client.ts';
import envNum from '../helpers/env.ts';
import expectTrue from '../helpers/expect-true.ts';

const surveyId = envNum(process.env.TEST_SURVEY_ID);

describe('school', () => {
  it('getGroups', async () => {
    await expectTrue(gc.getGroups());
  });

  it('getPersonalManagers', async () => {
    await expectTrue(gc.getPersonalManagers());
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
});
