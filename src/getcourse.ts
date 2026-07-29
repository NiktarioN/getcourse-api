import ExportPoller from './helpers/export-poller.ts';
import LegacyTransport from './helpers/legacy-transport.ts';
import ConsoleLogger from './helpers/logger.ts';
import HttpTransport from './helpers/transport.ts';

import type {
  ActionResult,
  ApiResponse,
  GetCourseConfig,
  PaginationParams,
  UserIdentifier,
} from './types/common.ts';
import type {
  ExportDealsFilters,
  ExportedData,
  ExportGroupUsersFilters,
  ExportInfo,
  ExportPaymentsFilters,
  ExportPollingOptions,
  ExportUsersFilters,
  LegacyCustomField,
} from './types/legacy/export.ts';
import type {
  AddUserRequest,
  AddUserResult,
  CreateDealRequest,
  CreateDealResult,
} from './types/legacy/import.ts';
import type { ContactActivity } from './types/models/call.ts';
import type {
  DealCustomField,
  UpdatedCustomField,
  UserCustomField,
} from './types/models/custom-field.ts';
import type { Deal, DealCancelReason, DealComment, DealTag } from './types/models/deal.ts';
import type { DialogDepartment, DialogMessage, SentMessageResult } from './types/models/dialog.ts';
import type { LessonAnswer, LessonAnswerComment } from './types/models/lesson.ts';
import type { Offer, OfferTag } from './types/models/offer.ts';
import type { SurveyAnswer } from './types/models/survey.ts';
import type { Training } from './types/models/training.ts';
import type {
  CreatedDiploma,
  Group,
  User,
  UserBalance,
  UserDiploma,
  UserGoal,
  UserPurchase,
  UserSchedule,
} from './types/models/user.ts';
import type { Webinar } from './types/models/webinar.ts';
import type { AddCallCommentRequest, AddCallTranscriptionRequest } from './types/requests/call.ts';
import type {
  AddDealCommentRequest,
  AddDealPositionsRequest,
  RemoveDealPositionsRequest,
  UpdateDealCustomFieldsRequest,
  UpdateDealFieldsRequest,
} from './types/requests/deal.ts';
import type {
  AddDialogNoteRequest,
  ChangeDialogDepartmentRequest,
  CloseDialogRequest,
  GetDialogHistoryRequest,
  SendDialogMessageRequest,
} from './types/requests/dialog.ts';
import type {
  ChangeTicketDepartmentRequest,
  CloseTicketRequest,
  GetTicketHistoryRequest,
  SendTicketMessageRequest,
} from './types/requests/helpdesk.ts';
import type {
  AddLessonAnswerCommentRequest,
  ChangeLessonAnswerStatusRequest,
} from './types/requests/lesson.ts';
import type {
  AddUserBalanceRequest,
  AddUserCommentRequest,
  AddUserGroupsRequest,
  CreateDiplomaRequest,
  GetUserBalanceRequest,
  GetUserPurchasesRequest,
  RemoveUserGroupsRequest,
  SetPersonalManagerRequest,
  SetUserGroupsRequest,
  UpdateUserCustomFieldsRequest,
  UpdateUserFieldsRequest,
} from './types/requests/user.ts';
import type {
  SubscribeWebhookRequest,
  SubscribeWebhookResponse,
  WebhookSubscription,
} from './types/requests/webhook.ts';
import type {
  GetWebinarsByIdsRequest,
  ModerateWebinarMessageRequest,
  ModerateWebinarUserRequest,
  SendWebinarMessageRequest,
} from './types/requests/webinar.ts';

/**
 * Клиент для работы с API GetCourse
 *
 * @example
 * ```ts
 * import { GetCourse } from 'getcourse-api';
 *
 * const getcourse = new GetCourse({
 *   devKey: 'XXXXXXXX',
 *   apiKey: 'YYYYYYYYYYYYYYYYYYY',
 *   domain: 'test.getcourse.ru',
 * });
 *
 * const deal = await getcourse.getDealFields(12345);
 * const user = await getcourse.getUserFields({ userId: 123 });
 * ```
 */
