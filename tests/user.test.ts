import { describe, it } from 'vitest';
import gc from './helpers/client.ts';
import { envNum } from './helpers/env.ts';
import expectTrue from './helpers/expect-true.ts';

const userId = envNum(process.env.TEST_USER_ID);
const adminUserId = envNum(process.env.TEST_ADMIN_USER_ID);
const groupId = envNum(process.env.TEST_GROUP_ID);
const telegramChatId = envNum(process.env.TEST_TELEGRAM_CHAT_ID);
const diplomaTemplateId = envNum(process.env.TEST_DIPLOMA_TEMPLATE_ID);

describe('user', () => {
  it.skipIf(Number.isNaN(userId))('getUserFields', async () => {
    await expectTrue(gc.getUserFields({ userId }));
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

  it.skipIf(Number.isNaN(userId))('getUserAnswers', async () => {
    await expectTrue(gc.getUserAnswers({ userId }));
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

  it.skipIf(Number.isNaN(telegramChatId))('getUserByTelegramChatId', async () => {
    await expectTrue(gc.getUserByTelegramChatId(telegramChatId));
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

  it.skipIf(Number.isNaN(userId))('updateUserFields', async () => {
    await expectTrue(gc.updateUserFields({ userId, comment: 'Тестовый комментарий' }));
  });

  it.skipIf(Number.isNaN(userId) || Number.isNaN(adminUserId))('addCommentToUser', async () => {
    await expectTrue(
      gc.addCommentToUser({
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
