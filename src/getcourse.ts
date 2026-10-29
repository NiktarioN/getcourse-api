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
import type { Call, ContactActivity } from './types/models/call.ts';
import type {
  DealCustomField,
  UpdatedCustomField,
  UserCustomField,
} from './types/models/custom-field.ts';
import type {
  Deal,
  DealCancelReason,
  DealComment,
  DealTagNames,
  DealWithTags,
} from './types/models/deal.ts';
import type {
  AddedNoteResult,
  DialogDepartment,
  DialogMessage,
  SentDialogMessageResult,
  SentTicketMessageResult,
  UserDialog,
} from './types/models/dialog.ts';
import type { LessonAnswer, LessonAnswerComment } from './types/models/lesson.ts';
import type {
  Mailing,
  MailingContent,
  MailingStat,
  MailingWithParams,
} from './types/models/mailing.ts';
import type { Offer, OfferTagNames } from './types/models/offer.ts';
import type { SurveyAnswers, UserSurveyAnswer } from './types/models/survey.ts';
import type { Training } from './types/models/training.ts';
import type {
  AchievementRecord,
  AchievementResult,
  CreatedDiploma,
  Group,
  User,
  UserBalance,
  UserDiploma,
  UserGoal,
  UserGroup,
  UserPurchase,
  UserSchedule,
} from './types/models/user.ts';
import type { SentWebinarMessageResult, Webinar } from './types/models/webinar.ts';
import type {
  AddCallCommentRequest,
  AddCallTranscriptionRequest,
  GetCallsRequest,
} from './types/requests/call.ts';
import type {
  AddDealCommentRequest,
  AddDealPositionsRequest,
  RemoveDealPositionsRequest,
  UpdateDealCustomFieldsRequest,
  UpdateDealInfoRequest,
} from './types/requests/deal.ts';
import type {
  AddDialogNoteRequest,
  ChangeDialogDepartmentRequest,
  CloseDialogRequest,
  GetDialogHistoryRequest,
  SendDialogMessageRequest,
  StartDialogRequest,
} from './types/requests/dialog.ts';
import type {
  AddTicketNoteRequest,
  ChangeTicketDepartmentRequest,
  CloseTicketRequest,
  GetTicketHistoryRequest,
  SendTicketMessageRequest,
} from './types/requests/helpdesk.ts';
import type {
  AddLessonAnswerCommentRequest,
  ChangeLessonAnswerStatusRequest,
} from './types/requests/lesson.ts';
import type { GetMailingsRequest, GetMailingStatsRequest } from './types/requests/mailing.ts';
import type { UpdatePurchaseInfoRequest } from './types/requests/purchase.ts';
import type { GetSurveyAnswersRequest } from './types/requests/survey.ts';
import type {
  AddUserAchievementPointsRequest,
  AddUserBalanceRequest,
  AddUserCommentRequest,
  AddUserGroupsRequest,
  CreateDiplomaRequest,
  GetUserBalanceRequest,
  GetUserByChatIdRequest,
  GetUserDialogsRequest,
  GetUserInfoRequest,
  GetUserPurchasesRequest,
  RemoveUserGroupsRequest,
  SetPersonalManagerRequest,
  SetUserGroupsRequest,
  UpdateUserCustomFieldsRequest,
  UpdateUserInfoRequest,
} from './types/requests/user.ts';
import type {
  SubscribeWebhookRequest,
  SubscribeWebhookResponse,
  WebhookListItem,
  WebhookListResponse,
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
 * const deal = await getcourse.getDealInfo(12345);
 * const user = await getcourse.getUserInfo({ userId: 123 });
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

  // ─── Webhooks (вебхуки) ───────────────────────────────────────────────────────────────

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

  /**
   * Все вебхуки ключа разработчика
   *
   * Список общий для всех школ, где подключён ключ разработчика, а не только для школы из apiKey
   * В списке могут быть дубли — одинаковые школа, URI и событие
   */
  async getWebhooks(): Promise<WebhookListResponse> {
    return this.transport.getRaw<WebhookListResponse>('list-uri');
  }

  /**
   * Отписать список вебхуков — каждому ставится subscribe: 0
   *
   * Подписка определяется по account, event_object_id, event_id и uri. Один элемент снимает
   * все свои дубли, повторный элемент попадает в not_found
   */
  async unsubscribeWebhooks(hooks: WebhookListItem[]): Promise<WebhookListResponse> {
    return this.transport.postRaw<WebhookListResponse>(
      'list-uri',
      hooks.map((hook) => ({ ...hook, subscribe: 0 })),
    );
  }

  // ─── Common (общее) ────────────────────────────────────────────────────────

  /** Получить все группы пользователей */
  async getGroups(): Promise<ApiResponse<Group[]>> {
    return this.transport.get('common/get-groups');
  }

  /** Получить всех персональных менеджеров
   * @deprecated Используйте `getManagers` — это аналогичный метод, но с более правильным названием
   */
  async getPersonalManagers(): Promise<ApiResponse<User[]>> {
    return this.transport.get('common/get-personal-managers');
  }

  /** Получить всех менеджеров
   */
  async getManagers(): Promise<ApiResponse<User[]>> {
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

  /**
   * Получить ответы анкеты
   *
   * Вопросы приходят отдельным справочником `questions`: ключ — ID вопроса,
   * значение — его текст. В ответах лежат те же ключи
   */
  async getSurveyAnswers(params: GetSurveyAnswersRequest): Promise<ApiResponse<SurveyAnswers>> {
    return this.transport.get('common/get-survey-answer', params);
  }

  /**
   * Получить рассылки вместе с настройками
   *
   * Без `limit` отдаёт первые 100 рассылок. С `showInfo: true` в ответ добавляются настройки `params`.
   * У уведомлений без настроек `params` приходит `[]`
   */
  async getMailings(
    params: GetMailingsRequest & { showInfo: true },
  ): Promise<ApiResponse<MailingWithParams[]>>;

  /**
   * Получить рассылки
   *
   * Без `limit` отдаёт первые 100 рассылок
   * Настройки `params` приходят только с `showInfo: true`
   */
  async getMailings(
    params?: GetMailingsRequest & { showInfo?: false },
  ): Promise<ApiResponse<Mailing[]>>;

  async getMailings(
    params?: GetMailingsRequest & { showInfo?: boolean },
  ): Promise<ApiResponse<Mailing[] | MailingWithParams[]>> {
    return this.transport.get('common/get-mailing', params);
  }

  /** Получить содержимое рассылки */
  async getMailingContent(id: number): Promise<ApiResponse<MailingContent>> {
    return this.transport.get('common/get-mailing-content', { id });
  }

  /**
   * Получить статистику рассылок
   *
   * Возвращает словарь: ключ — ID рассылки строкой, значение — статистика
   * Без совпадений приходит `[]`, а не `{}`
   * Без `limit` отдаёт первые 100
   */
  async getMailingStats(
    params?: GetMailingStatsRequest,
  ): Promise<ApiResponse<Record<string, MailingStat> | []>> {
    return this.transport.get('common/get-mailing-stat', params);
  }

  /** Получить баллы пользователей по шкалам достижений */
  async getAchievementResults(
    params?: PaginationParams,
  ): Promise<ApiResponse<AchievementResult[]>> {
    return this.transport.get('common/get-scale', params);
  }

  // ─── Call (звонки) ──────────────────────────────────────────────────────────

  /**
   * Получить звонки в аккаунте
   *
   * В списке идут сначала новые
   * Без `params` отдаёт 100 последних звонков
   * При большом limit ответ бывает дольше 15 секунд
   */
  async getCalls(params?: GetCallsRequest): Promise<ApiResponse<Call[]>> {
    return this.transport.get('call/get-calls', params);
  }

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

  /** Обновить информацию по заказу */
  async updateDealInfo(body: UpdateDealInfoRequest): Promise<ApiResponse<Deal>> {
    return this.transport.post('deal/update-fields', body);
  }

  /** Получить информацию по заказу */
  async getDealInfo(dealId: number): Promise<ApiResponse<DealWithTags>> {
    return this.transport.get('deal/get-fields', { dealId });
  }

  /** Получить доп. поля заказа */
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

  /**
   * Получить заказы с тегами
   *
   * Без `params` отдаёт не больше 1000 записей
   */
  async getDealsWithTags(params?: PaginationParams): Promise<ApiResponse<DealTagNames[]>> {
    return this.transport.get('deal/get-deals-tags', params);
  }

  // ─── Dialog (диалоги в разделе «Входящие») ───────────────────────────────────────────────────────

  /** Отправить сообщение в диалог */
  async sendDialogMessage(
    body: SendDialogMessageRequest,
  ): Promise<ApiResponse<SentDialogMessageResult>> {
    const { attachedFiles, ...payload } = body;

    return this.transport.postWithAttachments('dialog/add-comment', payload, attachedFiles);
  }

  /**
   * Начать диалог с учеником — по ID ученика, а не по ID диалога
   *
   * При повторном вызове с тем же учеником сообщение уходит в уже открытый диалог — новый не создаётся
   */
  async startDialog(body: StartDialogRequest): Promise<ApiResponse<SentDialogMessageResult>> {
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

  /**
   * Отправить сообщение в тикет
   *
   * В закрытый тикет сообщение не уходит: GetCourse отвечает `200` без ошибки,
   * но с `result: false` и без указания причины. Статус тикета через API не получить,
   * поэтому проверяйте `data.result` у ответа
   */
  async sendTicketMessage(
    body: SendTicketMessageRequest,
  ): Promise<ApiResponse<SentTicketMessageResult>> {
    const { attachedFiles, ...payload } = body;

    return this.transport.postWithAttachments('helpdesk/add-comment', payload, attachedFiles);
  }

  /**
   * Изменить отдел тикета
   *
   * У закрытого тикета отдел не меняется: GetCourse отвечает `200` без ошибки,
   * но с `result: false` и без указания причины — проверяйте `data.result` у ответа
   */
  async changeTicketDepartment(
    body: ChangeTicketDepartmentRequest,
  ): Promise<ApiResponse<ActionResult>> {
    return this.transport.post('helpdesk/change-department', body);
  }

  /** Закрыть тикет */
  async closeTicket(body: CloseTicketRequest): Promise<ApiResponse<ActionResult>> {
    return this.transport.post('helpdesk/close', body);
  }

  /**
   * Добавить заметку к тикету HelpDesk — видна только сотрудникам
   *
   * В отличие от `addDialogNote` требует ID сотрудника, от чьего имени добавляется заметка
   */
  async addTicketNote(body: AddTicketNoteRequest): Promise<ApiResponse<AddedNoteResult>> {
    return this.transport.post('helpdesk/add-note', body);
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
  async getLessonAnswers(lessonId: number): Promise<ApiResponse<LessonAnswer[]>> {
    return this.transport.get('lesson/get-answers', { lessonId });
  }

  // ─── Offer (предложения) ────────────────────────────────────────────────────

  /** Получить оффер по ID */
  async getOfferById(offerId: number): Promise<ApiResponse<Offer[]>> {
    return this.transport.get('offer/get-offer-by-id', { offerId });
  }

  /**
   * Получить все офферы
   *
   * Без `params` отдаёт не больше 1000 записей
   */
  async getOffers(params?: PaginationParams): Promise<ApiResponse<Offer[]>> {
    return this.transport.get('offer/get-offers', params);
  }

  /**
   * Получить офферы с тегами
   *
   * Без `params` отдаёт не больше 1000 записей
   */
  async getOffersWithTags(params?: PaginationParams): Promise<ApiResponse<OfferTagNames[]>> {
    return this.transport.get('offer/get-offers-tags', params);
  }

  // ─── Purchase (покупки) ─────────────────────────────────────────────────────

  /**
   * Обновить покупку
   *
   * Смена `period_type` на `unlimited` не очищает `finish_at` — передайте `finish_at: null`.
   * Дату начала так же сбрасывает `start_at: null`
   */
  async updatePurchaseInfo(body: UpdatePurchaseInfoRequest): Promise<ApiResponse<[]>> {
    return this.transport.post('userproduct/update-fields', body);
  }

  // ─── User (пользователи) ────────────────────────────────────────────────────

  /** Добавить баланс пользователю */
  async addUserBalance(body: AddUserBalanceRequest): Promise<ApiResponse<UserBalance>> {
    return this.transport.post('user/add-balance', body);
  }

  /**
   * Начислить или списать баллы по шкале достижений
   *
   * Положительное `value` начисляет баллы, отрицательное списывает
   */
  async addUserAchievementPoints(
    body: AddUserAchievementPointsRequest,
  ): Promise<ApiResponse<AchievementRecord>> {
    return this.transport.post('user/edit-scale', body);
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

  /** Обновить доп. поля пользователя */
  async updateUserCustomFields(
    body: UpdateUserCustomFieldsRequest,
  ): Promise<ApiResponse<UpdatedCustomField[]>> {
    return this.transport.post('user/update-custom-fields', body);
  }

  /** Обновить информацию по пользователю */
  async updateUserInfo(body: UpdateUserInfoRequest): Promise<ApiResponse<[]>> {
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
  async getUserSurveyAnswers(params: UserIdentifier): Promise<ApiResponse<UserSurveyAnswer[]>> {
    return this.transport.get('user/get-answers', params);
  }

  /**
   * Найти пользователя по Telegram Chat ID
   *
   * @deprecated Используйте `getUserByChatId` — он покрывает все мессенджеры
   */
  async getUserByTelegramChatId(chatId: number): Promise<ApiResponse<User[]>> {
    return this.transport.get('user/get-user-by-telegram-chat-id', { chatId });
  }

  /** Найти пользователя по chat ID мессенджера — Telegram, ВКонтакте или MAX */
  async getUserByChatId(params: GetUserByChatIdRequest): Promise<ApiResponse<User>> {
    return this.transport.get('user/get-user-by-chat-id', params);
  }

  /** Получить доп. поля пользователя */
  async getUserCustomFields(
    params: UserIdentifier,
  ): Promise<ApiResponse<Record<string, UserCustomField>>> {
    return this.transport.get('user/get-custom-fields', params);
  }

  /** Получить заказы пользователя */
  async getUserDeals(params: UserIdentifier): Promise<ApiResponse<Deal[]>> {
    return this.transport.get('user/get-deals', params);
  }

  /**
   * Получить все диалоги пользователя из Входящих
   *
   * Формат сообщений совпадает с `getDialogHistory`
   * Лимит — не более 100 диалогов на страницу (по умолчанию: 50)
   */
  async getUserDialogs(params: GetUserDialogsRequest): Promise<ApiResponse<UserDialog[]>> {
    return this.transport.get('user/get-dialogs', params);
  }

  /**
   * Получить все тикеты HelpDesk пользователя
   *
   * Формат сообщений совпадает с `getTicketHistory`, в `dialog_id` приходит ID тикета
   * Лимит — не более 100 тикетов на страницу (по умолчанию: 50)
   */
  async getUserTickets(params: GetUserDialogsRequest): Promise<ApiResponse<UserDialog[]>> {
    return this.transport.get('user/get-helpdesk-dialogs', params);
  }

  /** Получить дипломы пользователя */
  async getUserDiplomas(params: UserIdentifier): Promise<ApiResponse<UserDiploma[]>> {
    return this.transport.get('user/get-diplomas', params);
  }

  /**
   * Получить информацию по пользователю
   *
   * Если совпадений нет — бросает `GetCourseApiError`, а не возвращает пустой результат
   */
  async getUserInfo(params: UserIdentifier & { phone?: never }): Promise<ApiResponse<User>>;

  /**
   * Найти пользователей по номеру телефона
   *
   * Возвращает словарь: ключ — ID пользователя строкой, значение — сам пользователь
   * Один номер может принадлежать нескольким пользователям
   */
  async getUserInfo(params: { phone: string }): Promise<ApiResponse<Record<string, User>>>;

  async getUserInfo(params: GetUserInfoRequest): Promise<ApiResponse<User | Record<string, User>>> {
    return this.transport.get('user/get-fields', params);
  }

  /** Получить записи целей пользователя */
  async getUserGoalRecords(params: UserIdentifier): Promise<ApiResponse<UserGoal[]>> {
    return this.transport.get('user/get-goal-records', params);
  }

  /** Получить группы пользователя */
  async getUserGroups(params: UserIdentifier): Promise<ApiResponse<UserGroup[]>> {
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

  /**
   * Отправить сообщение в чат вебинара
   *
   * Если сообщение не отправлено — например, moderatorId не сотрудник школы
   * или replyToUserType не 1 и не 2, то API отвечает result: false, а не ошибкой
   */
  async sendWebinarMessage(
    body: SendWebinarMessageRequest,
  ): Promise<ApiResponse<SentWebinarMessageResult>> {
    return this.transport.post('webinar/add-comment', body);
  }

  /** Модерация сообщения в чате вебинара */
  async moderateWebinarMessage(body: ModerateWebinarMessageRequest): Promise<ApiResponse<[]>> {
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
   * Получить доп. поля аккаунта (Legacy API)
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