export default class GetCourse {
  private readonly transport: HttpTransport;

  private readonly legacyTransport: LegacyTransport;

  private readonly exportPoller: ExportPoller;

  constructor(config: GetCourseConfig) {
    const logger = config.logger ?? new ConsoleLogger(config.logLevel);

    this.transport = new HttpTransport({
      baseUrl: `https://${config.domain}/pl/api/v1`,
      token: `Bearer ${config.devKey}_${config.apiKey}`,
      timeout: config.timeout,
      logLevel: config.logLevel,
      logger: config.logger,
    });

    this.legacyTransport = new LegacyTransport({
      baseUrl: `https://${config.domain}/pl/api`,
      apiKey: config.apiKey,
      timeout: config.timeout,
      logger,
    });

    this.exportPoller = new ExportPoller(
      async (exportId) => this.legacyTransport.getExportResult<ExportedData>(exportId),
      logger,
    );
  }

  // ─── Webhooks ───────────────────────────────────────────────────────────────

  /**
   * Подписать URI на событие (вебхук)
   *
   * Поддерживаемые события (event_object_id → event_id):
   * - Входящие сообщения (1): 1 — новый диалог, 2 — переоткрыт диалог,
   *   3 — сообщение от ученика, 4 — сообщение от сотрудника
   * - Заказы (2): 1 — создан, 2 — смена статуса, 3 — оплачен
   * - Комментарии к урокам (4): 1 — добавлен ответ на урок
   * - Комментарии к ответам (5): 1 — добавлен комментарий к ответу
   * - Комментарии вебинаров (7): 1 — новый комментарий от зрителя
   * - Звонки (8): 1 — новый звонок
   * - HelpDesk (9): 1 — новый тикет, 2 — сообщение от клиента, 3 — сообщение от сотрудника
   */
  async subscribeWebhook(body: SubscribeWebhookRequest): Promise<SubscribeWebhookResponse> {
    return this.transport.postRaw<SubscribeWebhookResponse>('set-uri', body);
  }

  /** Отписать URI от события — тот же set-uri с subscribe: 0 */
  async unsubscribeWebhook(event: WebhookSubscription): Promise<SubscribeWebhookResponse> {
    return this.transport.postRaw<SubscribeWebhookResponse>('set-uri', { ...event, subscribe: 0 });
  }

  // ─── School (common) ────────────────────────────────────────────────────────

  /** Получить все группы пользователей */
  async getGroups(): Promise<ApiResponse<Group[]>> {
    return this.transport.get('common/get-groups');
  }

  /** Получить всех персональных менеджеров */
  async getPersonalManagers(): Promise<ApiResponse<User[]>> {
    return this.transport.get('common/get-personal-managers');
  }

  /** Получить все тренинги */
  async getTrainings(): Promise<ApiResponse<Training[]>> {
    return this.transport.get('common/get-trainings');
  }

  /** Получить все отделы */
  async getDepartments(): Promise<ApiResponse<DialogDepartment[]>> {
    return this.transport.get('common/get-departments');
  }

  // ─── Call (звонки) ──────────────────────────────────────────────────────────

  /**
   * Добавить комментарий к звонку — попадает в поле «Описание»
   *
   * Повторный вызов перезаписывает значение
   */
  async addCallComment(body: AddCallCommentRequest): Promise<ApiResponse<ActionResult>> {
    return this.transport.post('call/add-comment', body);
  }

  /**
   * Добавить транскрибацию к звонку
   *
   * Повторный вызов перезаписывает значение
   */
  async addCallTranscription(
    body: AddCallTranscriptionRequest,
  ): Promise<ApiResponse<ActionResult>> {
    return this.transport.post('call/add-transcription', body);
  }

  // ─── Deal (заказы) ──────────────────────────────────────────────────────────

