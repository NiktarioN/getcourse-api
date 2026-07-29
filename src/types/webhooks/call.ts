import type {
  CallContextType,
  CallCreatedBy,
  CallDirection,
  CallFailedReason,
  CallFinishStatus,
} from '../models/call.ts';

/** Длительность звонка в секундах */
interface WebhookCallAtcDuration {
  billsec: number;
  seconds: number;
}

/** Данные АТС по звонку */
interface WebhookCallAtc {
  to: string;
  date: string;
  atc_id: number;
  caller: string;
  /** Часто встречаются: "Carousel_OnLinePBX", "Carusel", также попадаются номера телефонов и пустая строка */
  gateway: string;
  duration: WebhookCallAtcDuration;
  /** null у коротких звонков без записи разговора */
  file_link: string | null;
  caller_name: string;
  hangup_cause: string;
}

/** Объект звонка */
interface WebhookCallContext {
  id: number;
  type: CallContextType;
}

/** Объект звонка */
export interface CallWebhook {
  id: number;
  type: 'call';
  direction: CallDirection;
  created_by: CallCreatedBy;
  created_at: string;
  contact_time: string;
  finish_status: CallFinishStatus;
  failed_reason: CallFailedReason | null;
  /** null, если звонок не привязан к пользователю: неудачные звонки от АТС с неизвестного номера */
  user_id: number | null;
  manager_user_id: number | null;
  created_user_id: number | null;
  title: string | null;
  comment: string | null;
  description: string | null;
  atc: WebhookCallAtc | null;
  context: WebhookCallContext | null;
}
