import { describe, expect, it } from 'vitest';
import gc from './helpers/client.ts';
import { envNum } from './helpers/env.ts';

const userId = envNum(process.env.TEST_USER_ID);
const adminUserId = envNum(process.env.TEST_ADMIN_USER_ID);
const groupId = envNum(process.env.TEST_GROUP_ID);
const telegramChatId = envNum(process.env.TEST_TELEGRAM_CHAT_ID);
const diplomaTemplateId = envNum(process.env.TEST_DIPLOMA_TEMPLATE_ID);

describe('user', () => {
  it.skipIf(Number.isNaN(userId))('getUserFields', async () => {
    const result = await gc.getUserFields({ userId });

    globalThis.console.dir(result, { depth: null });
    expect(result.status).toBe(true);
  });

  it.skipIf(Number.isNaN(userId))('getUserCustomFields', async () => {
    const result = await gc.getUserCustomFields({ userId });

    globalThis.console.dir(result, { depth: null });
    expect(result.status).toBe(true);
  });

  it.skipIf(Number.isNaN(userId))('getUserBalance', async () => {
    const result = await gc.getUserBalance({ userId });

    globalThis.console.dir(result, { depth: null });
    expect(result.status).toBe(true);
  });

  it.skipIf(Number.isNaN(userId))('getUserDeals', async () => {
    const result = await gc.getUserDeals({ userId });

    globalThis.console.dir(result, { depth: null });
    expect(result.status).toBe(true);
  });

  it.skipIf(Number.isNaN(userId))('getUserPurchases', async () => {
    const result = await gc.getUserPurchases({ userId });

    globalThis.console.dir(result, { depth: null });
    expect(result.status).toBe(true);
  });

  it.skipIf(Number.isNaN(userId))('getUserGroups', async () => {
    const result = await gc.getUserGroups({ userId });

    globalThis.console.dir(result, { depth: null });
    expect(result.status).toBe(true);
  });

  it.skipIf(Number.isNaN(userId))('getUserTrainings', async () => {
    const result = await gc.getUserTrainings({ userId });

    globalThis.console.dir(result, { depth: null });
    expect(result.status).toBe(true);
  });

  it.skipIf(Number.isNaN(userId))('getUserLessonAnswers', async () => {
    const result = await gc.getUserLessonAnswers({ userId });

    globalThis.console.dir(result, { depth: null });
    expect(result.status).toBe(true);
  });

  it.skipIf(Number.isNaN(userId))('getUserAnswers', async () => {
    const result = await gc.getUserAnswers({ userId });

    globalThis.console.dir(result, { depth: null });
    expect(result.status).toBe(true);
  });

  it.skipIf(Number.isNaN(userId))('getUserGoalRecords', async () => {
    const result = await gc.getUserGoalRecords({ userId });

    globalThis.console.dir(result, { depth: null });
    expect(result.status).toBe(true);
  });

  it.skipIf(Number.isNaN(userId))('getUserSchedule', async () => {
    const result = await gc.getUserSchedule({ userId });

    globalThis.console.dir(result, { depth: null });
    expect(result.status).toBe(true);
  });

  it.skipIf(Number.isNaN(userId))('getUserDiplomas', async () => {
    const result = await gc.getUserDiplomas({ userId });

    globalThis.console.dir(result, { depth: null });
    expect(result.status).toBe(true);
  });

  it.skipIf(Number.isNaN(telegramChatId))('getUserByTelegramChatId', async () => {
    const result = await gc.getUserByTelegramChatId(telegramChatId);

    globalThis.console.dir(result, { depth: null });
    expect(result.status).toBe(true);
  });

  it.skipIf(Number.isNaN(userId) || Number.isNaN(groupId))('addUserGroups', async () => {
    const result = await gc.addUserGroups({ userId, groups: [groupId] });

    globalThis.console.dir(result, { depth: null });
    expect(result.status).toBe(true);
  });

  it.skipIf(Number.isNaN(userId) || Number.isNaN(groupId))('removeUserGroups', async () => {
    const result = await gc.removeUserGroups({ userId, groups: [groupId] });

    globalThis.console.dir(result, { depth: null });
    expect(result.status).toBe(true);
  });

  it.skipIf(Number.isNaN(userId) || Number.isNaN(groupId))('setUserGroups', async () => {
    const result = await gc.setUserGroups({ userId, groups: [groupId] });

    globalThis.console.dir(result, { depth: null });
    expect(result.status).toBe(true);
  });

  it.skipIf(Number.isNaN(userId))('setPersonalManager', async () => {
    const result = await gc.setPersonalManager({ userId, managerId: adminUserId });

    globalThis.console.dir(result, { depth: null });
    expect(result.status).toBe(true);
  });

  it.skipIf(Number.isNaN(userId))('updateUserFields', async () => {
    const result = await gc.updateUserFields({ userId, comment: 'Тестовый комментарий' });

    globalThis.console.dir(result, { depth: null });
    expect(result.status).toBe(true);
  });

  it.skipIf(Number.isNaN(userId) || Number.isNaN(adminUserId))('addCommentToUser', async () => {
    const result = await gc.addCommentToUser({
      userId,
      authorId: adminUserId,
      text: 'Тестовый комментарий в пользователя',
    });

    globalThis.console.dir(result, { depth: null });
    expect(result.status).toBe(true);
  });

  it.skipIf(Number.isNaN(userId))('addUserBalance', async () => {
    const result = await gc.addUserBalance({
      userId,
      value: 10,
      type: 'virtual',
      comment: 'Тестовые рубли',
    });

    globalThis.console.dir(result, { depth: null });
    expect(result.status).toBe(true);
  });

  it.skipIf(Number.isNaN(userId) || Number.isNaN(diplomaTemplateId))('createDiploma', async () => {
    const result = await gc.createDiploma({
      userId,
      templateId: diplomaTemplateId,
      allowDuplicates: true,
    });

    globalThis.console.dir(result, { depth: null });
    expect(result.status).toBe(true);
  });

  it.skipIf(Number.isNaN(userId))('updateUserCustomFields', async () => {
    const result = await gc.updateUserCustomFields({ userId, customFields: {} });

    globalThis.console.dir(result, { depth: null });
    expect(result.status).toBe(true);
  });
});