  /** Добавить комментарий к заказу */
  async addDealComment(body: AddDealCommentRequest): Promise<ApiResponse<ActionResult>> {
    return this.transport.post('deal/add-comment', body);
  }

  /** Добавить позиции в заказ */
  async addDealPositions(body: AddDealPositionsRequest): Promise<ApiResponse<string[]>> {
    return this.transport.post('deal/add-positions', body);
  }

  /** Удалить позиции из заказа */
  async removeDealPositions(body: RemoveDealPositionsRequest): Promise<ApiResponse<string[]>> {
    return this.transport.post('deal/remove-positions', body);
  }

  /** Обновить поля заказа */
  async updateDealFields(body: UpdateDealFieldsRequest): Promise<ApiResponse<Deal>> {
    return this.transport.post('deal/update-fields', body);
  }

  /** Получить поля заказа */
  async getDealFields(dealId: number): Promise<ApiResponse<Deal>> {
    return this.transport.get('deal/get-fields', { dealId });
  }

  /** Получить дополнительные поля заказа */
  async getDealCustomFields(dealId: number): Promise<ApiResponse<DealCustomField[]>> {
    return this.transport.get('deal/get-custom-fields', { dealId });
  }

  /** Получить комментарии заказа */
  async getDealComments(dealId: number): Promise<ApiResponse<DealComment[]>> {
    return this.transport.get('deal/get-comments', { dealId });
  }

  /** Получить звонки по заказу */
  async getDealCalls(dealId: number): Promise<ApiResponse<ContactActivity[]>> {
    return this.transport.get('deal/get-calls', { dealId });
  }

  /** Обновить доп. поля заказа */
  async updateDealCustomFields(
    body: UpdateDealCustomFieldsRequest,
  ): Promise<ApiResponse<UpdatedCustomField[]>> {
    return this.transport.post('deal/update-custom-fields', body);
  }

  /** Получить список причин отмены заказов */
  async getDealCancelReasons(): Promise<ApiResponse<DealCancelReason[]>> {
    return this.transport.get('deal/get-cancel-reasons');
  }

  /** Получить заказы с тегами (с пагинацией) */
  async getDealsWithTags(params?: PaginationParams): Promise<ApiResponse<DealTag[]>> {
    return this.transport.get('deal/get-deals-tags', params);
  }

  // ─── Dialog (диалоги) ───────────────────────────────────────────────────────

  /** Отправить сообщение в диалог */
  async sendDialogMessage(body: SendDialogMessageRequest): Promise<ApiResponse<SentMessageResult>> {
    const { attachedFiles, ...payload } = body;

    return this.transport.postWithAttachments('dialog/add-comment', payload, attachedFiles);
  }

  /** Добавить заметку к диалогу */
  async addDialogNote(body: AddDialogNoteRequest): Promise<ApiResponse<[]>> {
    return this.transport.post('note/add', body);
  }

  /** Изменить отдел диалога */
  async changeDialogDepartment(
    body: ChangeDialogDepartmentRequest,
  ): Promise<ApiResponse<ActionResult>> {
    return this.transport.post('dialog/change-department', body);
  }

  /** Закрыть диалог */
  async closeDialog(body: CloseDialogRequest): Promise<ApiResponse<ActionResult>> {
    return this.transport.post('dialog/close', body);
  }

  /** Получить историю диалога */
  async getDialogHistory(body: GetDialogHistoryRequest): Promise<ApiResponse<DialogMessage[]>> {
    return this.transport.get('dialog/get-history', body);
  }

  // ─── HelpDesk (тикеты) ──────────────────────────────────────────────────────

  /** Отправить сообщение в тикет */
  async sendTicketMessage(body: SendTicketMessageRequest): Promise<ApiResponse<SentMessageResult>> {
    const { attachedFiles, ...payload } = body;

    return this.transport.postWithAttachments('helpdesk/add-comment', payload, attachedFiles);
  }

