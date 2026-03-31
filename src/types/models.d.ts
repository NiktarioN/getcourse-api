/** Расписание пользователя */
interface UserSchedule {
  state: string;
  schedule_type: 'individual' | 'common';
  training_title: string;
  image: string | null;
  title: string;
  start_at: string;
  teacher_name: string;
}

/** Позиция заказа */
interface DealPosition {
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
type DealStatus =
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
interface Deal {
  id: number;
  ACCOUNT_ID: number;
  user_id: number;
  updated_at: string;
  created_at: string;
  created_user_id: number;
  cost: number;
  currency: string;
  status: DealStatus;
  is_payed: number;
  title: string;
  number: number;
  foreign_code: string;
  manager_user_id: number;
  partner_user_id: number | null;
  partner_code_id: number | null;
  payed_value: number;
  earned_value: number;
  payed_at: string | null;
  is_finished: number;
  finished_at: string | null;
  user_payed_money_value: number;
  created_by_session_id: number | null;
  client_deal_number: number;
  promo_code_id: number | null;
  cancel_reason_id: number;
  cancel_reason_comment: string;
  status_updated_at: string;
  to_deposit_money_value: number;
  created_by_visit_id: number | null;
  for_account_id: number | null;
  positions: DealPosition[];
}

/** Сообщение из истории диалога */
interface DialogMessage {
  created_at: string;
  user_id: number;
  message_type: string;
  user_type: string;
  department: {
    id: number;
    title: string;
  };
  comment_text: string;
}

/** Диплом пользователя */
interface Diploma {
  id: number;
  number: string;
  diploma_template_id: number;
  training_id: number | null;
  issued_at: string;
  image: string | null;
  user_id: number;
  title: string;
}

/** Комментарий к ответу на урок */
interface LessonAnswerComment {
  id: number;
  comment_text: string;
  user_id: number;
  files: string;
  created_at: string;
}

/** Статус ответа на урок */
type LessonAnswerStatus = 'new' | 'declined' | 'accepted' | 'viewed';

/** Тип ответа на урок */
type LessonAnswerType = 'mission_answer' | 'free_comment';

/** Ответ на урок */
interface LessonAnswer {
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
  reviewed_at: string;
  review_text: string;
  review_file: string;
  training_id: number;
  training_name: string;
  need_teacher_reaction: number;
  need_teacher_reaction_at: string;
  response_teacher_id: number;
}

/** Предложение (продукт/оффер) */
interface Offer {
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
interface PhoneCall {
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
interface ContactActivity {
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
interface UserPurchase {
  id: number;
  product_id: number;
  user_id: number;
  start_at: string;
  finish_at: string;
  period_type: string;
  is_actual: number;
  created_at: string;
  updated_at: string;
  money_sum: number;
  is_payed: number;
  state: string | null;
}

/** Тренинг */
interface Training {
  id: number;
  title: string;
  description: string;
  created_at: string;
  status: string;
  lesson_count: number;
}

/** Параметры вебинара */
interface WebinarParam {
  title: string;
  teaser_description: string;
  show_page_login: number;
}

/** Тип вебинара */
type WebinarType = 'hangouts' | 'bigbluebutton';

/** Статус вебинара */
type WebinarStatus = 'new' | 'opened' | 'finished' | 'closed';

/** Вебинар */
interface Webinar {
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

/** Пользователь */
interface User {
  id: number;
  deleted: number;
  deleted_at: string | null;
  type: string;
  profile_image: string | null;
  status: string;
  created_at: string;
  profile_id: number;
  activated_at: string;
  first_name: string;
  last_name: string;
  country: string | null;
  city: string | null;
  phone: string | null;
  phone_standart: string | null;
  phone_confirmed: number;
  comment: string | null;
  partner_user_id: number | null;
  subscribe_status: string;
  timezone_offset: number;
  birthday: string | null;
  language: string;
  gender: string | null;
  is_email_confirmed: number;
  geo_area_id: number | null;
}

/** Кастомное поле пользователя */
interface UserCustomFields {
  name: string;
  value: string;
  type: string;
  units: string;
}

/** Цель пользователя */
interface UserGoal {
  id: number;
  name: string;
  value: string;
  type: string;
  units: string;
}

/** Группа пользователей */
interface Group {
  id: number;
  name: string;
}

/** Персональный менеджер */
interface PersonalManager {
  id: number;
  name: string;
  email: string;
}

/** Тег заказа */
interface DealTag {
  dealId: number;
  tags: string[];
}

/** Тег оффера */
interface OfferTag {
  offerId: number;
  tags: string[];
}

/** Кастомное поле заказа */
interface DealCustomField {
  id: number;
  value: string;
}

/** Информация о балансе пользователя */
interface UserBalance {
  value: number;
  currency: string;
  type: string;
}

/** Причина отмены заказа */
interface CancelReason {
  id: number;
  name: string;
}
