/**
 * Транспорт сообщения диалога или тикета HelpDesk:
 * 0 — сайт, 1 — email, 2 — SMS, 3 — Telegram, 4 — Facebook, 5 — VK,
 * 6 — Chatium, 7 — WhatsApp, 8 — Viber, 11 — форма обратной связи,
 * 12 — форма GC, 13 — MAX, 14 — Instagram
 */
export type MessageTransport = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 11 | 12 | 13 | 14;

/** Отдел поддержки */
export interface DialogDepartment {
  id: number;
  title: string;
}

/** Кто отправил сообщение */
export type MessageUserType = 'Сотрудник' | 'Ученик';

/** Направление сообщения относительно школы */
export type MessageType = 'Входящее' | 'Исходящее';

/** Файл, прикрепляемый к сообщению диалога или тикета */
export interface MessageAttachment {
  /** Имя файла с расширением — GetCourse определяет тип файла только по нему */
  filename: string;
  /** Содержимое файла */
  content: Uint8Array | Blob;
}

/** Результат отправки сообщения — вместе с ID созданного комментария */
export interface SentMessageResult {
  result: boolean;
  /** ID созданного комментария */
  comment_id: number;
}

/** Результат отправки сообщения в диалог */
export interface SentDialogMessageResult extends SentMessageResult {
  /** ID диалога — новый, если диалог был создан */
  dialog_id: number;
}

/** Результат отправки сообщения в тикет HelpDesk */
export interface SentTicketMessageResult extends SentMessageResult {
  ticket_id: number;
}

/** Сообщение из истории диалога или тикета HelpDesk */
export interface DialogMessage {
  message_id: number;
  created_at: string;
  user_id: number;
  message_type: MessageType;
  user_type: MessageUserType;
  department: DialogDepartment;
  attached_files: { url: string }[] | null;
  transport: (MessageTransport | null)[] | null;
  comment_text: string;
}

/** Диалог пользователя с историей сообщений */
export interface UserDialog {
  dialog_id: number;
  messages: DialogMessage[];
}

/** Результат добавления заметки */
export interface AddedNoteResult {
  result: boolean;
  /** ID созданной заметки */
  note_id: number;
}