  /** Изменить отдел тикета */
  async changeTicketDepartment(
    body: ChangeTicketDepartmentRequest,
  ): Promise<ApiResponse<ActionResult>> {
    return this.transport.post('helpdesk/change-department', body);
  }

  /** Закрыть тикет */
  async closeTicket(body: CloseTicketRequest): Promise<ApiResponse<ActionResult>> {
    return this.transport.post('helpdesk/close', body);
  }

  /** Получить историю переписки тикета */
  async getTicketHistory(body: GetTicketHistoryRequest): Promise<ApiResponse<DialogMessage[]>> {
    return this.transport.get('helpdesk/get-history', body);
  }

  // ─── Lesson (уроки) ─────────────────────────────────────────────────────────

  /** Добавить комментарий к ответу на урок */
  async addLessonAnswerComment(
    body: AddLessonAnswerCommentRequest,
  ): Promise<ApiResponse<LessonAnswerComment>> {
    return this.transport.post('lesson/add-comment-to-lesson-answer', body);
  }

  /** Изменить статус ответа на урок */
  async changeLessonAnswerStatus(
    body: ChangeLessonAnswerStatusRequest,
  ): Promise<ApiResponse<LessonAnswer>> {
    return this.transport.post('lesson/change-status-answers', body);
  }

  /** Получить ответы на урок */
  async getLessonAnswers(lessonId?: number): Promise<ApiResponse<LessonAnswer[]>> {
    return this.transport.get(
      'lesson/get-answers',
      lessonId === undefined ? undefined : { lessonId },
    );
  }

  // ─── Offer (предложения) ────────────────────────────────────────────────────

  /** Получить оффер по ID */
  async getOfferById(offerId: number): Promise<ApiResponse<Offer[]>> {
    return this.transport.get('offer/get-offer-by-id', { offerId });
  }

  /** Получить все офферы */
  async getOffers(): Promise<ApiResponse<Offer[]>> {
    return this.transport.get('offer/get-offers');
  }

  /** Получить офферы с тегами (с пагинацией) */
  async getOffersWithTags(params?: PaginationParams): Promise<ApiResponse<OfferTag[]>> {
    return this.transport.get('offer/get-offers-tags', params);
  }

  // ─── User (пользователи) ────────────────────────────────────────────────────

  /** Добавить баланс пользователю */
  async addUserBalance(body: AddUserBalanceRequest): Promise<ApiResponse<UserBalance>> {
    return this.transport.post('user/add-balance', body);
  }

  /** Добавить комментарий в ленту пользователя */
  async addUserComment(body: AddUserCommentRequest): Promise<ApiResponse<ActionResult>> {
    return this.transport.post('user/add-comment', body);
  }

  /** Добавить пользователя в группы */
  async addUserGroups(body: AddUserGroupsRequest): Promise<ApiResponse<Group[]>> {
    return this.transport.post('user/add-groups', body);
  }

  /** Удалить пользователя из групп */
  async removeUserGroups(body: RemoveUserGroupsRequest): Promise<ApiResponse<[]>> {
    return this.transport.post('user/remove-groups', body);
  }

  /** Установить группы пользователя (заменяет текущие) */
  async setUserGroups(body: SetUserGroupsRequest): Promise<ApiResponse<Group[]>> {
    return this.transport.post('user/set-groups', body);
  }

  /** Закрепить персонального менеджера */
  async setPersonalManager(body: SetPersonalManagerRequest): Promise<ApiResponse<[]>> {
    return this.transport.post('user/set-personal-manager', body);
  }

  /** Обновить дополнительные поля пользователя */
  async updateUserCustomFields(
    body: UpdateUserCustomFieldsRequest,
  ): Promise<ApiResponse<UpdatedCustomField[]>> {
    return this.transport.post('user/update-custom-fields', body);
  }

  /** Обновить поля пользователя */
  async updateUserFields(body: UpdateUserFieldsRequest): Promise<ApiResponse<[]>> {
    return this.transport.post('user/update-fields', body);
  }

