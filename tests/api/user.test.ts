import { describe, expect, it } from 'vitest';

import gc from '../helpers/client.ts';
import envNum from '../helpers/env.ts';
import expectResultTrue from '../helpers/expect-result-true.ts';
import expectTrue from '../helpers/expect-true.ts';

const userId = envNum(process.env.TEST_USER_ID);
const adminUserId = envNum(process.env.TEST_ADMIN_USER_ID);
const groupId = envNum(process.env.TEST_GROUP_ID);
const telegramChatId = envNum(process.env.TEST_TELEGRAM_CHAT_ID);
const vkChatId = envNum(process.env.TEST_VK_CHAT_ID);
const maxChatId = envNum(process.env.TEST_MAX_CHAT_ID);
const diplomaTemplateId = envNum(process.env.TEST_DIPLOMA_TEMPLATE_ID);
const userPhone = process.env.TEST_USER_PHONE ?? '';

describe('user', () => {
  it.skipIf(Number.isNaN(userId))('getUserInfo через ID или почту', async () => {
    const response = await gc.getUserInfo({ userId });

    globalThis.console.dir(response, { depth: null });
    expect(response.status).toBe(true);
    expect(typeof response.data.id).toBe('number');
  });

  it.skipIf(!userPhone)('getUserInfo по телефону', async () => {
    const response = await gc.getUserInfo({ phone: userPhone });

    globalThis.console.dir(response, { depth: null });
    expect(response.status).toBe(true);
    expect(Object.values(response.data).every((user) => typeof user.id === 'number')).toBe(true);
  });

  it.skipIf(Number.isNaN(userId))('getUserCustomFields', async () => {
    await expectTrue(gc.getUserCustomFields({ userId }));
  });

  it.skipIf(Number.isNaN(userId))('getUserBalance', async () => {
    await expectTrue(gc.getUserBalance({ userId }));
  });

  it.skipIf(Number.isNaN(userId))('getUserDeals', async () => {
    await expectTrue(gc.getUserDeals({ userId }));
  });

  it.skipIf(Number.isNaN(userId))('getUserPurchases', async () => {
    await expectTrue(gc.getUserPurchases({ userId }));
  });

  it.skipIf(Number.isNaN(userId))('getUserGroups', async () => {
    await expectTrue(gc.getUserGroups({ userId }));
  });

  it.skipIf(Number.isNaN(userId))('getUserTrainings', async () => {
    await expectTrue(gc.getUserTrainings({ userId }));
  });

  it.skipIf(Number.isNaN(userId))('getUserLessonAnswers', async () => {
    await expectTrue(gc.getUserLessonAnswers({ userId }));
  });

  it.skipIf(Number.isNaN(userId))('getUserSurveyAnswers', async () => {
    await expectTrue(gc.getUserSurveyAnswers({ userId }));
  });

  it.skipIf(Number.isNaN(userId))('getUserGoalRecords', async () => {
    await expectTrue(gc.getUserGoalRecords({ userId }));
  });

  it.skipIf(Number.isNaN(userId))('getUserSchedule', async () => {
    await expectTrue(gc.getUserSchedule({ userId }));
  });

  it.skipIf(Number.isNaN(userId))('getUserDiplomas', async () => {
    await expectTrue(gc.getUserDiplomas({ userId }));
  });

  it.skipIf(Number.isNaN(userId))('getUserDialogs', async () => {
    await expectTrue(gc.getUserDialogs({ userId }));
  });

  it.skipIf(Number.isNaN(userId))('getUserTickets', async () => {
    await expectTrue(gc.getUserTickets({ userId }));
  });

  it.skipIf(Number.isNaN(telegramChatId))('getUserByTelegramChatId', async () => {
    await expectTrue(gc.getUserByTelegramChatId(telegramChatId));
  });

  it.skipIf(Number.isNaN(telegramChatId))('getUserByChatId: tg', async () => {
    await expectTrue(gc.getUserByChatId({ messengerType: 'tg', chatId: telegramChatId }));
  });

  it.skipIf(Number.isNaN(vkChatId))('getUserByChatId: vk', async () => {
    await expectTrue(gc.getUserByChatId({ messengerType: 'vk', chatId: vkChatId }));
  });

  it.skipIf(Number.isNaN(maxChatId))('getUserByChatId: max', async () => {
    await expectTrue(gc.getUserByChatId({ messengerType: 'max', chatId: maxChatId }));
  });

  it.skipIf(Number.isNaN(userId) || Number.isNaN(groupId))('addUserGroups', async () => {
    await expectTrue(gc.addUserGroups({ userId, groups: [groupId] }));
  });

  it.skipIf(Number.isNaN(userId) || Number.isNaN(groupId))('removeUserGroups', async () => {
    await expectTrue(gc.removeUserGroups({ userId, groups: [groupId] }));
  });

  it.skipIf(Number.isNaN(userId) || Number.isNaN(groupId))('setUserGroups', async () => {
    await expectTrue(gc.setUserGroups({ userId, groups: [groupId] }));
  });

  it.skipIf(Number.isNaN(userId))('setPersonalManager', async () => {
    await expectTrue(gc.setPersonalManager({ userId, managerId: adminUserId }));
  });

  it.skipIf(Number.isNaN(userId))('updateUserInfo', async () => {
    await expectTrue(gc.updateUserInfo({ userId, comment: 'Тестовый комментарий' }));
  });

  it.skipIf(Number.isNaN(userId) || Number.isNaN(adminUserId))('addUserComment', async () => {
    await expectResultTrue(
      gc.addUserComment({
        userId,
        authorId: adminUserId,
        text: 'Тестовый комментарий в пользователя',
      }),
    );
  });

  it.skipIf(Number.isNaN(userId))('addUserBalance', async () => {
    await expectTrue(
      gc.addUserBalance({
        userId,
        value: 10,
        type: 'virtual',
        comment: 'Тестовые рубли',
      }),
    );
  });

  it.skipIf(Number.isNaN(userId) || Number.isNaN(diplomaTemplateId))('createDiploma', async () => {
    await expectTrue(
      gc.createDiploma({
        userId,
        templateId: diplomaTemplateId,
        allowDuplicates: true,
      }),
    );
  });

  it.skipIf(Number.isNaN(userId))('updateUserCustomFields', async () => {
    await expectTrue(gc.updateUserCustomFields({ userId, customFields: {} }));
  });
});
