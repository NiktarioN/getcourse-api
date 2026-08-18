/** Получить ответы анкеты */
export interface GetSurveyAnswersRequest {
  /** ID анкеты */
  surveyId: number;
  /** Количество ответов, не более 1000 (по умолчанию: 100) */
  limit?: number;
  /** Смещение для пагинации */
  offset?: number;
}