  /** Создать диплом пользователю */
  async createDiploma(body: CreateDiplomaRequest): Promise<ApiResponse<CreatedDiploma>> {
    return this.transport.post('user/create-diploma', body);
  }

  /** Получить баланс пользователя */
  async getUserBalance(params: GetUserBalanceRequest): Promise<ApiResponse<UserBalance[]>> {
    return this.transport.get('user/get-balance', params);
  }

  /** Получить ответы пользователя на уроки */
  async getUserLessonAnswers(params: UserIdentifier): Promise<ApiResponse<LessonAnswer[]>> {
    return this.transport.get('user/get-lesson-answers', params);
  }

  /** Получить ответы пользователя на анкеты */
  async getUserSurveyAnswers(params: UserIdentifier): Promise<ApiResponse<SurveyAnswer[]>> {
    return this.transport.get('user/get-answers', params);
  }

  /** Найти пользователя по Telegram Chat ID */
  async getUserByTelegramChatId(chatId: number): Promise<ApiResponse<User[]>> {
    return this.transport.get('user/get-user-by-telegram-chat-id', { chatId });
  }

  /** Получить дополнительные поля пользователя */
  async getUserCustomFields(
    params: UserIdentifier,
  ): Promise<ApiResponse<Record<string, UserCustomField>>> {
    return this.transport.get('user/get-custom-fields', params);
  }

  /** Получить заказы пользователя */
  async getUserDeals(params: UserIdentifier): Promise<ApiResponse<Deal[]>> {
    return this.transport.get('user/get-deals', params);
  }

  /** Получить дипломы пользователя */
  async getUserDiplomas(params: UserIdentifier): Promise<ApiResponse<UserDiploma[]>> {
    return this.transport.get('user/get-diplomas', params);
  }

  /** Получить поля пользователя */
  async getUserFields(params: UserIdentifier): Promise<ApiResponse<User>> {
    return this.transport.get('user/get-fields', params);
  }

  /** Получить записи целей пользователя */
  async getUserGoalRecords(params: UserIdentifier): Promise<ApiResponse<UserGoal[]>> {
    return this.transport.get('user/get-goal-records', params);
  }

  /** Получить группы пользователя */
  async getUserGroups(params: UserIdentifier): Promise<ApiResponse<Group[]>> {
    return this.transport.get('user/get-groups', params);
  }

  /** Получить покупки пользователя */
  async getUserPurchases(params: GetUserPurchasesRequest): Promise<ApiResponse<UserPurchase[]>> {
    return this.transport.get('user/get-purchases', params);
  }

  /** Получить расписание пользователя */
  async getUserSchedule(params: UserIdentifier): Promise<ApiResponse<UserSchedule[]>> {
    return this.transport.get('user/get-schedule', params);
  }

  /** Получить тренинги пользователя */
  async getUserTrainings(params: UserIdentifier): Promise<ApiResponse<Training[]>> {
    return this.transport.get('user/get-trainings', params);
  }

  // ─── Webinar (вебинары) ─────────────────────────────────────────────────────

  /** Получить все вебинары */
  async getWebinars(): Promise<ApiResponse<Webinar[]>> {
    return this.transport.get('webinar/get-all-webinars');
  }

  /** Получить вебинары по ID */
  async getWebinarsByIds(body: GetWebinarsByIdsRequest): Promise<ApiResponse<Webinar[]>> {
    return this.transport.post('webinar/get-webinars-by-ids', body);
  }

  /** Отправить сообщение в чат вебинара */
  async sendWebinarMessage(body: SendWebinarMessageRequest): Promise<ApiResponse<[]>> {
    return this.transport.post('webinar/add-comment', body);
  }

  /** Модерация сообщения в чате вебинара */
  async moderateWebinarMessage(
    body: ModerateWebinarMessageRequest,
  ): Promise<ApiResponse<Webinar[]>> {
    return this.transport.post('webinar/moderation-comment', body);
  }

