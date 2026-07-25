/** Расписание пользователя */
export interface UserSchedule {
  state: string;
  schedule_type: 'individual' | 'common';
  training_title: string;
  image: string | null;
  title: string;
  start_at: string;
  teacher_name: string;
}

/** Позиция заказа */
export interface DealPosition {
  id: number;
  offer_id: number;
  updated_at: string;
  created_at: string;
  quantity: number;
  title: string;
  price: number;
  currency: string;
  order_pos: number;
  user_product_id: number | null;
  source_price: number;
  start_at: string | null;
}

/** Статус заказа */
export type DealStatus =
  | 'new'
  | 'in_work'
  | 'not_confirmed'
  | 'payment_waiting'
  | 'waiting_for_return'
  | 'part_payed'
  | 'payed'
  | 'cancelled'
  | 'false';

/** Заказ */
export interface Deal {
  id: number;
  account_id: number;
  user_id: number;
  updated_at: string;
  created_at: string;
  created_user_id: number;
  cost: number;
  currency: string;
  status: DealStatus;
  is_payed: boolean;
  title: string;
  number: number;
  foreign_code: string;
  manager_user_id: number | null;
  partner_user_id: number | null;
  partner_code_id: number | null;
  payment_link: string;
  payed_value: number;
  earned_value: number;
  commission_value: number;
  payed_at: string | null;
  is_finished: boolean;
  finished_at: string | null;
  user_payed_money_value: number;
  created_by_session_id: number | null;
  client_deal_number: number;
  promo_code_id: number | null;
  cancel_reason_id: number | null;
  cancel_reason_comment: string | null;
  status_updated_at: string | null;
  to_deposit_money_value: number;
  created_by_visit_id: number | null;
  for_account_id: number | null;
  positions: DealPosition[];
}

/** Сообщение из истории диалога */
export interface DialogMessage {
  message_id: number;
  created_at: string;
  user_id: number;
  message_type: string;
  user_type: string;
  department: {
    id: number;
    title: string;
  };
  attached_files: { url: string }[] | null;
  transport: (number | null)[] | null;
  comment_text: string;
}

/** Диплом пользователя */
export interface Diploma {
  id: number;
  number: string;
  diploma_template_id: number;
  training_id: number | null;
  issued_at: string;
  image: string | null;
  user_id: number;
  title: string;
}

/** Дополнительное поле ответа на урок */
export interface LessonAnswerAdditionalField {
  id: number;
  title: string;
  type: string;
  required: string | boolean;
  hidden: boolean;
  value: string | string[] | { text: string; hash: string } | null;
}

/** Комментарий к ответу на урок */
export interface LessonAnswerComment {
  id: number;
  comment_text: string;
  user_id: number;
  files: string | string[];
  created_at: string;
}

/** Статус ответа на урок */
export type LessonAnswerStatus = 'new' | 'declined' | 'accepted' | 'viewed';

/** Тип ответа на урок */
export type LessonAnswerType = 'mission_answer' | 'free_comment' | 'mission_answer_no_check';

/** Ответ на урок */
export interface LessonAnswer {
  id: number;
  lesson_id: number;
  lesson_name: string;
  answer_text: string;
  user_id: number;
  created_at: string;
  updated_at: string;
  status: LessonAnswerStatus;
  type: LessonAnswerType;
  reviewer_user_id: number;
  reviewed_at: string | null;
  review_text?: string | null;
  review_file?: string | null;
  training_id: number;
  training_name: string;
  need_teacher_reaction: 1 | 0;
  need_teacher_reaction_at: string;
  response_teacher_id: number | null;
  comments: LessonAnswerComment[];
  additional_fields: LessonAnswerAdditionalField[];
}

/** Предложение */
export interface Offer {
  id: number;
  title: string;
  code: string;
  price: number;
  discount_value: number;
  final_price: number;
  currency: string;
  status: string;
  params: Record<string, unknown>;
}

/** Звонок по заказу */
export interface PhoneCall {
  id: number;
  file: string | null;
  caller: string | null;
  caller_name: string | null;
  to: string | null;
  gateway: string | null;
  date: string | null;
  duration: number | null;
  billsec: number | null;
  hangup_cause: string | null;
  type: string | null;
  created_at: string | null;
  atc_id: string | null;
  file_link: string;
}

/** Контактная активность (комментарий к заказу) */
export interface ContactActivity {
  id: number;
  user_id: number;
  manager_user_id: number;
  title: string;
  finish_status: string;
  failed_reason: string | null;
  type: string;
  description: string | null;
  direction: string;
  contact_time: string;
  context_type: string;
  context_id: number;
  created_at: string;
  updated_at: string;
  created_user_id: number;
  updated_user_id: number | null;
  created_by: string;
  phone_calls: PhoneCall[];
}

