import type { CurrencyType } from '../dictionaries.ts';

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

/** Информация о балансе пользователя */
export interface UserBalance {
  value: number;
  currency: CurrencyType;
  type: string;
}
