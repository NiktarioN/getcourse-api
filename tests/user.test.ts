import { describe, expect, it } from 'vitest';
import gc from './helpers/client.ts';
import { envNum } from './helpers/env.ts';

const userId = envNum(process.env.TEST_USER_ID);
const groupId = envNum(process.env.TEST_GROUP_ID);
const telegramChatId = envNum(process.env.TEST_TELEGRAM_CHAT_ID);
const diplomaTemplateId = envNum(process.env.TEST_DIPLOMA_TEMPLATE_ID);

describe('user', () => {
  it.skipIf(Number.isNaN(userId))('getUserFields', async () => {
    expect((await gc.getUserFields({ userId })).status).toBe(true);
  });

  it.skipIf(Number.isNaN(userId))('getUserCustomFields', async () => {
    expect((await gc.getUserCustomFields({ userId })).status).toBe(true);
  });

  it.skipIf(Number.isNaN(userId))('getUserBalance', async () => {
    expect((await gc.getUserBalance({ userId })).status).toBe(true);
  });

  it.skipIf(Number.isNaN(userId))('getUserDeals', async () => {
    expect((await gc.getUserDeals({ userId })).status).toBe(true);
  });

  it.skipIf(Number.isNaN(userId))('getUserPurchases', async () => {
    expect((await gc.getUserPurchases({ userId })).status).toBe(true);
  });

  it.skipIf(Number.isNaN(userId))('getUserGroups', async () => {
    expect((await gc.getUserGroups({ userId })).status).toBe(true);
  });

  it.skipIf(Number.isNaN(userId))('getUserTrainings', async () => {
    expect((await gc.getUserTrainings({ userId })).status).toBe(true);
  });

  it.skipIf(Number.isNaN(userId))('getUserLessonAnswers', async () => {
    expect((await gc.getUserLessonAnswers({ userId })).status).toBe(true);
  });

  it.skipIf(Number.isNaN(userId))('getUserAnswers', async () => {
    expect((await gc.getUserAnswers({ userId })).status).toBe(true);
  });

  it.skipIf(Number.isNaN(userId))('getUserGoalRecords', async () => {
    expect((await gc.getUserGoalRecords({ userId })).status).toBe(true);
  });

  it.skipIf(Number.isNaN(userId))('getUserSchedule', async () => {
    expect((await gc.getUserSchedule({ userId })).status).toBe(true);
  });

  it.skipIf(Number.isNaN(userId))('getUserDiplomas', async () => {
    expect((await gc.getUserDiplomas({ userId })).status).toBe(true);
  });

  it.skipIf(Number.isNaN(telegramChatId))('getUserByTelegramChatId', async () => {
    expect((await gc.getUserByTelegramChatId(telegramChatId)).status).toBe(true);
  });

  it.skipIf(Number.isNaN(userId) || Number.isNaN(groupId))('addUserGroups', async () => {
    expect((await gc.addUserGroups({ userId, groups: [groupId] })).status).toBe(true);
  });

  it.skipIf(Number.isNaN(userId) || Number.isNaN(groupId))('removeUserGroups', async () => {
    expect((await gc.removeUserGroups({ userId, groups: [groupId] })).status).toBe(true);
  });

  it.skipIf(Number.isNaN(userId) || Number.isNaN(groupId))('setUserGroups', async () => {
    expect((await gc.setUserGroups({ userId, groups: [groupId] })).status).toBe(true);
  });

  it.skipIf(Number.isNaN(userId))('setPersonalManager', async () => {
    expect((await gc.setPersonalManager({ userId, managerId: 0 })).status).toBe(true);
  });

  it.skipIf(Number.isNaN(userId))('updateUserFields', async () => {
    expect((await gc.updateUserFields({ userId })).status).toBe(true);
  });

  it.skipIf(Number.isNaN(userId))('addUserBalance', async () => {
    expect(
      (
        await gc.addUserBalance({
          userId,
          value: 10,
          type: 'virtual',
          comment: 'Тестовые рубли',
        })
      ).status,
    ).toBe(true);
  });

  it.skipIf(Number.isNaN(userId) || Number.isNaN(diplomaTemplateId))('createDiploma', async () => {
    expect(
      (
        await gc.createDiploma({
          userId,
          templateId: diplomaTemplateId,
          allowDuplicates: true,
        })
      ).status,
    ).toBe(true);
  });

  it.skipIf(Number.isNaN(userId))('updateUserCustomFields', async () => {
    expect((await gc.updateUserCustomFields({ userId, customFields: {} })).status).toBe(true);
  });
});
