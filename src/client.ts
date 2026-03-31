import HttpTransport from './transport.ts';

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

  constructor(config: GetCourseConfig) {
    this.transport = new HttpTransport({
      baseUrl: `https://${config.domain}/pl/api/v1`,
      token: `Bearer ${config.devKey}_${config.apiKey}`,
      timeout: config.timeout,
      logLevel: config.logLevel,
      logger: config.logger,
      fetch: config.fetch,
    });
  }

  // ─── Webhooks ───────────────────────────────────────────────────────────────

  /**
   * Установить URI для получения событий (вебхук)
   *
   * Поддерживаемые события:
   * - Входящие сообщения (event_object_id = 1): event_id = 1, 2, 3
   * - Заказы (event_object_id = 2): event_id = 1, 2, 3
   * - Комментарии к урокам (event_object_id = 4): event_id = 1
   * - Комментарии к ответам (event_object_id = 5): event_id = 1
   * - Комментарии вебинаров (event_object_id = 7): event_id = 1
   */
  async setUri(body: SetUriRequest): Promise<ApiResponse<null>> {
    return this.transport.post('set-uri', body);
  }

  // ─── School (common) ────────────────────────────────────────────────────────

  /** Получить все группы пользователей */
  async getAllGroups(): Promise<ApiResponse<Group[]>> {
    return this.transport.get('common/get-groups');
  }

  /** Получить всех персональных менеджеров */
  async getAllPersonalManagers(): Promise<ApiResponse<PersonalManager[]>> {
    return this.transport.get('common/get-personal-managers');
  }

  /** Получить все тренинги */
  async getTrainings(): Promise<ApiResponse<Training[]>> {
    return this.transport.get('common/get-trainings');
  }

  // ─── Deal (заказы) ──────────────────────────────────────────────────────────

  /** Добавить комментарий к заказу */
  async addCommentToDeal(body: AddCommentToDealRequest): Promise<ApiResponse<{ result: boolean }>> {
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
  async updateDealFields(body: UpdateDealFieldsRequest): Promise<ApiResponse<Deal[]>> {
    return this.transport.post('deal/update-fields', body);
  }

  /** Получить поля заказа */
  async getDealFields(dealId: number): Promise<ApiResponse<Deal[]>> {
    return this.transport.get('deal/get-fields', { dealId });
  }

  /** Получить кастомные поля заказа */
  async getDealCustomFields(dealId: number): Promise<ApiResponse<DealCustomField[]>> {
    return this.transport.get('deal/get-custom-fields', { dealId });
  }

  /** Получить комментарии заказа */
  async getDealComments(dealId: number): Promise<ApiResponse<ContactActivity[]>> {
    return this.transport.get('deal/get-comments', { dealId });
  }

  /** Получить звонки по заказу */
  async getDealCalls(dealId: number): Promise<ApiResponse<ContactActivity[]>> {
    return this.transport.get('deal/get-calls', { dealId });
  }

  /** Получить список причин отмены заказов */
  async getDealCancelReasons(): Promise<ApiResponse<CancelReason[]>> {
    return this.transport.get('deal/get-cancel-reasons');
  }

  /** Получить заказы с тегами (с пагинацией) */
  async getDealsTags(params?: PaginationParams): Promise<ApiResponse<DealTag[]>> {
    return this.transport.get('deal/get-deals-tags', params);
  }

  // ─── Dialog (диалоги) ───────────────────────────────────────────────────────

  /** Добавить комментарий в диалог */
  async addCommentToDialog(
    body: AddCommentToDialogRequest,
  ): Promise<ApiResponse<{ result: boolean }>> {
    return this.transport.post('dialog/add-comment', body);
  }

  /** Изменить отдел диалога */
  async changeDepartment(body: ChangeDepartmentRequest): Promise<ApiResponse<{ result: boolean }>> {
    return this.transport.post('dialog/change-department', body);
  }

  /** Закрыть диалог */
  async closeDialog(body: CloseDialogRequest): Promise<ApiResponse<{ result: boolean }>> {
    return this.transport.post('dialog/close', body);
  }

  /** Получить историю диалога */
  async getDialogHistory(body: GetDialogHistoryRequest): Promise<ApiResponse<DialogMessage[]>> {
    return this.transport.get('dialog/get-history', body);
  }

  // ─── Lesson (уроки) ─────────────────────────────────────────────────────────

  /** Добавить комментарий к ответу на урок */
  async addCommentToLessonAnswer(
    body: AddCommentToLessonAnswerRequest,
  ): Promise<ApiResponse<{ result: boolean }>> {
    return this.transport.post('lesson/add-comment-to-lesson-answer', body);
  }

  /** Изменить статус ответа на урок */
  async changeStatusAnswers(
    body: ChangeStatusAnswersRequest,
  ): Promise<ApiResponse<{ result: boolean }>> {
    return this.transport.post('lesson/change-status-answers', body);
  }

  /** Получить ответы на урок */
  async getLessonAnswers(lessonId?: number): Promise<ApiResponse<LessonAnswer[]>> {
    return this.transport.get(
      'lesson/get-answers',
      lessonId === undefined ? undefined : { lessonId },
    );
  }

  // ─── Note (заметки) ─────────────────────────────────────────────────────────

  /** Добавить заметку к диалогу */
  async addNote(body: AddNoteRequest): Promise<ApiResponse<{ result: boolean }>> {
    return this.transport.post('note/add', body);
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
  async getOffersTags(params?: PaginationParams): Promise<ApiResponse<OfferTag[]>> {
    return this.transport.get('offer/get-offers-tags', params);
  }

  // ─── User (пользователи) ────────────────────────────────────────────────────

  /** Добавить баланс пользователю */
  async addUserBalance(body: AddUserBalanceRequest): Promise<ApiResponse<{ result: boolean }>> {
    return this.transport.post('user/add-balance', body);
  }

  /** Добавить пользователя в группы */
  async addUserGroups(body: AddUserGroupsRequest): Promise<ApiResponse<{ result: boolean }>> {
    return this.transport.post('user/add-groups', body);
  }

  /** Удалить пользователя из групп */
  async removeUserGroups(body: RemoveUserGroupsRequest): Promise<ApiResponse<{ result: boolean }>> {
    return this.transport.post('user/remove-groups', body);
  }

  /** Установить группы пользователя (заменяет текущие) */
  async setUserGroups(body: SetUserGroupsRequest): Promise<ApiResponse<{ result: boolean }>> {
    return this.transport.post('user/set-groups', body);
  }

  /** Установить персонального менеджера */
  async setPersonalManager(
    body: SetPersonalManagerRequest,
  ): Promise<ApiResponse<{ result: boolean }>> {
    return this.transport.post('user/set-personal-manager', body);
  }

  /** Обновить кастомные поля пользователя */
  async updateUserCustomFields(
    body: UpdateUserCustomFieldsRequest,
  ): Promise<ApiResponse<{ result: boolean }>> {
    return this.transport.post('user/update-custom-fields', body);
  }

  /** Обновить поля пользователя */
  async updateUserFields(body: UpdateUserFieldsRequest): Promise<ApiResponse<{ result: boolean }>> {
    return this.transport.post('user/update-fields', body);
  }

  /** Создать диплом пользователю */
  async createDiploma(body: CreateDiplomaRequest): Promise<ApiResponse<Diploma[]>> {
    return this.transport.post('user/create-diploma', body);
  }

  /** Получить баланс пользователя */
  async getUserBalance(
    params: UserIdentifier & { type?: BalanceType },
  ): Promise<ApiResponse<UserBalance[]>> {
    return this.transport.get('user/get-balance', params);
  }

  /** Получить ответы пользователя на уроки */
  async getUserLessonAnswers(params: UserIdentifier): Promise<ApiResponse<LessonAnswer[]>> {
    return this.transport.get('user/get-lesson-answers', params);
  }

  /** Получить ответы пользователя */
  async getUserAnswers(params: UserIdentifier): Promise<ApiResponse<LessonAnswer[]>> {
    return this.transport.get('user/get-answers', params);
  }

  /** Найти пользователя по Telegram Chat ID */
  async getUserByTelegramChatId(chatId: number): Promise<ApiResponse<User[]>> {
    return this.transport.get('user/get-user-by-telegram-chat-id', { chatId });
  }

  /** Получить кастомные поля пользователя */
  async getUserCustomFields(params: UserIdentifier): Promise<ApiResponse<UserCustomFields[]>> {
    return this.transport.get('user/get-custom-fields', params);
  }

  /** Получить заказы пользователя */
  async getUserDeals(params: UserIdentifier): Promise<ApiResponse<Deal[]>> {
    return this.transport.get('user/get-deals', params);
  }

  /** Получить дипломы пользователя */
  async getUserDiplomas(params: UserIdentifier): Promise<ApiResponse<Diploma[]>> {
    return this.transport.get('user/get-diplomas', params);
  }

  /** Получить поля пользователя */
  async getUserFields(params: UserIdentifier): Promise<ApiResponse<User[]>> {
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
  async getUserPurchases(params: UserIdentifier): Promise<ApiResponse<UserPurchase[]>> {
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
  async getAllWebinars(): Promise<ApiResponse<Webinar[]>> {
    return this.transport.get('webinar/get-all-webinars');
  }

  /** Получить вебинары по ID */
  async getWebinarsByIds(body: GetWebinarsByIdsRequest): Promise<ApiResponse<Webinar[]>> {
    return this.transport.post('webinar/get-webinars-by-ids', body);
  }
}
