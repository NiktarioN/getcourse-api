/** Тип звонка */
export type CallDirection = 'outcome' | 'income';

/** Результат звонка */
export type CallFinishStatus = 'contacted' | 'failed';

/** Причина неудачного звонка */
export type CallFailedReason = 'no_answer' | 'bad_phone' | 'phone_disabled';

/** Кем инициирована активность */
export type CallCreatedBy = 'user' | 'atc';

/** Объект, к которому привязана активность */
export type CallContextType = 'Deal' | 'User';

/** Информация о звонке */
export interface PhoneCall {
  id: number;
  file: string | null;
  caller: string | null;
  caller_name: string | null;
  to: string | null;
  gateway: string | null;
  /** Время звонка, unix-таймстамп в секундах */
  date: number;
  duration: number | null;
  billsec: number | null;
  hangup_cause: string | null;
  type: string | null;
  created_at: string | null;
  atc_id: number;
  file_link: string | null;
}

/** Звонки по заказу (со всеми попытками дозвона) */
export interface ContactActivity {
  id: number;
  user_id: number;
  manager_user_id: number;
  title: string;
  finish_status: CallFinishStatus;
  failed_reason: CallFailedReason | null;
  type: 'call';
  /** Поле «Описание» — его пишет addCallComment */
  description: string | null;
  direction: CallDirection;
  contact_time: string;
  context_type: CallContextType;
  context_id: number;
  created_at: string;
  updated_at: string;
  created_user_id: number | null;
  updated_user_id: number | null;
  created_by: CallCreatedBy;
  phone_calls: PhoneCall[];
  /** Поле «Транскрибация» — её пишет addCallTranscription */
  comment: string | null;
}

/** Привязка звонка: к заказу или пользователю — с ID, без привязки — оба null */
export type CallContext =
  | {
      [Type in CallContextType]: { context_type: Type; context_id: number };
    }[CallContextType]
  | { context_type: null; context_id: null };

/**
 * Звонок
 *
 * context_type: Deal — звонок по заказу, User — по пользователю, null — без привязки
 * Звонок по пользователю обычно приходит с null, а клиент — в user_id. Context User
 * бывает в редких случаях, тогда context_id совпадает с user_id
 */
export type Call = Omit<
  ContactActivity,
  'user_id' | 'manager_user_id' | 'context_type' | 'context_id'
> & {
  user_id: number | null;
  manager_user_id: number | null;
  /** Ссылки на записи разговора */
  attached_files: { url: string }[];
} & CallContext;
