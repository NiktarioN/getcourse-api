/** Обновить покупку */
export interface UpdatePurchaseInfoRequest {
  /** ID покупки */
  user_product_id: number;
  /** ID ответственного преподавателя, `null` снимает назначение */
  response_teacher_id?: number | null;
  /** Тип периода: ограниченный или бессрочный */
  period_type?: 'limited' | 'unlimited';
  /** Дата начала в формате `2026-01-01 00:00:00`, `null` сбрасывает */
  start_at?: string | null;
  /** Дата окончания в формате `2026-02-01 00:00:00`, `null` сбрасывает */
  finish_at?: string | null;
}