  /** Модерация пользователя вебинара */
  async moderateWebinarUser(body: ModerateWebinarUserRequest): Promise<ApiResponse<ActionResult>> {
    return this.transport.post('webinar/moderation-user', body);
  }

  // ─── Legacy API (старое API) ─────────────────────────────────────────────────

  /**
   * Создать/обновить пользователя (Legacy API)
   *
   * Если пользователь с таким email существует и system.refresh_if_exists = 1,
   * данные будут обновлены. Иначе создаётся новый пользователь
   */
  async addUser(params: AddUserRequest): Promise<ApiResponse<AddUserResult>> {
    return this.legacyTransport.importRequest<AddUserResult>('users', 'add', params);
  }

  /**
   * Создать сделку (Legacy API)
   *
   * Минимальные параметры:
   * - offer_code + deal_cost + user.email
   * - ИЛИ offer_id + user.email
   */
  async createDeal(params: CreateDealRequest): Promise<ApiResponse<CreateDealResult>> {
    return this.legacyTransport.importRequest<CreateDealResult>('deals', 'add', params);
  }

  /**
   * Экспорт пользователей (Legacy API)
   *
   * Запускает асинхронный экспорт и автоматически поллит результат
   * Для ручного контроля используйте getExportResult()
   *
   * Лимит: 100 запросов Export API за 2 часа
   */
  async exportUsers(
    filters?: ExportUsersFilters,
    polling?: ExportPollingOptions,
  ): Promise<ApiResponse<ExportedData>> {
    const response = await this.legacyTransport.exportRequest<ExportInfo>('account/users', filters);

    return this.exportPoller.poll(response.data.export_id, polling);
  }

  /**
   * Экспорт пользователей группы (Legacy API)
   *
   * Возвращает пользователей конкретной группы с дополнительными полями:
   * ID группы и дата добавления в группу
   *
   * Лимит: 100 запросов Export API за 2 часа
   */
  async exportGroupUsers(
    groupId: number,
    filters?: ExportGroupUsersFilters,
    polling?: ExportPollingOptions,
  ): Promise<ApiResponse<ExportedData>> {
    const response = await this.legacyTransport.exportRequest<ExportInfo>(
      `account/groups/${groupId}/users`,
      filters,
    );

    return this.exportPoller.poll(response.data.export_id, polling);
  }

  /**
   * Экспорт сделок (Legacy API)
   *
   * Лимит: 100 запросов Export API за 2 часа
   */
  async exportDeals(
    filters?: ExportDealsFilters,
    polling?: ExportPollingOptions,
  ): Promise<ApiResponse<ExportedData>> {
    const response = await this.legacyTransport.exportRequest<ExportInfo>('account/deals', filters);

    return this.exportPoller.poll(response.data.export_id, polling);
  }

  /**
   * Экспорт платежей (Legacy API)
   *
   * Лимит: 100 запросов Export API за 2 часа
   */
  async exportPayments(
    filters?: ExportPaymentsFilters,
    polling?: ExportPollingOptions,
  ): Promise<ApiResponse<ExportedData>> {
    const response = await this.legacyTransport.exportRequest<ExportInfo>(
      'account/payments',
      filters,
    );

    return this.exportPoller.poll(response.data.export_id, polling);
  }

  /**
   * Получить дополнительные поля аккаунта (Legacy API)
   *
   * Возвращает справочник дополнительных полей пользователей и заказов
   */
  async getCustomFields(): Promise<ApiResponse<LegacyCustomField[]>> {
    return this.legacyTransport.exportRequest<LegacyCustomField[]>('account/fields');
  }

  /**
   * Получить результат экспорта по ID (Legacy API)
   *
   * Для ручного контроля поллинга — если не нужен автоматический
   * Полезно если предыдущий запрос упал по таймауту, а экспорт на сервере продолжается
   */
  async getExportResult(exportId: number): Promise<ApiResponse<ExportedData>> {
    return this.legacyTransport.getExportResult<ExportedData>(exportId);
  }
}