/** Покупка пользователя */
export interface UserPurchase {
  id: number;
  product_id: number;
  user_id: number;
  ACCOUNT_ID: number;
  initial_deal_position_id: number | null;
  start_at: string | null;
  finish_at: string | null;
  period_type: string;
  is_actual: number;
  is_active: number;
  is_payed: number;
  is_auto_prolongate: number;
  is_disabled: number;
  is_disabled_by_manager: number | null;
  number: number;
  money_sum: number;
  state: string | null;
  created_at: string;
  updated_at: string;
  rollbacked_at: string | null;
  user_started_at: string | null;
  user_finished_at: string | null;
  template_payment_id: number | null;
  replaced_by_user_product_id: number | null;
  saas_account_id: number | null;
  stream_id: number | null;
  prolong_offer_id: number | null;
  promo_code_id: number | null;
  cancel_reason_id: number | null;
  form_value_set_id: number | null;
  user_product_group_id: number | null;
  response_teacher_id: number | null;
  auto_prolong_enabled: number | null;
  last_prolong_status: string | null;
  manager_status: number;
  manager_status_comment: string | null;
  need_select_stream: number;
  training_options: number;
  training_answer_priority: number;
}

/** Тренинг */
export interface Training {
  id: number;
  title: string;
  description: string;
  created_at: string;
  status: string;
  lesson_count: number;
}

/** Параметры вебинара */
export interface WebinarParam {
  title: string;
  teaser_description: string;
  show_page_login: number;
}

/** Тип вебинара */
export type WebinarType = 'hangouts' | 'bigbluebutton';

/** Статус вебинара */
export type WebinarStatus = 'new' | 'opened' | 'finished' | 'closed';

/** Вебинар */
export interface Webinar {
  id: number;
  user_id: number;
  name: string;
  status: WebinarStatus;
  created_at: string;
  type: WebinarType;
  subtype: number;
  scenario_id: number;
  disabled_comments: number;
  access_type: number;
  url_redirrect: string;
  slide_id: string;
  view_type: number;
  isolated_chat: number;
  type_schedule: number;
  params: WebinarParam;
}

/** Связки пользователя с ботами мессенджеров */
export interface UserBotLink {
  telegram: { gc_bot_id: number; tg_user_id: number }[];
  max: { gc_bot_id: number; max_user_id: number }[];
  vk: { vk_user_id: number }[];
}

/** Пользователь */
export interface User {
  id: number;
  deleted: boolean;
  deleted_at: string | null;
  type: string;
  profile_image: string | null;
  status: string;
  created_at: string;
  profile_id: number;
  activated_at: string;
  first_name: string | null;
  last_name: string | null;
  country: string | null;
  city: string | null;
  phone: string | null;
  phone_standart: string | null;
  phone_confirmed: boolean;
  comment: string | null;
  partner_user_id: number | null;
  subscribe_status: string;
  timezone_offset: number;
  birthday: string | null;
  language: string;
  gender: string | null;
  email: string;
  is_email_confirmed: boolean;
  geo_area_id: number | null;
  bot_link: UserBotLink;
}

/** Цель пользователя */
export interface UserGoal {
  id: number;
  name: string;
  value: string;
  type: string;
  units: string;
}

/** Группа пользователей */
export interface Group {
  id: number;
  name: string;
}

/** Персональный менеджер */
export interface PersonalManager {
  id: number;
  name: string;
  email: string;
}

/** Тег заказа */
export interface DealTag {
  dealId: number;
  tags: string[];
}

/** Тег оффера */
export interface OfferTag {
  offerId: number;
  tags: string[];
}

/** Информация о балансе пользователя */
export interface UserBalance {
  value: number;
  currency: string;
  type: string;
}

/** Комментарий к заказу */
export interface DealComment {
  id: number;
  created_at: string;
  user_id: number;
  text: string;
}

/** Звонок по заказу */
export interface DealCall {
  id: number;
  created_at: string;
  user_id: number;
  text: string;
  file_link: string;
  duration: number | null;
}

/** Причина отмены заказа */
export interface CancelReason {
  id: number;
  name: string;
}

/** Тип поля */
type FieldType =
  | 'select'
  | 'multiselect'
  | 'string'
  | 'text'
  | 'date'
  | 'numeric'
  | 'checkbox'
  | 'file';

/** Значение поля */
type FieldValue = string | string[] | number | null;

/** Кастомное поле заказа */
export interface DealCustomField {
  id: number;
  name: string;
  value: FieldValue;
  type: FieldType;
}

/** Кастомное поле пользователя */
export interface UserCustomField {
  name: string;
  value: FieldValue;
  type: FieldType;
  units: string | null;
}

/** Кастомное поле после обновления */
export interface UpdateCustomField {
  name: string;
  value: FieldValue;
  type: FieldType;
  units: string | null;
}
